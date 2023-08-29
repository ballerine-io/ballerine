export {
  handlePromise,
  isEmptyObject,
  isErrorWithMessage,
  isErrorWithName,
  isErrorWithCode,
  isFunction,
  isNullish,
  isObject,
  noNullish,
  zodErrorToReadable,
  sleep,
  uniqueArray,
  safeEvery,
  someDocumentDecisionStatus,
  everyDocumentDecisionStatus,
  raise,
  log,
  dump,
} from './utils';

export type { IErrorWithMessage } from './utils';
export type { Serializable, AnyRecord } from './types';
export type { DefaultContextSchema, TDefaultSchemaDocumentPage, TDocument } from './schemas';

export {
  ghanaDocuments,
  certificateOfResidenceGH,
  getDocumentsByCountry,
  getDocumentId,
  defaultContextSchema,
} from './schemas';

export * from './consts';
