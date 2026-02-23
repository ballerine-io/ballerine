import React, { useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import {
  AlertBanner,
  AttributeBadges,
  CollapsibleSection,
  ReadOnlyDetailsInline,
  computeAlertLevel,
} from './components';

interface VerificationPluginOutput {
  name?: string;
  verificationStatus?: string;
  status?: string;
  confidenceScore?: number;
  verifiedAttributes?: string[];
  failedAttributes?: string[];
  metadata?: {
    extractedData?: Record<string, unknown>;
    possibleDuplicates?:
      | Array<{
          personId?: string;
          confidenceScore?: number;
        }>
      | string[];
    methodsExecuted?: string[];
    [key: string]: unknown;
  };
  data?: Record<string, unknown>;
}

interface DeviceDedupOutput {
  name?: string;
  status?: string;
  isDuplicate?: boolean;
  duplicateIds?: string[];
  confidence?: number;
  matchedAttributes?: string[];
  data?: Record<string, unknown>;
}

interface FinancialAnalysisResult {
  context?: string;
  success?: boolean;
  error?: string;
  // Unified API forwards document-api response which nests fields under `result`.
  result?: Record<string, unknown>;
  documentType?: string;
  suggestedCategory?: string;
  hasFinancialData?: boolean;
  estimatedIncome?: number | null;
  currency?: string | null;
  dateRange?: string | null;
  isAuthentic?: boolean;
  qualityScore?: number;
  description?: string;
  concerns?: string[];
}

interface LoanFinancialAnalysisOutput {
  name?: string;
  status?: string;
  results?: FinancialAnalysisResult[];
  data?: {
    results?: FinancialAnalysisResult[];
    [key: string]: unknown;
  };
}

interface BusinessPhotoAnalysisResult {
  context?: string;
  success?: boolean;
  error?: string;
  result?: Record<string, unknown>;
  isLegitimate?: boolean;
  businessCategory?: string | null;
  businessNature?: string | null;
  primaryProducts?: string[];
  productCategories?: string[];
  estimatedScale?: string;
  hasSignage?: boolean;
  hasCustomers?: boolean;
  qualityScore?: number;
  description?: string;
  concerns?: string[];
}

interface BusinessPhotoClassificationOutput {
  name?: string;
  status?: string;
  results?: BusinessPhotoAnalysisResult[];
  data?: { results?: BusinessPhotoAnalysisResult[] };
}

const STATUS_DISPLAY: Record<string, { label: string; variant: string }> = {
  VERIFIED: { label: 'Verified', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  REQUIRES_REVIEW: { label: 'Requires Review', variant: 'warning' },
  ERROR: { label: 'Error', variant: 'destructive' },
  PENDING: { label: 'Pending', variant: 'info' },
};

const toTitleCase = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const formatConfidence = (score: number | undefined): string => {
  if (score === undefined || score === null) {
return 'N/A';
}

  // Normalize: scores > 1 are on 0-100 scale, scores <= 1 are on 0-1 scale
  const normalized = score > 1 ? score : score * 100;

  return `${Math.round(normalized)}%`;
};

const formatQualityScore = (score: unknown): string => {
  if (typeof score !== 'number' || Number.isNaN(score)) {
return 'N/A';
}

  // Normalize: scores > 1 are on 0-100 scale, scores <= 1 are on 0-1 scale.
  const normalized = score > 1 ? score : score * 100;

  return `${Math.round(normalized)}%`;
};

const extractNestedResult = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== 'object') {
return undefined;
}

  const v = value as Record<string, unknown>;

  if (v['result'] && typeof v['result'] === 'object') {
    return v['result'] as Record<string, unknown>;
  }

  return v;
};

const getResultsArray = (output: unknown): unknown[] => {
  if (!output || typeof output !== 'object') {
return [];
}

  const o = output as Record<string, unknown>;
  const direct = o['results'];

  if (Array.isArray(direct)) {
return direct;
}

  const data = o['data'];

  if (data && typeof data === 'object') {
    const nested = (data as Record<string, unknown>)['results'];

    if (Array.isArray(nested)) {
return nested;
}
  }

  return [];
};

interface DocumentDetail {
  imageUrl?: string;
  base64?: string;
  title?: string;
  fileType?: string;
}

interface AdaptedDocument {
  category?: string;
  type?: string;
  details?: DocumentDetail[];
}

