import { formatValueDestinationAndApplyStackIndexes } from '@/components/providers/Validator/hooks/useValidate';
import { IBaseValueValidatorParams, IFieldContext } from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';
import { Document } from '@/domains/collection-flow';
import get from 'lodash/get';

export interface IDocumentValueValidatorParams extends IBaseValueValidatorParams {
  documentId: string;
  pathToDocuments: string;

  // Page index to check file id from, defaults to 0
  pageIndex?: number;
}

export class DocumentValueValidator extends ValueValidator<IDocumentValueValidatorParams> {
  type = 'document';

  validate(_: unknown, fieldContext: IFieldContext): void {
    const { pathToDocuments, documentId, pageIndex = 0 } = this.params;

    const documentsPath = this.getDocumentsPathWithIndexes(pathToDocuments, fieldContext);
    const documents = get(fieldContext.context, documentsPath);

    const document = documents?.find((document: Document) => document.id === documentId);

    debugger;

    if (!document || !document.pages?.[pageIndex]?.ballerineFileId) {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message) return `Document is required.`;

    return this.params.message;
  }

  private getDocumentsPathWithIndexes(documentsPath: string, fieldContext: IFieldContext) {
    return formatValueDestinationAndApplyStackIndexes(documentsPath, fieldContext.stack || []);
  }
}
