import { UIElement } from '@/domains/collection-flow';

export const getDocumentFileNamePath = (definition: UIElement) =>
  definition.valueDestination
    ?.replace(/documents\[\d+\]\./g, '')
    .replace('ballerineFileId', 'fileName');