const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  proof_of_identity: 'Identity Documents',
  proof_of_identity_ownership: 'Selfie / Facial Match',
  proof_of_address: 'Proof of Address',
};

const computeOverallConfidence = (
  docVerification: VerificationPluginOutput | undefined,
  facialVerification: VerificationPluginOutput | undefined,
): number | null => {
  const scores: number[] = [];

  if (docVerification?.confidenceScore !== undefined && docVerification.confidenceScore !== null) {
    scores.push(docVerification.confidenceScore > 1 ? docVerification.confidenceScore : docVerification.confidenceScore * 100);
  }

  if (facialVerification?.confidenceScore !== undefined && facialVerification.confidenceScore !== null) {
    scores.push(facialVerification.confidenceScore > 1 ? facialVerification.confidenceScore : facialVerification.confidenceScore * 100);
  }

  if (scores.length === 0) return null;

  // Conservative approach: weakest link determines overall trust
  return Math.min(...scores);
};

const getStatusBadge = (
  status: string | undefined,
): { text: string; variant: 'success' | 'destructive' | 'warning' | 'info' | 'violet' } | undefined => {
  if (!status) return undefined;
  const display = STATUS_DISPLAY[status];
  if (!display) return { text: status, variant: 'info' };

  return { text: display.label, variant: display.variant as 'success' | 'destructive' | 'warning' | 'info' };
};

const isNonVerified = (status: string | undefined): boolean =>
  !!status && status !== 'VERIFIED';

