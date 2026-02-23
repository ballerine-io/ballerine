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

const toTitleCase = (str: string) => str.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
return undefined;
}

  return value as Record<string, unknown>;
};

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) {
return undefined;
}

  const onlyStrings = value.filter((item): item is string => typeof item === 'string');

  return onlyStrings.length > 0 ? onlyStrings : undefined;
};

const getPluginStatus = (plugin: VerificationPluginOutput | undefined): string | undefined => {
  if (!plugin) {
return undefined;
}

  const pluginData = asRecord(plugin.data);
  const rawStatus = plugin.verificationStatus ?? pluginData?.['status'];
  if (typeof rawStatus !== 'string') {
return undefined;
}

  const normalizedStatus = rawStatus.toLowerCase();
  if (normalizedStatus === 'completed') {
    return 'VERIFIED';
  }
  if (normalizedStatus === 'failed') {
    return 'ERROR';
  }

  return rawStatus;
};

const getPluginConfidenceScore = (
  plugin: VerificationPluginOutput | undefined,
): number | undefined => {
  if (!plugin) {
return undefined;
}

  if (typeof plugin.confidenceScore === 'number') {
    return plugin.confidenceScore;
  }

  const pluginData = asRecord(plugin.data);
  const nestedData = asRecord(pluginData?.['data']);
  const fallbackConfidence = pluginData?.['confidenceScore'] ?? nestedData?.['confidence'];

  return typeof fallbackConfidence === 'number' ? fallbackConfidence : undefined;
};

const getPluginVerifiedAttributes = (
  plugin: VerificationPluginOutput | undefined,
): string[] | undefined => {
  if (!plugin) {
return undefined;
}

  if (plugin.verifiedAttributes && plugin.verifiedAttributes.length > 0) {
    return plugin.verifiedAttributes;
  }

  const pluginData = asRecord(plugin.data);
  const nestedData = asRecord(pluginData?.['data']);

  return asStringArray(pluginData?.['verifiedAttributes']) ??
    asStringArray(nestedData?.['verifiedAttributes']);
};

const getPluginFailedAttributes = (
  plugin: VerificationPluginOutput | undefined,
): string[] | undefined => {
  if (!plugin) {
return undefined;
}

  if (plugin.failedAttributes && plugin.failedAttributes.length > 0) {
    return plugin.failedAttributes;
  }

  const pluginData = asRecord(plugin.data);
  const nestedData = asRecord(pluginData?.['data']);

  return asStringArray(pluginData?.['failedAttributes']) ??
    asStringArray(nestedData?.['failedAttributes']);
};

const getPluginExtractedData = (
  plugin: VerificationPluginOutput | undefined,
): Record<string, unknown> | undefined => {
  if (!plugin) {
return undefined;
}

  if (plugin.metadata?.extractedData) {
    return plugin.metadata.extractedData;
  }

  const pluginData = asRecord(plugin.data);
  const nestedData = asRecord(pluginData?.['data']);
  const extractedFromNestedData = asRecord(nestedData?.['extractedData']);
  if (extractedFromNestedData) {
    return extractedFromNestedData;
  }

  const extractedFromTopLevelData = asRecord(pluginData?.['extractedData']);
  if (extractedFromTopLevelData) {
    return extractedFromTopLevelData;
  }

  const metadata = asRecord(pluginData?.['metadata']);
  const extractedFromMetadata = asRecord(metadata?.['extractedData']);
  if (extractedFromMetadata) {
    return extractedFromMetadata;
  }

  return pluginData;
};

const getPluginImages = (
  plugin: VerificationPluginOutput | undefined,
): Array<{ context?: string; content: string }> => {
  if (!plugin) {
return [];
}

  const pluginData = asRecord(plugin.data);
  const nestedData = asRecord(pluginData?.['data']);
  const rawImages = [pluginData?.['images'], nestedData?.['images']];
  const collected: Array<{ context?: string; content: string }> = [];

  for (const candidate of rawImages) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    for (const item of candidate) {
      if (typeof item === 'string') {
        collected.push({ content: item });
        continue;
      }

      const image = asRecord(item);
      const content = image?.['content'];
      const context = image?.['context'];
      if (typeof content === 'string' && content.length > 0) {
        collected.push({
          content,
          ...(typeof context === 'string' ? { context } : {}),
        });
      }
    }
  }

  return collected;
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

const getImageCategory = (context: string | undefined): string => {
  const normalized = (context || '').toLowerCase();
  if (normalized.includes('selfie') || normalized.includes('face')) {
    return 'proof_of_identity_ownership';
  }
  if (normalized.includes('address') || normalized.includes('utility')) {
    return 'proof_of_address';
  }

  return 'proof_of_identity';
};

