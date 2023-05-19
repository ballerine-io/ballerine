import { type IStepConfiguration } from '../../contexts/configuration';
import { type TDocumentType } from '../../contexts/app-state/types';

// Document types that only can be one chosen
export const getElementsTypes = (configuration: IStepConfiguration): TDocumentType[] => {
  return configuration.elements.map(option => {
    const type = option.props.attributes?.value as unknown;
    return type as TDocumentType;
  });
};