export const useVerificationResultsBlock = ({
  pluginsOutput,
  documents,
  isLoadingDocuments,
}: {
  pluginsOutput: Record<string, unknown> | undefined;
  documents?: AdaptedDocument[];
  isLoadingDocuments?: boolean;
}) => {
  return useMemo(() => {
    const docVerification = pluginsOutput?.document_verification as
      | VerificationPluginOutput
      | undefined;
    const facialVerification = pluginsOutput?.facial_verification as
      | VerificationPluginOutput
      | undefined;
    const businessDocumentVerification = pluginsOutput?.business_document_verification as
      | VerificationPluginOutput
      | undefined;
    const addressVerification = pluginsOutput?.address_verification as
      | VerificationPluginOutput
      | undefined;
    const marketCardVerification = pluginsOutput?.market_card_verification as
      | VerificationPluginOutput
      | undefined;
    const deviceDedup = pluginsOutput?.device_dedup_check as DeviceDedupOutput | undefined;
    const loanFinancialAnalysis = pluginsOutput?.loan_financial_analysis as
      | LoanFinancialAnalysisOutput
      | undefined;
    const businessPhotoClassification = pluginsOutput?.business_photo_classification as
      | BusinessPhotoClassificationOutput
      | undefined;

    if (
      !docVerification &&
      !facialVerification &&
      !businessDocumentVerification &&
      !addressVerification &&
      !marketCardVerification &&
      !deviceDedup &&
      !loanFinancialAnalysis &&
      !businessPhotoClassification
    ) {
      return [];
    }

    const blocks = createBlocksTyped().addBlock();

    // --- Alert banner ---
    const alertLevel = computeAlertLevel(
      [
        docVerification?.verificationStatus,
        facialVerification?.verificationStatus,
        businessDocumentVerification?.verificationStatus,
        addressVerification?.verificationStatus,
        marketCardVerification?.verificationStatus,
      ],
      deviceDedup?.isDuplicate,
    );

    blocks.addCell({
      type: 'node',
      value: React.createElement(AlertBanner, { level: alertLevel }),
    });

    // --- Overall heading + status badges + confidence scores (non-collapsible) ---
    const overallConfidence = computeOverallConfidence(docVerification, facialVerification);

    const overallBlock = createBlocksTyped()
      .addBlock()
      .addCell({
        id: 'verification-results-heading',
        type: 'heading',
        value: overallConfidence !== null
          ? `Verification Results — Overall Confidence: ${formatConfidence(overallConfidence)}`
          : 'Verification Results',
      })
      .addCell({
        id: 'verification-results-subheading',
        type: 'subheading',
        value: 'Unified API Verification',
        props: { className: 'mb-4' },
      });

    // Add status badges for visual differentiation
    if (docVerification?.verificationStatus) {
      const display = STATUS_DISPLAY[docVerification.verificationStatus] ?? {
        label: docVerification.verificationStatus,
        variant: 'info',
      };
      overallBlock.addCell({
        type: 'badge',
        value: `Document: ${display.label}`,
        props: {
          variant: display.variant as 'success' | 'destructive' | 'warning' | 'info',
          className: 'text-sm font-bold mr-2',
        },
      });
    }

    if (facialVerification?.verificationStatus) {
      const display = STATUS_DISPLAY[facialVerification.verificationStatus] ?? {
        label: facialVerification.verificationStatus,
        variant: 'info',
      };
      overallBlock.addCell({
        type: 'badge',
        value: `Facial: ${display.label}`,
        props: {
          variant: display.variant as 'success' | 'destructive' | 'warning' | 'info',
          className: 'text-sm font-bold mr-2',
        },
      });
    }

    if (businessDocumentVerification?.verificationStatus) {
      const display = STATUS_DISPLAY[businessDocumentVerification.verificationStatus] ?? {
        label: businessDocumentVerification.verificationStatus,
        variant: 'info',
      };
      overallBlock.addCell({
        type: 'badge',
        value: `Business Docs: ${display.label}`,
        props: {
          variant: display.variant as 'success' | 'destructive' | 'warning' | 'info',
          className: 'text-sm font-bold mr-2',
        },
      });
    }

    if (addressVerification?.verificationStatus) {
      const display = STATUS_DISPLAY[addressVerification.verificationStatus] ?? {
        label: addressVerification.verificationStatus,
        variant: 'info',
      };
      overallBlock.addCell({
        type: 'badge',
        value: `Address: ${display.label}`,
        props: {
          variant: display.variant as 'success' | 'destructive' | 'warning' | 'info',
          className: 'text-sm font-bold mr-2',
        },
      });
    }

    if (marketCardVerification?.verificationStatus) {
      const display = STATUS_DISPLAY[marketCardVerification.verificationStatus] ?? {
        label: marketCardVerification.verificationStatus,
        variant: 'info',
      };
      overallBlock.addCell({
        type: 'badge',
        value: `Market Card: ${display.label}`,
        props: {
          variant: display.variant as 'success' | 'destructive' | 'warning' | 'info',
          className: 'text-sm font-bold mr-2',
        },
      });
    }

    // Add confidence scores as details
    const overallDetails = buildOverallStatus(
      docVerification,
      facialVerification,
      businessDocumentVerification,
      addressVerification,
      marketCardVerification,
    );

    if (overallDetails.length > 0) {
      overallBlock.addCell({
        type: 'readOnlyDetails',
        value: overallDetails,
      });
    }

    blocks.addCell({
      type: 'block',
      value: overallBlock.buildFlat(),
    });

    // --- Document Verification (collapsible) ---
    if (docVerification) {
      const docDetails = buildUnifiedVerificationDetails(docVerification);
      const extractedData = (docVerification.metadata?.extractedData ?? docVerification.data) as
        | Record<string, unknown>
        | undefined;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Document Verification',
            defaultOpen: isNonVerified(docVerification.verificationStatus),
            statusBadge: getStatusBadge(docVerification.verificationStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: docDetails }),
          React.createElement(AttributeBadges, {
            verified: docVerification.verifiedAttributes,
            failed: docVerification.failedAttributes,
          }),
          extractedDetails.length > 0 &&
            React.createElement(
              CollapsibleSection,
              { title: `Extracted Document Data (${extractedDetails.length})`, defaultOpen: false },
              React.createElement(ReadOnlyDetailsInline, { details: extractedDetails }),
            ),
        ),
      });
    }

    // --- Facial Verification (collapsible) ---
    if (facialVerification) {
      const facialDetails = buildUnifiedVerificationDetails(facialVerification);
      const possibleDuplicates = normalizePossibleDuplicates(
        facialVerification.metadata?.possibleDuplicates,
      );

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Facial Verification',
            defaultOpen: isNonVerified(facialVerification.verificationStatus),
            statusBadge: getStatusBadge(facialVerification.verificationStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: facialDetails }),
          React.createElement(AttributeBadges, {
            verified: facialVerification.verifiedAttributes,
            failed: facialVerification.failedAttributes,
          }),
          possibleDuplicates.length > 0 &&
            React.createElement(
              CollapsibleSection,
              {
                title: `Possible Duplicates (${possibleDuplicates.length})`,
                defaultOpen: false,
              },
              React.createElement(ReadOnlyDetailsInline, {
                details: possibleDuplicates.map((dup, idx) => ({
                  label: `Match #${idx + 1}`,
                  value:
                    dup.personId && dup.confidenceScore !== undefined
                      ? `Person ${dup.personId} — ${formatConfidence(dup.confidenceScore)} match`
                      : dup.personId
                      ? `Person ${dup.personId}`
                      : 'Unknown',
                })),
              }),
            ),
        ),
      });
    }

    // --- Business Document Verification (collapsible) ---
    if (businessDocumentVerification) {
      const bizDocDetails = buildUnifiedVerificationDetails(businessDocumentVerification);
      const extractedData = businessDocumentVerification.metadata?.extractedData;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Business Document Verification',
            defaultOpen: isNonVerified(businessDocumentVerification.verificationStatus),
            statusBadge: getStatusBadge(businessDocumentVerification.verificationStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: bizDocDetails }),
          React.createElement(AttributeBadges, {
            verified: businessDocumentVerification.verifiedAttributes,
            failed: businessDocumentVerification.failedAttributes,
          }),
          extractedDetails.length > 0 &&
            React.createElement(
              CollapsibleSection,
              { title: `Extracted Business Document Data (${extractedDetails.length})`, defaultOpen: false },
              React.createElement(ReadOnlyDetailsInline, { details: extractedDetails }),
            ),
        ),
      });
    }

    // --- Address Verification (collapsible) ---
    if (addressVerification) {
      const addrDetails = buildUnifiedVerificationDetails(addressVerification);
      const extractedData = addressVerification.metadata?.extractedData;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Address Verification',
            defaultOpen: isNonVerified(addressVerification.verificationStatus),
            statusBadge: getStatusBadge(addressVerification.verificationStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: addrDetails }),
          React.createElement(AttributeBadges, {
            verified: addressVerification.verifiedAttributes,
            failed: addressVerification.failedAttributes,
          }),
          extractedDetails.length > 0 &&
            React.createElement(
              CollapsibleSection,
              { title: `Extracted Address Data (${extractedDetails.length})`, defaultOpen: false },
              React.createElement(ReadOnlyDetailsInline, { details: extractedDetails }),
            ),
        ),
      });
    }

    // --- Market Card Verification (collapsible) ---
    if (marketCardVerification) {
      const mcDetails = buildUnifiedVerificationDetails(marketCardVerification);
      const extractedData = marketCardVerification.metadata?.extractedData;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Market Card Verification',
            defaultOpen: isNonVerified(marketCardVerification.verificationStatus),
            statusBadge: getStatusBadge(marketCardVerification.verificationStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: mcDetails }),
          React.createElement(AttributeBadges, {
            verified: marketCardVerification.verifiedAttributes,
            failed: marketCardVerification.failedAttributes,
          }),
          extractedDetails.length > 0 &&
            React.createElement(
              CollapsibleSection,
              { title: `Extracted Market Card Data (${extractedDetails.length})`, defaultOpen: false },
              React.createElement(ReadOnlyDetailsInline, { details: extractedDetails }),
            ),
        ),
      });
    }

    // --- Device Deduplication (collapsible) ---
    if (deviceDedup) {
      const dedupDetails = buildDeviceDedupDetails(deviceDedup);

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Device Deduplication',
            defaultOpen: !!deviceDedup.isDuplicate,
            statusBadge: deviceDedup.isDuplicate
              ? { text: 'Duplicate', variant: 'destructive' as const }
              : { text: 'Clean', variant: 'success' as const },
          },
          React.createElement(ReadOnlyDetailsInline, { details: dedupDetails }),
        ),
      });
    }

    // --- Loan Financial Analysis (collapsible) ---
    const loanFinancialResults = getResultsArray(
      loanFinancialAnalysis,
    ) as FinancialAnalysisResult[];

    if (loanFinancialResults.length > 0) {
      const loanDetails = buildLoanFinancialAnalysisDetails(loanFinancialResults);

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          { title: 'Loan Financial Analysis', defaultOpen: false },
          React.createElement(ReadOnlyDetailsInline, { details: loanDetails }),
        ),
      });
    }

    // --- Business Photo Analysis (collapsible) ---
    const businessPhotoResults = getResultsArray(
      businessPhotoClassification,
    ) as BusinessPhotoAnalysisResult[];

    if (businessPhotoResults.length > 0) {
      const photoDetails = buildBusinessPhotoAnalysisDetails(businessPhotoResults);

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          { title: 'Business Photo Analysis', defaultOpen: false },
          React.createElement(ReadOnlyDetailsInline, { details: photoDetails }),
        ),
      });
    }

    // --- Document images grouped by category (collapsible per category) ---
    if (documents && documents.length > 0) {
      const categorized = new Map<string, DocumentDetail[]>();

      for (const doc of documents) {
        const category = doc.category ?? 'other';
        const existing = categorized.get(category) ?? [];
        existing.push(...(doc.details ?? []));
        categorized.set(category, existing);
      }

      for (const [category, details] of categorized) {
        const validDetails = details.filter(d => d.imageUrl || d.base64);

        if (validDetails.length === 0) continue;

        const label = DOCUMENT_CATEGORY_LABELS[category] ?? toTitleCase(category);

        blocks.addCell({
          type: 'node',
          value: React.createElement(
            CollapsibleSection,
            { title: `${label} (${validDetails.length})`, defaultOpen: false },
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-3 p-4 md:grid-cols-3' },
              ...validDetails.map((d, idx) =>
                React.createElement(
                  'div',
                  { key: `${category}-${idx}`, className: 'flex flex-col gap-1' },
                  React.createElement('img', {
                    src: d.imageUrl || `data:image/jpeg;base64,${d.base64}`,
                    alt: d.title || `Document ${idx + 1}`,
                    className: 'rounded-lg border object-cover w-full max-h-[200px] cursor-pointer hover:opacity-80 transition-opacity',
                    loading: 'lazy' as const,
                  }),
                  d.title &&
                    React.createElement(
                      'span',
                      { className: 'text-xs text-muted-foreground truncate' },
                      d.title,
                    ),
                ),
              ),
            ),
          ),
        });
      }
    }

    return blocks.build();
  }, [
    pluginsOutput?.document_verification,
    pluginsOutput?.facial_verification,
    pluginsOutput?.business_document_verification,
    pluginsOutput?.address_verification,
    pluginsOutput?.market_card_verification,
    pluginsOutput?.device_dedup_check,
    pluginsOutput?.loan_financial_analysis,
    pluginsOutput?.business_photo_classification,
    documents,
    isLoadingDocuments,
  ]);
};

