import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import fs from 'fs';
import * as tmp from 'tmp';

export type TIndividualVerificationData = {
  document: {
    type: {
      value: string | null;
    } | null;
    validFrom: {
      value: string | null;
    } | null;
    validUntil: {
      value: string | null;
    } | null;
    firstIssue: {
      value: string | null;
    } | null;
    country: {
      value: string | null;
    } | null;
    city: {
      value: string | null;
    } | null;
    issueNumber: {
      value: string | null;
    } | null;
  };
  person: {
    idNumber: {
      value: string | null;
    } | null;
    gender: {
      value: string | null;
    } | null;
    nationality: {
      value: string | null;
    } | null;
    placeOfBirth: {
      value: string | null;
    } | null;
    address: {
      value: string | null;
    } | null;
    firstName: {
      value: string | null;
    } | null;
    lastName: {
      value: string | null;
    } | null;
    dateOfBirth: {
      value: string | null;
    } | null;
  };
  insights: Record<string, Record<string, string | null>>;
  decision: string;
  reason: string;
  decisionScore: number;
  images: Array<{ context?: string; content: string }>;
  // F1: Optional — the Unified API intentionally omits `aml` when there are no
  // AML results. Sending `aml: {}` would be truthy but have no `.hits`, which
  // causes a TypeError in Ballerine's `mapCallbackDataToIndividual`.
  aml?: Record<string, unknown>;
  // Per-method verification breakdown — each entry shows the status of a
  // verification method (ran, errored, or skipped) for case management visibility.
  methodBreakdown?: Array<{
    method: string;
    status: string;
    confidence: number;
    verifiedAttributes: string[];
    failedAttributes: string[];
    reason?: string;
  }>;
};

const IGNORED_DECISION_CHECKS = ['newUser', 'newDocument'] as const;

const DECISION_CHECKS = [
  'allowedAge',
  'faceLiveness',
  'documentNotExpired',
  'geolocationMatch',
  'documentAccepted',
  'faceNotInBlocklist',
  'allowedIpLocation',
  'faceImageAvailable',
  'documentRecognised',
  'faceSimilarToPortrait',
  'validDocumentAppearance',
  'expectedTrafficBehaviour',
  'physicalDocumentPresent',
  'documentBackFullyVisible',
  'documentFrontFullyVisible',
  'documentBackImageAvailable',
  'faceImageQualitySufficient',
  'documentFrontImageAvailable',
  'documentImageQualitySufficient',
] as const;

const ALL_KNOWN_CHECKS = [...IGNORED_DECISION_CHECKS, ...DECISION_CHECKS] as const;

export const formatIndividualVerificationDecision = ({
  insights,
  decision,
  reason,
  decisionScore,
}: {
  insights: Record<string, Record<string, string | null>>;
  decision: string;
  reason: string;
  decisionScore: number;
}) => {
  const insightValues = Object.values(insights).flatMap(category => Object.entries(category));

  const unknownValues = insightValues.filter(([check]) => !ALL_KNOWN_CHECKS.includes(check));

  if (unknownValues.length > 0) {
    // Note: This will need to be handled differently since SentryService is not available here
    console.warn(`Unknown KYC decision checks: ${unknownValues.join(', ')}`);
  }

  const riskLabels = insightValues
    .filter(
      ([label, result]) =>
        !IGNORED_DECISION_CHECKS.includes(label) && result !== 'yes' && result !== 'notApplicable',
    )
    .map(([label]) => label);

  return {
    riskLabels,
    status: decision,
    decisionReason: reason,
    decisionScore,
  };
};

export const handleIndividualVerificationDocuments = async ({
  kycDocument,
  kycDocumentImages,
  person,
}: {
  kycDocument: Pick<
    TIndividualVerificationData['document'],
    'type' | 'issueNumber' | 'validUntil' | 'validFrom' | 'firstIssue' | 'country' | 'city'
  >;
  kycDocumentImages: Array<{ context?: string; content: string }>;
  person: Pick<TIndividualVerificationData['person'], 'idNumber'>;
}) => {
  const documentPages: Array<{
    uri: string;
    provider: string;
    type: string | undefined;
    metadata: {
      side: string | undefined;
    };
  }> = [];

  // F5: Track temp file paths for cleanup after persistence
  const tempFilePaths: string[] = [];

  for (const kycDocumentImage of kycDocumentImages) {
    const tmpFile = tmp.fileSync({ keep: false }).name;
    const base64ImageContent = kycDocumentImage.content.split(',')[1];
    const buffer = Buffer.from(base64ImageContent as string, 'base64');
    const fileType = await getFileMetadata({
      file: buffer,
    });
    const fileWithExtension = `${tmpFile}${fileType?.extension ? `.${fileType?.extension}` : ''}`;

    fs.writeFileSync(fileWithExtension, buffer as unknown as Uint8Array);
    tempFilePaths.push(fileWithExtension);

    documentPages.push({
      uri: `file://${fileWithExtension}`,
      provider: 'file-system',
      type: fileType?.mimeType,
      metadata: {
        side: kycDocumentImage.context?.replace('document-', ''),
      },
    });
  }

  return {
    documents: [
      {
        type: 'identification_document',
        category: kycDocument.type?.value?.toLocaleLowerCase(),
        pages: documentPages,
        issuer: {
          country: kycDocument.country?.value,
          city: kycDocument.city?.value,
          additionalInfo: {
            validFrom: kycDocument.validFrom?.value,
            validUntil: kycDocument.validUntil?.value,
            firstIssue: kycDocument.firstIssue?.value,
          },
        },
        properties: {
          expiryDate: kycDocument.validUntil?.value,
          idNumber: person.idNumber?.value,
          validFrom: kycDocument.validFrom?.value,
          validUntil: kycDocument.validUntil?.value,
          firstIssue: kycDocument.firstIssue?.value,
        },
        issuingVersion: kycDocument.issueNumber || 1,
      },
    ],
    // F5: Cleanup function to remove temp files after they've been persisted
    cleanupTempFiles: () => {
      for (const filePath of tempFilePaths) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch {
          // Best-effort cleanup — don't fail if a temp file is already gone
        }
      }
    },
  };
};

export const formatIndividualVerification = ({
  person,
  insights,
  decision: passedDecision,
  reason,
  decisionScore,
  aml,
  document,
}: Pick<
  TIndividualVerificationData,
  'person' | 'insights' | 'decision' | 'reason' | 'decisionScore' | 'aml' | 'document'
>) => {
  const decision = formatIndividualVerificationDecision({
    insights,
    decision: passedDecision,
    reason,
    decisionScore,
  });

  return {
    entity: {
      type: 'individual',
      data: {
        firstName: person.firstName?.value,
        lastName: person.lastName?.value,
        dateOfBirth: person.dateOfBirth?.value,
        additionalInfo: {
          gender: person.gender?.value,
          nationality: person.nationality?.value,
          placeOfBirth: person.placeOfBirth?.value ?? null,
          address: person.address?.value,
        },
      },
    },
    decision,
    aml,
    document: {
      type: document.type?.value,
      validFrom: document.validFrom?.value,
      validUntil: document.validUntil?.value,
      firstIssue: document.firstIssue?.value,
      country: document.country?.value,
      city: document.city?.value,
      issueNumber: document.issueNumber?.value,
    },
  };
};
