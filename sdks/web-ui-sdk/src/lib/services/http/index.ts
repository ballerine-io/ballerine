import { ISelectedParams, IStoreData } from '../../contexts/app-state';
import { IDocumentVerificationResponse } from './types';
import { TVerificationStatuses } from '../../utils/event-service/types';
import {
  getAuthorizationHeader,
  getEndUserInfo,
  getFinalSubmissionEndpoint,
  getSendEventEndpoint,
  getUpdateContextEndpoint,
  getUploadFileEndpoint,
  getVerificationStatusEndpoint,
} from '../../contexts/configuration/getters';
import { AnyRecord } from '../../../types';

// NOTE: Endpoint resolution is LAZY — must be called inside functions, NOT at module level.
// The config store is empty at module load time; it's only populated after flows.init().

export const generateParams = (data: IDocumentVerificationResponse): ISelectedParams => {
  const params: ISelectedParams = { sync: true };

  Object.keys(data).forEach(key => {
    params[key] = data[key as keyof IDocumentVerificationResponse] as string;
  });

  return params;
};

/**
 * Extract a human-readable error detail from a failed HTTP response.
 * Falls back to statusText if the body cannot be parsed.
 */
const extractErrorDetail = async (response: Response): Promise<string> => {
  let detail = response.statusText;
  try {
    const body = await response.json();
    if (body.message) detail = body.message;
  } catch {
    // Body wasn't JSON — keep statusText
  }
  return detail;
};

const httpPost = async <TResponse>(url: string, body: FormData) => {
  const headers: Record<string, string> = {};
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const detail = await extractErrorDetail(response);
    throw new Error(`Error at ${url}: ${response.status} — ${detail}`);
  }

  return (await response.json()) as Promise<TResponse>;
};

const httpPostJson = async <TResponse>(url: string, body: AnyRecord) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await extractErrorDetail(response);
    throw new Error(`Error at ${url}: ${response.status} — ${detail}`);
  }

  return (await response.json()) as Promise<TResponse>;
};

const httpPatch = async <TResponse>(url: string, body: AnyRecord) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;

  const response = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await extractErrorDetail(response);
    throw new Error(`Error at ${url}: ${response.status} — ${detail}`);
  }

  return (await response.json()) as Promise<TResponse>;
};

const httpGet = async (url: string) => {
  const headers: Record<string, string> = {};
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const detail = await extractErrorDetail(response);
    throw new Error(`Error fetching ${url}: ${response.status} — ${detail}`);
  }

  return response.json();
};

/** Simple delay helper for retry backoff. */
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper — retries a function on transient failures (network errors, 5xx).
 * Client errors (4xx) are NOT retried — they indicate a bad request.
 */
const withRetry = async <T>(
  fn: () => Promise<T>,
  { maxAttempts = 2, delayMs = 1500 }: { maxAttempts?: number; delayMs?: number } = {},
): Promise<T> => {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Don't retry 4xx client errors — only network failures and 5xx
      const is4xx = lastError.message.includes(': 4');
      if (is4xx || attempt >= maxAttempts) break;
      console.warn(`Retry ${attempt}/${maxAttempts} after error:`, lastError.message);
      await delay(delayMs * attempt); // Linear backoff
    }
  }
  throw lastError;
};

export const getVerificationStatus = async (_endUserId: string) => {
  const verificationId = localStorage.getItem('verificationId') as string;
  const endpointUrl = getVerificationStatusEndpoint({ verificationId });

  // TODO: Enter a validation step here that would infer the response's type
  return httpGet(endpointUrl) as Promise<IDocumentVerificationResponse>;
};