function buildOverallStatus(
  docVerification: VerificationPluginOutput | undefined,
  facialVerification: VerificationPluginOutput | undefined,
  businessDocVerification?: VerificationPluginOutput,
  addressVerification?: VerificationPluginOutput,
  marketCardVerification?: VerificationPluginOutput,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  if (docVerification?.confidenceScore !== undefined) {
    details.push({
      label: 'Document Confidence',
      value: formatConfidence(docVerification.confidenceScore),
    });
  }

  if (facialVerification?.confidenceScore !== undefined) {
    details.push({
      label: 'Facial Confidence',
      value: formatConfidence(facialVerification.confidenceScore),
    });
  }

  if (businessDocVerification?.confidenceScore !== undefined) {
    details.push({
      label: 'Business Document Confidence',
      value: formatConfidence(businessDocVerification.confidenceScore),
    });
  }

  if (addressVerification?.confidenceScore !== undefined) {
    details.push({
      label: 'Address Confidence',
      value: formatConfidence(addressVerification.confidenceScore),
    });
  }

  if (marketCardVerification?.confidenceScore !== undefined) {
    details.push({
      label: 'Market Card Confidence',
      value: formatConfidence(marketCardVerification.confidenceScore),
    });
  }

  return details;
}

function buildUnifiedVerificationDetails(
  plugin: VerificationPluginOutput,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  if (plugin.verificationStatus) {
    const statusDisplay = STATUS_DISPLAY[plugin.verificationStatus];
    details.push({
      label: 'Verification Status',
      value: statusDisplay?.label ?? toTitleCase(plugin.verificationStatus),
    });
  }

  if (plugin.status) {
    details.push({ label: 'Process Status', value: toTitleCase(plugin.status) });
  }

  if (plugin.confidenceScore !== undefined && plugin.confidenceScore !== null) {
    const isSystemError = plugin.verificationStatus === 'ERROR' && plugin.confidenceScore === 0;
    details.push({
      label: 'Confidence',
      value: isSystemError ? 'N/A (System Error)' : formatConfidence(plugin.confidenceScore),
    });
  }

  // Verified/failed attributes are now rendered as AttributeBadges (not comma strings)

  const methods = plugin.metadata?.methodsExecuted;

  if (methods && methods.length > 0) {
    details.push({ label: 'Methods Executed', value: methods.map(m => toTitleCase(m)).join(', ') });
  }

  const duplicates = normalizePossibleDuplicates(plugin.metadata?.possibleDuplicates);

  if (duplicates?.length) {
    details.push({ label: 'Possible Duplicates', value: String(duplicates.length) });
  }

  return details;
}

