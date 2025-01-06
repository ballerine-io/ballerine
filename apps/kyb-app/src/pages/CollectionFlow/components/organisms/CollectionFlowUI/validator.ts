import { registerValidator } from '@ballerine/ui';
import { documentValidator } from './validators/document';

registerValidator('document', documentValidator);
