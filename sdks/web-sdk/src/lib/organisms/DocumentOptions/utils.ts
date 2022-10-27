import { IStepConfiguration } from '../../contexts/configuration';
import { DocumentType, IDocument } from '../../contexts/app-state';

// Document types that only can be one chosen
export const getElementsTypes = (configuration: IStepConfiguration): DocumentType[] => {
  return configuration.elements.map(option => {
    const type = option.props.attributes?.value as unknown;
    return type as DocumentType;
  });
};
