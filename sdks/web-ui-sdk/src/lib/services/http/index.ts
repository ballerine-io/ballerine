import { ISelectedParams, IStoreData } from '../../contexts/app-state';
import { IDocumentVerificationResponse } from './types';
import { TVerificationStatuses } from '../../utils/event-service/types';
import {
  getActiveFlowEndpoint,
  getAuthorizationHeader,
  getEndUserInfo,
  getFinalSubmissionEndpoint,
  getSendEventEndpoint,
  getUpdateContextEndpoint,
  getUploadFileEndpoint,
  getVerificationStatusEndpoint,
} from '../../contexts/configuration/getters';
import { AnyRecord } from '../../../types';
import { DecisionStatus } from '../../contexts/app-state/types';

// NOTE: Endpoint resolution is LAZY — must be called inside functions, NOT at module level.
// The config store is empty at module load time; it's only populated after flows.init().

export const generateParams = (data: IDocumentVerificationResponse): ISelectedParams => {
  const params: ISelectedParams = { sync: true };

  Object.keys(data).forEach(key => {
    params[key] = data[key as keyof IDocumentVerificationResponse] as string;
  });

  return params;
};

type HttpRequestStage =
  | 'upload_document'
  | 'final_submission'
  | 'send_event'
  | 'active_flow_refresh'
  | 'sync_context'
  | 'verification_status_poll'
  | 'request';

type HttpError = Error & {
  status?: number;
  url?: string;
  stage?: HttpRequestStage | string;
  detail?: string;
  payload?: AnyRecord | null;
  reasonCode?: string | number;
};

const toReasonCode = (
  payload: AnyRecord | null,
  detail: string,
  status: number,
): string | number | undefined => {
  const resultPayload =
    payload && payload.result && typeof payload.result === 'object'
      ? (payload.result as AnyRecord)
      : null;
  const directReasonCode =
    payload && typeof payload.reasonCode !== 'undefined'
      ? payload.reasonCode
      : resultPayload && typeof resultPayload.reasonCode !== 'undefined'
      ? resultPayload.reasonCode
      : undefined;
  if (typeof directReasonCode === 'string' || typeof directReasonCode === 'number') {
    return directReasonCode;
  }

  const lower = String(detail || '').toLowerCase();
  if (status === 409 && lower.includes('kyc_child_responded') && lower.includes('idle')) {
    return 'PARENT_WORKFLOW_STATE_IDLE';
  }
  if (status === 409) {
    return 'WORKFLOW_CONFLICT';
  }
  if (status === 401 || status === 403) {
    return 'AUTHORIZATION_FAILED';
  }
  if (status >= 500) {
    return 'SERVER_ERROR';
  }
  return undefined;
};

const parseErrorBody = async (
  response: Response,
): Promise<{ detail: string; payload: AnyRecord | null }> => {
  let rawText = '';
  try {
    rawText = await response.text();
  } catch {
    rawText = '';
  }

  let payload: AnyRecord | null = null;
  if (rawText) {
    try {
      payload = JSON.parse(rawText) as AnyRecord;
    } catch {
      payload = null;
    }
  }

  let detail = response.statusText || 'Request failed';
  if (payload && typeof payload.message === 'string' && payload.message.trim()) {
    detail = payload.message.trim();
  } else if (payload && typeof payload.error === 'string' && payload.error.trim()) {
    detail = payload.error.trim();
  } else if (rawText && !payload) {
    detail = rawText.trim().slice(0, 220);
  }

  return { detail, payload };
};

const createHttpError = async (
  response: Response,
  url: string,
  stage: HttpRequestStage | string,
): Promise<HttpError> => {
  const { detail, payload } = await parseErrorBody(response);
  const reasonCode = toReasonCode(payload, detail, response.status);
  const error = new Error(`Error at ${url}: ${response.status} — ${detail}`) as HttpError;
  error.status = response.status;
  error.url = url;
  error.stage = stage;
  error.detail = detail;
  error.payload = payload;
  if (typeof reasonCode !== 'undefined') {
    error.reasonCode = reasonCode;
  }
  return error;
};

