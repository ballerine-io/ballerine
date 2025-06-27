import { IDocument } from '@/components/organisms/Form/DocumentsService/types';

export interface IValidatorWrapperContext {
  _documents: IDocument[];
  _files: Record<string, File>;
}