function normalizePossibleDuplicates(
  possibleDuplicates: unknown,
): Array<{ personId?: string; confidenceScore?: number }> {
  if (!possibleDuplicates) {
return [];
}

  if (Array.isArray(possibleDuplicates)) {
    // Unified API currently returns string[] of ids; legacy might return {personId, confidenceScore}[].
    if (possibleDuplicates.length === 0) {
return [];
}

    if (typeof possibleDuplicates[0] === 'string') {
      return (possibleDuplicates as string[]).map(id => ({ personId: id }));
    }

    if (typeof possibleDuplicates[0] === 'object' && possibleDuplicates[0] !== null) {
      return possibleDuplicates as Array<{ personId?: string; confidenceScore?: number }>;
    }
  }

  return [];
}

function buildDeviceDedupDetails(
  device: DeviceDedupOutput,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  details.push({
    label: 'Is Duplicate',
    value: device.isDuplicate === undefined ? 'Unknown' : device.isDuplicate ? 'Yes' : 'No',
  });

  if (device.confidence !== undefined) {
    details.push({ label: 'Confidence', value: formatConfidence(device.confidence) });
  }

  if (device.matchedAttributes && device.matchedAttributes.length > 0) {
    details.push({ label: 'Matched Attributes', value: device.matchedAttributes.join(', ') });
  }

  if (device.duplicateIds && device.duplicateIds.length > 0) {
    details.push({ label: 'Duplicate Device IDs', value: device.duplicateIds.join(', ') });
  }

  return details;
}

