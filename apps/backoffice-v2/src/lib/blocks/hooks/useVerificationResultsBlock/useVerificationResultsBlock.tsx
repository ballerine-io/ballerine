import { useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

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

export const useVerificationResultsBlock = ({
  pluginsOutput,
}: {
  pluginsOutput: Record<string, unknown> | undefined;
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

    const overallBlock = createBlocksTyped()
      .addBlock()
      .addCell({
        id: 'verification-results-heading',
        type: 'heading',
        value: 'Verification Results',
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

    if (docVerification) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'doc-verification-heading',
            type: 'subheading',
            value: 'Document Verification',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildUnifiedVerificationDetails(docVerification),
          })
          .buildFlat(),
      });

      const extractedData = (docVerification.metadata?.extractedData ?? docVerification.data) as
        | Record<string, unknown>
        | undefined;

      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      if (extractedDetails.length > 0) {
        blocks.addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'doc-extracted-data-heading',
              type: 'subheading',
              value: 'Extracted Document Data',
              props: { className: 'mt-4 mb-2' },
            })
            .addCell({
              type: 'readOnlyDetails',
              value: extractedDetails,
            })
            .buildFlat(),
        });
      }
    }

    if (facialVerification) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'facial-verification-heading',
            type: 'subheading',
            value: 'Facial Verification',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildUnifiedVerificationDetails(facialVerification),
          })
          .buildFlat(),
      });

      const possibleDuplicates = normalizePossibleDuplicates(
        facialVerification.metadata?.possibleDuplicates,
      );

      if (possibleDuplicates && possibleDuplicates.length > 0) {
        blocks.addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'dedup-heading',
              type: 'subheading',
              value: `Possible Duplicates (${possibleDuplicates.length})`,
              props: { className: 'mt-4 mb-2' },
            })
            .addCell({
              type: 'readOnlyDetails',
              value: possibleDuplicates.map((dup, idx) => ({
                label: `Match #${idx + 1}`,
                value:
                  dup.personId && dup.confidenceScore !== undefined
                    ? `Person ${dup.personId} — ${formatConfidence(dup.confidenceScore)} match`
                    : dup.personId
                    ? `Person ${dup.personId}`
                    : 'Unknown',
              })),
            })
            .buildFlat(),
        });
      }
    }

    if (businessDocumentVerification) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'business-doc-verification-heading',
            type: 'subheading',
            value: 'Business Document Verification',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildUnifiedVerificationDetails(businessDocumentVerification),
          })
          .buildFlat(),
      });

      const extractedData = businessDocumentVerification.metadata?.extractedData;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      if (extractedDetails.length > 0) {
        blocks.addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'business-doc-extracted-data-heading',
              type: 'subheading',
              value: 'Extracted Business Document Data',
              props: { className: 'mt-4 mb-2' },
            })
            .addCell({
              type: 'readOnlyDetails',
              value: extractedDetails,
            })
            .buildFlat(),
        });
      }
    }

    if (addressVerification) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'address-verification-heading',
            type: 'subheading',
            value: 'Address Verification',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildUnifiedVerificationDetails(addressVerification),
          })
          .buildFlat(),
      });

      const extractedData = addressVerification.metadata?.extractedData;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      if (extractedDetails.length > 0) {
        blocks.addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'address-extracted-data-heading',
              type: 'subheading',
              value: 'Extracted Address Document Data',
              props: { className: 'mt-4 mb-2' },
            })
            .addCell({
              type: 'readOnlyDetails',
              value: extractedDetails,
            })
            .buildFlat(),
        });
      }
    }

    if (marketCardVerification) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'market-card-verification-heading',
            type: 'subheading',
            value: 'Market Card Verification',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildUnifiedVerificationDetails(marketCardVerification),
          })
          .buildFlat(),
      });

      const extractedData = marketCardVerification.metadata?.extractedData;
      const extractedDetails = extractedData ? buildExtractedDataDetails(extractedData) : [];

      if (extractedDetails.length > 0) {
        blocks.addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'market-card-extracted-data-heading',
              type: 'subheading',
              value: 'Extracted Market Card Data',
              props: { className: 'mt-4 mb-2' },
            })
            .addCell({
              type: 'readOnlyDetails',
              value: extractedDetails,
            })
            .buildFlat(),
        });
      }
    }

    if (deviceDedup) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'device-dedup-heading',
            type: 'subheading',
            value: 'Device Deduplication',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildDeviceDedupDetails(deviceDedup),
          })
          .buildFlat(),
      });
    }

    const loanFinancialResults = getResultsArray(
      loanFinancialAnalysis,
    ) as FinancialAnalysisResult[];

    if (loanFinancialResults.length > 0) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'loan-financial-heading',
            type: 'subheading',
            value: 'Loan Financial Analysis',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildLoanFinancialAnalysisDetails(loanFinancialResults),
          })
          .buildFlat(),
      });
    }

    const businessPhotoResults = getResultsArray(
      businessPhotoClassification,
    ) as BusinessPhotoAnalysisResult[];

    if (businessPhotoResults.length > 0) {
      blocks.addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'business-photo-heading',
            type: 'subheading',
            value: 'Business Photo Analysis',
            props: { className: 'mt-4 mb-2' },
          })
          .addCell({
            type: 'readOnlyDetails',
            value: buildBusinessPhotoAnalysisDetails(businessPhotoResults),
          })
          .buildFlat(),
      });
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
    details.push({ label: 'Verification Status', value: plugin.verificationStatus });
  }

  if (plugin.status) {
    details.push({ label: 'Process Status', value: plugin.status });
  }

  if (plugin.confidenceScore !== undefined && plugin.confidenceScore !== null) {
    details.push({ label: 'Confidence', value: formatConfidence(plugin.confidenceScore) });
  }

  if (plugin.verifiedAttributes && plugin.verifiedAttributes.length > 0) {
    details.push({ label: 'Verified Attributes', value: plugin.verifiedAttributes.join(', ') });
  }

  if (plugin.failedAttributes && plugin.failedAttributes.length > 0) {
    details.push({ label: 'Failed Attributes', value: plugin.failedAttributes.join(', ') });
  }

  const methods = plugin.metadata?.methodsExecuted;

  if (methods && methods.length > 0) {
    details.push({ label: 'Methods Executed', value: methods.join(', ') });
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

function buildExtractedDataDetails(
  extractedData: Record<string, unknown>,
): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];

  for (const [sectionKey, sectionValue] of Object.entries(extractedData)) {
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
