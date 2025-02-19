import { buildDocumentFieldThisState } from './fields/DocumentField/utils/build-document-field-this-state';
import { IContextBuildersMap } from './helpers/convert-form-emenents-to-validation-schema';

export const contextBuilders: IContextBuildersMap = {
  documentfield: buildDocumentFieldThisState,
};