const INTERNAL_METADATA_KEYS = new Set([
  'methodBreakdown',
  'methodsExecuted',
  'possibleDuplicates',
  'processingTime',
  'requestId',
  'verificationId',
  'timestamp',
  'version',
  'pipeline',
  'strategies',
  'rawResponse',
  'errorDetails',
]);

function buildExtractedDataDetails(
  extractedData: Record<string, unknown>,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  for (const [sectionKey, sectionValue] of Object.entries(extractedData)) {
    if (INTERNAL_METADATA_KEYS.has(sectionKey)) continue;
    if (!sectionValue || typeof sectionValue !== 'object' || Array.isArray(sectionValue)) {
      if (sectionValue !== null && sectionValue !== undefined && sectionValue !== '') {
        details.push({ label: toTitleCase(sectionKey), value: String(sectionValue) });
      }

      continue;
    }

    for (const [fieldKey, fieldValue] of Object.entries(sectionValue as Record<string, unknown>)) {
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
continue;
}

      const field = fieldValue as Record<string, unknown>;
      const value =
        field && typeof field === 'object' && 'value' in field ? field['value'] : fieldValue;

      if (value === null || value === undefined || value === '') {
continue;
}

      details.push({
        label: `${toTitleCase(sectionKey)}: ${toTitleCase(fieldKey)}`,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      });
    }
  }

  return details;
}