const base64ToBlob = (dataURI: string) => {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

const createDocument = (
  {
    metadata,
    type,
    kind,
  }: {
    metadata: Record<string, string>;
    type: string;
    kind?: string;
  },
  pages: { ballerineFileId: string; metadata: { side: string } }[],
) => ({
  metadata,
  type,
  category: kind,
  properties: {},
  issuingVersion: 1,
  version: 1,
  issuer: {
    country: 'ZZ',
  },
  pages,
});

const updateContext = async (context: Record<string, unknown>) => {
  return await httpPatch(getUpdateContextEndpoint(), { context });
};

/**
 * Determines whether this document type requires a back-side photo.
 * Passports are single-page; cards typically have a back side.
 */
const needsBackSide = (docType: string): boolean => {
  return docType !== 'passport';
};

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Upload a document file via the collection-flow documents API.
 * Sends full metadata required by the /collection-flow/documents endpoint.
 */
const uploadCollectionFlowDocument = async (
  blob: Blob,
  filename: string,
  docType: string,
  docCategory: string,
  fileType: string,
  fileVariant: string,
  pageNum: number,
  endUserId: string,
  issuingCountry: string,
): Promise<unknown> => {
  if (blob.size > MAX_UPLOAD_SIZE) {
    throw new Error(`File "${filename}" is too large (${Math.round(blob.size / 1024 / 1024)}MB). Maximum size is 10MB.`);
  }
  if (blob.type && !ALLOWED_MIME_TYPES.includes(blob.type)) {
    throw new Error(`Invalid file type "${blob.type}" for "${filename}". Only JPEG, PNG, and WebP are accepted.`);
  }

  const formData = new FormData();
  formData.append('file', blob, filename);
  formData.append('category', docCategory);
  formData.append('type', docType);
  formData.append('issuingVersion', '1');
  formData.append('issuingCountry', issuingCountry);
  formData.append('page', String(pageNum));
  formData.append('documentType', fileType);
  formData.append('documentVariant', fileVariant);
  formData.append('endUserId', endUserId);

  return withRetry(() => httpPost(getUploadFileEndpoint(), formData));
};

/**
 * Collection-flow aware document verification.
 * Uploads documents via /collection-flow/documents with full metadata,
 * then calls /collection-flow/final-submission to trigger workflow completion.
 * Falls back to /collection-flow/send-event if final-submission fails.
 */
export const verifyDocumentsCollectionFlow = async (
  data: IStoreData,
): Promise<IDocumentVerificationResponse> => {
  const endUserInfo = getEndUserInfo();
  const endUserId = endUserInfo.id || '';
  const endUserMetadata = (endUserInfo as Record<string, unknown>).endUserMetadata as
    | Record<string, string>
    | undefined;
  const issuingCountry = endUserMetadata?.issuingCountry || 'SL';
  if (!endUserMetadata?.issuingCountry) {
    console.warn('issuingCountry not set in endUserMetadata, defaulting to SL');
  }

  // Parse workflow context from endUserMetadata if available
  let workflowContext: Record<string, unknown> = {};
  if (endUserMetadata?.workflowContext) {
    try {
      workflowContext = JSON.parse(endUserMetadata.workflowContext);
    } catch (err) {
      console.warn('Failed to parse workflowContext from endUserMetadata:', err);
    }
  }

  if (!endUserId || endUserId === 'unknown') {
    throw new Error('Could not determine user identity. Please close and try again.');
  }

  // Determine the primary document type and category from stored data
  const primaryDoc = data.docs[0];
  if (!primaryDoc) {
    throw new Error('No document data found. Please retake your photos.');
  }

  const docType = primaryDoc.type || 'id_card';
  const docCategory = primaryDoc.kind || 'identification_document';
  const hasBack = needsBackSide(docType) && primaryDoc.pages.some(p => p.side === 'back');

  // Upload all pages in parallel
  const uploadPromises: Promise<unknown>[] = [];
  let pageCounter = 1;

  // Front page (required — must have a document front photo)
  const frontPage = primaryDoc.pages.find(p => p.side === 'front');
  if (!frontPage?.base64) {
    throw new Error('Front page photo is missing. Please retake your document photo.');
  }
  uploadPromises.push(
    uploadCollectionFlowDocument(
      base64ToBlob(frontPage.base64),
      `${docType}_front.jpeg`,
      docType,
      docCategory,
      'document',
      'front',
      pageCounter++,
      endUserId,
      issuingCountry,
    ),
  );

  // Back page (if applicable)
  const backPage = primaryDoc.pages.find(p => p.side === 'back');
  if (hasBack && backPage?.base64) {
    uploadPromises.push(
      uploadCollectionFlowDocument(
        base64ToBlob(backPage.base64),
        `${docType}_back.jpeg`,
        docType,
        docCategory,
        'document',
        'back',
        pageCounter++,
        endUserId,
        issuingCountry,
      ),
    );
  }

  // Selfie (appended to primary doc pages or stored separately)
  const selfiePage = primaryDoc.pages.find(p => p.side === 'selfie');
  const selfieData = selfiePage?.base64 || data.selfie;
  if (selfieData) {
    uploadPromises.push(
      uploadCollectionFlowDocument(
        base64ToBlob(selfieData),
        'selfie.jpeg',
        docType,
        docCategory,
        'selfie',
        'front',
        pageCounter++,
        endUserId,
        issuingCountry,
      ),
    );
  }

  // Upload all documents — use allSettled to detect partial failures
  const uploadResults = await Promise.allSettled(uploadPromises);
  const failures = uploadResults.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(
      'Upload failures:',
      failures.map(f => (f as PromiseRejectedResult).reason),
    );
    throw new Error(
      `${failures.length} of ${uploadResults.length} document upload(s) failed. Please try again.`,
    );
  }

  // Final submission — trigger workflow completion
  const finalSubmissionEndpoint = getFinalSubmissionEndpoint();

  // Ensure collectionFlow state is present in context
  const context: Record<string, unknown> = { ...workflowContext };
  if (!context.collectionFlow) {
    context.collectionFlow = {};
  }
  const collectionFlow = context.collectionFlow as Record<string, unknown>;
  if (!collectionFlow.state) {
    collectionFlow.state = { status: 'pending', steps: [] };
  }

  let submissionResult: IDocumentVerificationResponse;

  try {
    submissionResult = await httpPostJson<IDocumentVerificationResponse>(
      finalSubmissionEndpoint,
      {
        eventName: 'COLLECTION_FLOW_FINISHED',
        context,
      },
    );
  } catch (finalErr) {
    console.warn('final-submission failed, trying send-event:', finalErr);
    // Fallback: just fire the event directly
    try {
      const sendEventEndpoint = getSendEventEndpoint();
      submissionResult = await httpPostJson<IDocumentVerificationResponse>(sendEventEndpoint, {
        eventName: 'COLLECTION_FLOW_FINISHED',
      });
    } catch (eventErr) {
      console.error('Both final-submission and send-event failed:', eventErr);
      throw new Error(
        'Your photos were uploaded but we could not start processing. Please try again.',
      );
    }
  }

  // Normalize idvResult — may be nested in .result
  const idvResult =
    submissionResult.idvResult || submissionResult.result?.idvResult || undefined;
  const reasonCode =
    submissionResult.reasonCode || submissionResult.result?.reasonCode || undefined;

  return {
    status: submissionResult.status || ('completed' as TVerificationStatuses),
    idvResult: idvResult as IDocumentVerificationResponse['idvResult'],
    reasonCode,
  };
};

