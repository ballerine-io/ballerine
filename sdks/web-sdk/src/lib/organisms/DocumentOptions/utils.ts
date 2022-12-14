import { IStepConfiguration } from '../../contexts/configuration';
import { EDocumentType } from '../../contexts/app-state';

// Document types that only can be one chosen
export const getElementsTypes = (configuration: IStepConfiguration): EDocumentType[] => {
  return configuration.elements.map(option => {
    const type = option.props.attributes?.value as unknown;
    return type as EDocumentType;
  });
};