function buildLoanFinancialAnalysisDetails(
  results: FinancialAnalysisResult[],
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  for (const [idx, result] of results.entries()) {
    const nested = extractNestedResult(result);
    const prefix = results.length > 1 ? `Doc ${idx + 1}: ` : '';

    if (result?.error) {
      details.push({ label: `${prefix}Error`, value: String(result.error) });
      continue;
    }

    const documentType = (nested?.['documentType'] ?? result.documentType) as string | undefined;
    const suggestedCategory = (nested?.['suggestedCategory'] ?? result.suggestedCategory) as
      | string
      | undefined;
    const estimatedIncome = (nested?.['estimatedIncome'] ?? result.estimatedIncome) as
      | number
      | null
      | undefined;
    const currency = (nested?.['currency'] ?? result.currency) as string | null | undefined;
    const isAuthentic = (nested?.['isAuthentic'] ?? result.isAuthentic) as boolean | undefined;
    const qualityScore = nested?.['qualityScore'] ?? result.qualityScore;
    const dateRange = (nested?.['dateRange'] ?? result.dateRange) as string | null | undefined;
    const concerns = (nested?.['concerns'] ?? result.concerns) as string[] | undefined;

    if (documentType) {
      details.push({ label: `${prefix}Document Type`, value: toTitleCase(documentType) });
    }

    if (suggestedCategory) {
      details.push({ label: `${prefix}Category`, value: toTitleCase(suggestedCategory) });
    }

    if (estimatedIncome !== undefined && estimatedIncome !== null) {
      const c = currency ?? '';
      details.push({
        label: `${prefix}Estimated Monthly Income`,
        value: `${c} ${estimatedIncome.toLocaleString()}`.trim(),
      });
    }

    if (isAuthentic !== undefined) {
      details.push({ label: `${prefix}Authentic`, value: isAuthentic ? 'Yes' : 'No' });
    }

    if (qualityScore !== undefined) {
      details.push({
        label: `${prefix}Quality Score`,
        value: formatQualityScore(qualityScore),
      });
    }

    if (dateRange) {
      details.push({ label: `${prefix}Date Range`, value: dateRange });
    }

    if (concerns && concerns.length > 0) {
      details.push({
        label: `${prefix}Concerns`,
        value: concerns.map(c => toTitleCase(c)).join(', '),
      });
    }
  }

  return details;
}

function buildBusinessPhotoAnalysisDetails(
  results: BusinessPhotoAnalysisResult[],
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  for (const [idx, result] of results.entries()) {
    const nested = extractNestedResult(result);
    const prefix = results.length > 1 ? `Image ${idx + 1}: ` : '';

    if (result?.error) {
      details.push({ label: `${prefix}Error`, value: String(result.error) });
      continue;
    }

    const isLegitimate = (nested?.['isLegitimate'] ?? result.isLegitimate) as boolean | undefined;
    const businessCategory = (nested?.['businessCategory'] ?? result.businessCategory) as
      | string
      | null
      | undefined;
    const businessNature = (nested?.['businessNature'] ?? result.businessNature) as
      | string
      | null
      | undefined;
    const estimatedScale = (nested?.['estimatedScale'] ?? result.estimatedScale) as
      | string
      | undefined;
    const hasSignage = (nested?.['hasSignage'] ?? result.hasSignage) as boolean | undefined;
    const hasCustomers = (nested?.['hasCustomers'] ?? result.hasCustomers) as boolean | undefined;
    const qualityScore = nested?.['qualityScore'] ?? result.qualityScore;
    const concerns = (nested?.['concerns'] ?? result.concerns) as string[] | undefined;

    if (isLegitimate !== undefined) {
      details.push({ label: `${prefix}Legitimate`, value: isLegitimate ? 'Yes' : 'No' });
    }

    if (businessCategory) {
      details.push({ label: `${prefix}Business Category`, value: toTitleCase(businessCategory) });
    }

    if (businessNature) {
      details.push({ label: `${prefix}Business Nature`, value: String(businessNature) });
    }

    if (estimatedScale) {
      details.push({ label: `${prefix}Estimated Scale`, value: toTitleCase(estimatedScale) });
    }

    if (hasSignage !== undefined) {
      details.push({ label: `${prefix}Has Signage`, value: hasSignage ? 'Yes' : 'No' });
    }

    if (hasCustomers !== undefined) {
      details.push({ label: `${prefix}Has Customers`, value: hasCustomers ? 'Yes' : 'No' });
    }

    if (qualityScore !== undefined) {
      details.push({
        label: `${prefix}Quality Score`,
        value: formatQualityScore(qualityScore),
      });
    }

    if (concerns?.length) {
      details.push({
        label: `${prefix}Concerns`,
        value: concerns.map(c => toTitleCase(c)).join(', '),
      });
    }
  }

  return details;
}