const mapCallbackImagesToDocuments = (
  images: Array<{ context?: string; content: string }>,
): AdaptedDocument[] => {
  if (images.length === 0) {
return [];
}

  const grouped = new Map<string, DocumentDetail[]>();

  for (const image of images) {
    const category = getImageCategory(image.context);
    const existing = grouped.get(category) ?? [];
    const content = image.content.trim();

    if (!content) {
      continue;
    }

    const detail: DocumentDetail = {
      title: image.context ? toTitleCase(image.context.replace(/[\s-]+/g, '_')) : undefined,
    };

    if (content.startsWith('http://') || content.startsWith('https://') || content.startsWith('data:')) {
      detail.imageUrl = content;
    } else {
      detail.base64 = content;
    }

    existing.push(detail);
    grouped.set(category, existing);
  }

  return Array.from(grouped.entries()).map(([category, details]) => ({
    category,
    details,
  }));
};

const computeOverallConfidence = (
  docVerification: VerificationPluginOutput | undefined,
  facialVerification: VerificationPluginOutput | undefined,
): number | null => {
  const scores: number[] = [];

  const docConfidence = getPluginConfidenceScore(docVerification);
  const facialConfidence = getPluginConfidenceScore(facialVerification);

  if (docConfidence !== undefined && docConfidence !== null) {
    scores.push(docConfidence > 1 ? docConfidence : docConfidence * 100);
  }

  if (facialConfidence !== undefined && facialConfidence !== null) {
    scores.push(facialConfidence > 1 ? facialConfidence : facialConfidence * 100);
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

const needsReview = (status: string | undefined): boolean =>
  !!status && status !== 'VERIFIED' && status !== 'PENDING';

const isRawVerificationResult = (data: Record<string, unknown> | undefined): boolean =>
  !!data &&
  'confidenceScore' in data &&
  'failedAttributes' in data &&
  'verifiedAttributes' in data;

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
    const docStatus = getPluginStatus(docVerification);
    const facialStatus = getPluginStatus(facialVerification);
    const businessDocStatus = getPluginStatus(businessDocumentVerification);
    const addressStatus = getPluginStatus(addressVerification);
    const marketCardStatus = getPluginStatus(marketCardVerification);
    const docFailedAttributes = getPluginFailedAttributes(docVerification) ?? [];
    const facialFailedAttributes = getPluginFailedAttributes(facialVerification) ?? [];

    // --- Alert banner ---
    const alertLevel = computeAlertLevel(
      [
        docStatus,
        facialStatus,
        businessDocStatus,
        addressStatus,
        marketCardStatus,
      ],
      deviceDedup?.isDuplicate,
    );

    // Build specific alert message listing which checks need review and why
    const failedChecks: string[] = [];
    if (docVerification && needsReview(docStatus)) {
      const hasError = docFailedAttributes.some((a: string) => a.toLowerCase().includes('error'));
      failedChecks.push(hasError ? 'Document Verification (processing error)' : 'Document Verification');
    }
    if (facialVerification && needsReview(facialStatus)) {
      const hasError = facialStatus === 'ERROR' ||
        facialFailedAttributes.some((a: string) => a.toLowerCase().includes('error'));
      failedChecks.push(hasError ? 'Facial Verification (system error)' : 'Facial Verification');
    }
    if (businessDocumentVerification && needsReview(businessDocStatus)) {
      failedChecks.push('Business Document Verification');
    }
    if (addressVerification && needsReview(addressStatus)) {
      failedChecks.push('Address Verification');
    }
    if (marketCardVerification && needsReview(marketCardStatus)) {
      failedChecks.push('Market Card Verification');
    }
    const alertMessage = failedChecks.length > 0
      ? `Checks requiring review: ${failedChecks.join(', ')}`
      : undefined;

    blocks.addCell({
      type: 'node',
      value: React.createElement(AlertBanner, { level: alertLevel, message: alertMessage }),
    });

    // --- Overall heading + status badges + confidence scores (non-collapsible) ---
    const overallConfidence = computeOverallConfidence(docVerification, facialVerification);

    const primaryVerificationPlugins = [docVerification, facialVerification].filter(
      Boolean,
    ) as VerificationPluginOutput[];
    const allErrored = primaryVerificationPlugins.length > 0 && primaryVerificationPlugins.every(v => {
        const confidence = getPluginConfidenceScore(v);
        const status = getPluginStatus(v);
        const failedAttributes = getPluginFailedAttributes(v) ?? [];

        return confidence === 0 && (
          status === 'ERROR' ||
          failedAttributes.some((a: string) => a.toLowerCase().includes('error'))
        );
      });

    const confidenceText = allErrored
      ? 'Verification Results \u2014 Verification incomplete \u2014 processing errors occurred'
      : overallConfidence !== null
        ? `Verification Results \u2014 Overall Confidence: ${formatConfidence(overallConfidence)}`
        : 'Verification Results';

    const overallBlock = createBlocksTyped()
      .addBlock()
      .addCell({
        id: 'verification-results-heading',
        type: 'heading',
        value: confidenceText,
      })
      .addCell({
        id: 'verification-results-subheading',
        type: 'subheading',
        value: 'Unified API Verification',
        props: { className: 'mb-4' },
      });

    // Add status badges for visual differentiation
    if (docStatus) {
      const display = STATUS_DISPLAY[docStatus] ?? {
        label: docStatus,
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

    if (facialStatus) {
      const display = STATUS_DISPLAY[facialStatus] ?? {
        label: facialStatus,
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

    if (businessDocStatus) {
      const display = STATUS_DISPLAY[businessDocStatus] ?? {
        label: businessDocStatus,
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

    if (addressStatus) {
      const display = STATUS_DISPLAY[addressStatus] ?? {
        label: addressStatus,
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

    if (marketCardStatus) {
      const display = STATUS_DISPLAY[marketCardStatus] ?? {
        label: marketCardStatus,
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
      const extractedData = getPluginExtractedData(docVerification) as
        | Record<string, unknown>
        | undefined;

      const extractedDetails = (extractedData && !isRawVerificationResult(extractedData))
        ? buildExtractedDataDetails(extractedData)
        : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Document Verification',
            defaultOpen: isNonVerified(docStatus),
            statusBadge: getStatusBadge(docStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: docDetails }),
          React.createElement(AttributeBadges, {
            verified: getPluginVerifiedAttributes(docVerification),
            failed: docFailedAttributes,
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
      const facialData = asRecord(facialVerification.data);
      const facialDataMetadata = asRecord(facialData?.['metadata']);
      const possibleDuplicates = normalizePossibleDuplicates(
        facialVerification.metadata?.possibleDuplicates ??
          facialDataMetadata?.['possibleDuplicates'] ??
          facialData?.['possibleDuplicates'],
      );

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Facial Verification',
            defaultOpen: isNonVerified(facialStatus),
            statusBadge: getStatusBadge(facialStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: facialDetails }),
          React.createElement(AttributeBadges, {
            verified: getPluginVerifiedAttributes(facialVerification),
            failed: facialFailedAttributes,
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
      const extractedData = getPluginExtractedData(businessDocumentVerification);
      const extractedDetails = (extractedData && !isRawVerificationResult(extractedData))
        ? buildExtractedDataDetails(extractedData)
        : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Business Document Verification',
            defaultOpen: isNonVerified(businessDocStatus),
            statusBadge: getStatusBadge(businessDocStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: bizDocDetails }),
          React.createElement(AttributeBadges, {
            verified: getPluginVerifiedAttributes(businessDocumentVerification),
            failed: getPluginFailedAttributes(businessDocumentVerification),
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
      const extractedData = getPluginExtractedData(addressVerification);
      const extractedDetails = (extractedData && !isRawVerificationResult(extractedData))
        ? buildExtractedDataDetails(extractedData)
        : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Address Verification',
            defaultOpen: isNonVerified(addressStatus),
            statusBadge: getStatusBadge(addressStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: addrDetails }),
          React.createElement(AttributeBadges, {
            verified: getPluginVerifiedAttributes(addressVerification),
            failed: getPluginFailedAttributes(addressVerification),
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
      const extractedData = getPluginExtractedData(marketCardVerification);
      const extractedDetails = (extractedData && !isRawVerificationResult(extractedData))
        ? buildExtractedDataDetails(extractedData)
        : [];

      blocks.addCell({
        type: 'node',
        value: React.createElement(
          CollapsibleSection,
          {
            title: 'Market Card Verification',
            defaultOpen: isNonVerified(marketCardStatus),
            statusBadge: getStatusBadge(marketCardStatus),
          },
          React.createElement(ReadOnlyDetailsInline, { details: mcDetails }),
          React.createElement(AttributeBadges, {
            verified: getPluginVerifiedAttributes(marketCardVerification),
            failed: getPluginFailedAttributes(marketCardVerification),
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
    const callbackImageDocuments = mapCallbackImagesToDocuments([
      ...getPluginImages(docVerification),
      ...getPluginImages(facialVerification),
    ]);
    const documentsToRender = documents && documents.length > 0 ? documents : callbackImageDocuments;

    if (documentsToRender.length > 0) {
      const categorized = new Map<string, DocumentDetail[]>();

      for (const doc of documentsToRender) {
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

  const pushConfidenceDetail = (
    label: string,
    plugin: VerificationPluginOutput | undefined,
  ) => {
    const confidence = getPluginConfidenceScore(plugin);
    if (confidence === undefined || confidence === null) {
      return;
    }

    const status = getPluginStatus(plugin);
    const failedAttributes = getPluginFailedAttributes(plugin) ?? [];
    const isNoScore = confidence === 0 && (
      status === 'ERROR' || failedAttributes.some((attr: string) => attr.toLowerCase().includes('error'))
    );

    details.push({
      label,
      value: isNoScore ? 'N/A (Processing Error)' : formatConfidence(confidence),
    });
  };

  const documentConfidence = getPluginConfidenceScore(docVerification);
  const facialConfidence = getPluginConfidenceScore(facialVerification);
  const businessConfidence = getPluginConfidenceScore(businessDocVerification);
  const addressConfidence = getPluginConfidenceScore(addressVerification);
  const marketCardConfidence = getPluginConfidenceScore(marketCardVerification);

  if (documentConfidence !== undefined) {
    pushConfidenceDetail('Document Confidence', docVerification);
  }

  if (facialConfidence !== undefined) {
    pushConfidenceDetail('Facial Confidence', facialVerification);
  }

  if (businessConfidence !== undefined) {
    pushConfidenceDetail('Business Document Confidence', businessDocVerification);
  }

  if (addressConfidence !== undefined) {
    pushConfidenceDetail('Address Confidence', addressVerification);
  }

  if (marketCardConfidence !== undefined) {
    pushConfidenceDetail('Market Card Confidence', marketCardVerification);
  }

  return details;
}

function buildUnifiedVerificationDetails(
  plugin: VerificationPluginOutput,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];
  const verificationStatus = getPluginStatus(plugin);
  const confidenceScore = getPluginConfidenceScore(plugin);
  const failedAttributes = getPluginFailedAttributes(plugin) ?? [];

  if (verificationStatus) {
    const statusDisplay = STATUS_DISPLAY[verificationStatus];
    details.push({
      label: 'Verification Status',
      value: statusDisplay?.label ?? toTitleCase(verificationStatus),
    });
  }

  if (confidenceScore !== undefined && confidenceScore !== null) {
    const hasProcessingError = failedAttributes.some((attr: string) =>
      attr.toLowerCase().includes('error')
    );
    const isNoScore = confidenceScore === 0 && (
      verificationStatus === 'ERROR' || hasProcessingError
    );
    details.push({
      label: 'Confidence',
      value: isNoScore ? 'N/A (Processing Error)' : formatConfidence(confidenceScore),
    });
  }

  // Verified/failed attributes are now rendered as AttributeBadges (not comma strings)
  const pluginData = asRecord(plugin.data);
  const pluginDataMetadata = asRecord(pluginData?.['metadata']);
  const methods = plugin.metadata?.methodsExecuted ??
    asStringArray(pluginDataMetadata?.['methodsExecuted']) ??
    asStringArray(pluginData?.['methodsExecuted']);

  if (methods && methods.length > 0) {
    details.push({ label: 'Methods Executed', value: methods.map(m => toTitleCase(m)).join(', ') });
  }

  const duplicates = normalizePossibleDuplicates(
    plugin.metadata?.possibleDuplicates ??
      pluginDataMetadata?.['possibleDuplicates'] ??
      pluginData?.['possibleDuplicates'],
  );

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
  // VerificationResult top-level fields
  'status', 'confidenceScore', 'verifiedAttributes', 'failedAttributes',
  'sourceCount', 'weightedConfidence', 'effectiveConfidenceScore',
  'corroborationScore', 'contradictions', 'corroborationBonus',
  'contradictionPenalty', 'agreementCount', 'minimumThreshold',
  'skippedMethods', 'verified', 'confidence', 'data', 'images',
  // Nested metadata object
  'metadata',
  // Internal metadata keys (if metadata is flattened)
  'methodBreakdown', 'methodsExecuted', 'possibleDuplicates',
  'processingTime', 'requestId', 'verificationId', 'timestamp',
  'version', 'pipeline', 'strategies', 'rawResponse', 'errorDetails',
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