/**
 * Verify documents — delegates to collection-flow endpoint when configured,
 * otherwise uses the legacy file upload + context update flow.
 */
export const verifyDocuments = async (
  data: IStoreData,
): Promise<string | IDocumentVerificationResponse> => {
  // Check if we're configured for collection-flow documents endpoint
  const endpoint = getUploadFileEndpoint();
  if (endpoint.includes('/collection-flow/documents')) {
    return verifyDocumentsCollectionFlow(data);
  }

  // Legacy flow: upload files to /collection-flow/files and update context
  if (data.selfie) {
    data.docs[0].pages.push({
      side: 'selfie',
      base64: data.selfie,
    });
  }

  const promises = data.docs.flatMap(doc =>
    doc.pages.map(async page => {
      const formData = new FormData();
      formData.append('file', base64ToBlob(page.base64 as string), `${doc.type}.jpeg`);

      const { id } = await httpPost<{ id: string }>(getUploadFileEndpoint(), formData);

      return { ballerineFileId: id, metadata: { side: page.side } };
    }),
  );

  const results = await Promise.all(promises);

  if (results.length === 0) {
    throw new Error('No documents were uploaded. Please retake your photos.');
  }

  const documents = data.docs.map(doc => createDocument(doc, results));

  await updateContext({ documents });

  localStorage.setItem('verificationId', results[0].ballerineFileId);

  return results[0].ballerineFileId;
};
