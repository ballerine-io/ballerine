import { buildDocumentFieldThisState } from './fields/DocumentField/utils/build-document-field-this-state';
import { IContextBuildersMap } from './helpers/build-validation-schema-from-form-elements';

export const contextBuilders: IContextBuildersMap = {
  documentfield: buildDocumentFieldThisState,
};