const createHardFailError = (
  message: string,
  stage: HttpRequestStage | string,
  reasonCode?: string,
): HttpError => {
  const error = new Error(message) as HttpError;
  error.stage = stage;
  if (reasonCode) {
    error.reasonCode = reasonCode;
  }
  return error;
};

const isHttpConflictError = (error: unknown): error is HttpError => {
  return Number((error as HttpError)?.status) === 409;
};

const logIdempotentConflict = (stage: HttpRequestStage | string, error: unknown) => {
  const err = error as HttpError;
  console.warn('Idempotent workflow conflict handled', {
    stage,
    status: err?.status,
    reasonCode: err?.reasonCode,
    detail: err?.detail || err?.message,
    url: err?.url,
  });
};

/** Timeout for file uploads — generous for slow mobile networks in West Africa. */
const UPLOAD_TIMEOUT_MS = 90_000;

const httpPost = async <TResponse>(
  url: string,
  body: FormData,
  options?: { stage?: HttpRequestStage | string },
) => {
  const headers: Record<string, string> = {};
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;
  const stage = options?.stage || 'request';

  // AbortController enforces a hard timeout on file uploads.
  // Mobile networks in Sierra Leone can stall mid-upload; without this
  // the user would wait indefinitely with no feedback.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        `Upload timed out after ${
          UPLOAD_TIMEOUT_MS / 1000
        }s — please check your connection and try again.`,
      );
    }
    throw err;
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    throw await createHttpError(response, url, stage);
  }

  return (await response.json()) as Promise<TResponse>;
};

const httpPostJson = async <TResponse>(
  url: string,
  body: AnyRecord,
  options?: { stage?: HttpRequestStage | string },
) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;
  const stage = options?.stage || 'request';

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await createHttpError(response, url, stage);
  }

  return (await response.json()) as Promise<TResponse>;
};

const httpPatch = async <TResponse>(
  url: string,
  body: AnyRecord,
  options?: { stage?: HttpRequestStage | string },
) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;
  const stage = options?.stage || 'request';

  const response = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await createHttpError(response, url, stage);
  }

  return (await response.json()) as Promise<TResponse>;
};

const httpGet = async (url: string, options?: { stage?: HttpRequestStage | string }) => {
  const headers: Record<string, string> = {};
  const authHeader = getAuthorizationHeader();
  if (authHeader) headers['Authorization'] = authHeader;
  const stage = options?.stage || 'request';

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw await createHttpError(response, url, stage);
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
  let lastError: HttpError | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? (err as HttpError) : (new Error(String(err)) as HttpError);
      // Don't retry 4xx client errors — only network failures and 5xx
      const status = Number(lastError.status);
      const is4xx = Number.isFinite(status)
        ? status >= 400 && status < 500
        : /: 4\d{2} —/.test(lastError.message);
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
  return httpGet(endpointUrl, {
    stage: 'verification_status_poll',
  }) as Promise<IDocumentVerificationResponse>;
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
  return await httpPatch(getUpdateContextEndpoint(), { context }, { stage: 'sync_context' });
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
    throw createHardFailError(
      `File "${filename}" is too large (${Math.round(
        blob.size / 1024 / 1024,
      )}MB). Maximum size is 10MB.`,
      'upload_document',
      'FILE_TOO_LARGE',
    );
  }
  if (blob.type && !ALLOWED_MIME_TYPES.includes(blob.type)) {
    throw createHardFailError(
      `Invalid file type "${blob.type}" for "${filename}". Only JPEG, PNG, and WebP are accepted.`,
      'upload_document',
      'INVALID_FILE_TYPE',
    );
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

  try {
    return await withRetry(() =>
      httpPost(getUploadFileEndpoint(), formData, { stage: 'upload_document' }),
    );
  } catch (error) {
    if (isHttpConflictError(error)) {
      // Idempotent upload behavior: duplicate submissions should not block the flow.
      logIdempotentConflict('upload_document', error);
      return { status: 'conflict_ignored' };
    }
    throw error;
  }
};

const normalizeWorkflowState = (state: unknown): string => {
  return String(state || '')
    .trim()
    .toLowerCase();
};

const REVISION_STATES = ['pending_resubmission', 'revision', 'revised'];
const REJECTED_STATES = ['rejected', 'auto_rejected', 'declined'];
const APPROVED_STATES = ['approved', 'auto_approved'];

const mapRevisionReasonToCode = (revisionReason: unknown): string => {
  if (!revisionReason || typeof revisionReason !== 'string') {
    return 'GENERIC';
  }
  const lower = revisionReason.toLowerCase();
  if (/blur|unclear|quality|unreadable|sharp|focus/.test(lower)) return 'DOCUMENT_BLURRY';
  if (/obscur|cut off|partial|crop/.test(lower)) return 'DOCUMENT_OBSCURED';
  if (/expir/.test(lower)) return 'DOCUMENT_EXPIRED';
  if (/face not|selfie|face visible/.test(lower)) return 'FACE_NOT_VISIBLE';
  if (/face mismatch|does not match|face match/.test(lower)) return 'FACE_MISMATCH';
  if (/back|back side|reverse/.test(lower)) return 'DOCUMENT_BACK_MISSING';
  if (/unsupported|not accepted|wrong document/.test(lower)) return 'DOCUMENT_TYPE_UNSUPPORTED';
  return 'GENERIC';
};

const extractRevisionReasonCodeFromActiveFlow = (activeFlow: AnyRecord): string | undefined => {
  const context = activeFlow?.context as AnyRecord | undefined;
  if (!context || typeof context !== 'object') {
    return undefined;
  }

  const contextResult =
    context.result && typeof context.result === 'object' ? (context.result as AnyRecord) : null;
  const contextReasonCode = context.reasonCode || contextResult?.reasonCode;
  if (typeof contextReasonCode === 'string' || typeof contextReasonCode === 'number') {
    return String(contextReasonCode);
  }

  if (typeof context.revisionReason === 'string') {
    return mapRevisionReasonToCode(context.revisionReason);
  }

  const docs = Array.isArray(context.documents) ? context.documents : [];
  for (const doc of docs) {
    const decision = doc?.decision as AnyRecord | undefined;
    if (!decision || typeof decision !== 'object') continue;

    const decisionResult =
      decision.result && typeof decision.result === 'object'
        ? (decision.result as AnyRecord)
        : null;
    const decisionReasonCode = decision.reasonCode || decisionResult?.reasonCode;
    if (typeof decisionReasonCode === 'string' || typeof decisionReasonCode === 'number') {
      return String(decisionReasonCode);
    }

    if (decision.status === 'revision' && typeof decision.revisionReason === 'string') {
      return mapRevisionReasonToCode(decision.revisionReason);
    }
  }

  return undefined;
};

const resolveConflictSubmissionResult = async (): Promise<IDocumentVerificationResponse> => {
  try {
    const latestResult = await httpGet(getActiveFlowEndpoint(), {
      stage: 'active_flow_refresh',
    });
    const latestFlow =
      latestResult && typeof latestResult === 'object' && 'result' in (latestResult as AnyRecord)
        ? ((latestResult as AnyRecord).result as AnyRecord)
        : (latestResult as AnyRecord);

    const normalizedState = normalizeWorkflowState(latestFlow?.state || latestFlow?.status);
    if (REVISION_STATES.includes(normalizedState)) {
      const reasonCode = extractRevisionReasonCodeFromActiveFlow(latestFlow) || 'GENERIC';
      return {
        status: 'completed' as TVerificationStatuses,
        idvResult: DecisionStatus.RESUBMISSION_REQUESTED,
        reasonCode,
      };
    }
    if (REJECTED_STATES.includes(normalizedState)) {
      return {
        status: 'completed' as TVerificationStatuses,
        idvResult: DecisionStatus.DECLINED,
      };
    }
    if (APPROVED_STATES.includes(normalizedState)) {
      return {
        status: 'completed' as TVerificationStatuses,
        idvResult: DecisionStatus.APPROVED,
      };
    }

    // Unknown/pending states are treated as "review" to keep UX idempotent.
    return {
      status: 'completed' as TVerificationStatuses,
      idvResult: DecisionStatus.REVIEW,
      reasonCode: 'WORKFLOW_CONFLICT',
    };
  } catch (error) {
    // If reconciliation fails, still degrade gracefully to review instead of hard-failing.
    console.warn('Failed to reconcile workflow state after conflict. Defaulting to review.', error);
    return {
      status: 'completed' as TVerificationStatuses,
      idvResult: DecisionStatus.REVIEW,
      reasonCode: 'WORKFLOW_CONFLICT',
    };
  }
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
  // Pre-flight connectivity check — fail fast if the device is offline.
  // navigator.onLine is imperfect (can be true on captive portals) but catches
  // the common case of airplane mode / Wi-Fi disconnect on mobile devices.
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw createHardFailError(
      'You appear to be offline. Please check your internet connection and try again.',
      'request',
      'NETWORK_OFFLINE',
    );
  }

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

  let workflowState: Record<string, unknown> | null = null;
  if (endUserMetadata?.workflowState) {
    try {
      workflowState = JSON.parse(endUserMetadata.workflowState);
    } catch (err) {
      console.warn('Failed to parse workflowState from endUserMetadata:', err);
    }
  }

  if (!endUserId || endUserId === 'unknown') {
    throw createHardFailError(
      'Could not determine user identity. Please close and try again.',
      'request',
      'INVALID_SESSION',
    );
  }

  // Determine the primary document type and category from stored data
  const primaryDoc = data.docs[0];
  if (!primaryDoc) {
    throw createHardFailError(
      'No document data found. Please retake your photos.',
      'request',
      'NO_DOCUMENT_DATA',
    );
  }

  const docType = primaryDoc.type || 'id_card';
  const configuredDocumentCategory = endUserMetadata?.documentCategory?.trim();
  const configuredSelfieCategory = endUserMetadata?.selfieCategory?.trim();
  const docCategory = configuredDocumentCategory || primaryDoc.kind || 'identification_document';
  const selfieCategory = configuredSelfieCategory || docCategory;
  const hasBack = needsBackSide(docType) && primaryDoc.pages.some(p => p.side === 'back');

  // Upload all pages in parallel
  const uploadPromises: Promise<unknown>[] = [];
  let pageCounter = 1;

  // Front page (required — must have a document front photo)
  const frontPage = primaryDoc.pages.find(p => p.side === 'front');
  if (!frontPage?.base64) {
    throw createHardFailError(
      'Front page photo is missing. Please retake your document photo.',
      'upload_document',
      'MISSING_FRONT_PHOTO',
    );
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
        selfieCategory,
        'selfie',
        'front',
        pageCounter++,
        endUserId,
        issuingCountry,
      ),
    );
  }

  // Upload additional documents (e.g., address proof) with per-doc categories
  for (let i = 1; i < data.docs.length; i++) {
    const extraDoc = data.docs[i];
    if (!extraDoc) continue;
    const extraDocType = extraDoc.type || 'document';
    const extraDocCategory = extraDoc.kind || docCategory;
    const extraFront = extraDoc.pages.find(p => p.side === 'front');
    if (extraFront?.base64) {
      uploadPromises.push(
        uploadCollectionFlowDocument(
          base64ToBlob(extraFront.base64),
          `${extraDocType}_front.jpeg`,
          extraDocType,
          extraDocCategory,
          'document',
          'front',
          pageCounter++,
          endUserId,
          issuingCountry,
        ),
      );
    }
    const extraBack = extraDoc.pages.find(p => p.side === 'back');
    if (extraBack?.base64) {
      uploadPromises.push(
        uploadCollectionFlowDocument(
          base64ToBlob(extraBack.base64),
          `${extraDocType}_back.jpeg`,
          extraDocType,
          extraDocCategory,
          'document',
          'back',
          pageCounter++,
          endUserId,
          issuingCountry,
        ),
      );
    }
  }

  // Upload all documents — use allSettled to detect partial failures
  const uploadResults = await Promise.allSettled(uploadPromises);
  const failures = uploadResults.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(
      'Upload failures:',
      failures.map(f => (f as PromiseRejectedResult).reason),
    );
    throw createHardFailError(
      `${failures.length} of ${uploadResults.length} document upload(s) failed. Please try again.`,
      'upload_document',
      'UPLOAD_FAILED',
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

  const currentState = collectionFlow.state as
    | {
        steps?: unknown[];
      }
    | undefined;
  const currentStateStepsCandidate = currentState?.steps;
  const currentStateSteps = Array.isArray(currentStateStepsCandidate)
    ? currentStateStepsCandidate
    : [];
  const hasStateSteps = currentStateSteps.length > 0;

  if (!hasStateSteps && workflowState) {
    collectionFlow.state = workflowState;
  } else if (!collectionFlow.state) {
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
      { stage: 'final_submission' },
    );
  } catch (finalErr) {
    if (isHttpConflictError(finalErr)) {
      logIdempotentConflict('final_submission', finalErr);
      submissionResult = await resolveConflictSubmissionResult();
    } else {
      console.warn('final-submission failed, trying send-event:', finalErr);
      // Fallback: just fire the event directly
      try {
        const sendEventEndpoint = getSendEventEndpoint();
        submissionResult = await httpPostJson<IDocumentVerificationResponse>(
          sendEventEndpoint,
          {
            eventName: 'COLLECTION_FLOW_FINISHED',
          },
          { stage: 'send_event' },
        );
      } catch (eventErr) {
        if (isHttpConflictError(eventErr)) {
          logIdempotentConflict('send_event', eventErr);
          submissionResult = await resolveConflictSubmissionResult();
        } else {
          console.error('Both final-submission and send-event failed:', eventErr);
          const hardFail =
            eventErr instanceof Error
              ? (eventErr as HttpError)
              : createHardFailError(
                  'Your photos were uploaded but we could not start processing. Please try again.',
                  'send_event',
                  'SUBMISSION_DISPATCH_FAILED',
                );
          if (!hardFail.stage) hardFail.stage = 'send_event';
          if (!hardFail.reasonCode) hardFail.reasonCode = 'SUBMISSION_DISPATCH_FAILED';
          if (!hardFail.message) {
            hardFail.message =
              'Your photos were uploaded but we could not start processing. Please try again.';
          }
          throw hardFail;
        }
      }
    }
  }

  // Normalize idvResult — may be nested in .result
  const idvResult = submissionResult.idvResult || submissionResult.result?.idvResult || undefined;
  const reasonCode =
    submissionResult.reasonCode || submissionResult.result?.reasonCode || undefined;

  return {
    status: submissionResult.status || ('completed' as TVerificationStatuses),
    idvResult: idvResult,
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
    throw createHardFailError(
      'No documents were uploaded. Please retake your photos.',
      'upload_document',
      'NO_UPLOAD_RESULTS',
    );
  }

  const documents = data.docs.map(doc => createDocument(doc, results));

  await updateContext({ documents });

  localStorage.setItem('verificationId', results[0].ballerineFileId);

  return results[0].ballerineFileId;
};
