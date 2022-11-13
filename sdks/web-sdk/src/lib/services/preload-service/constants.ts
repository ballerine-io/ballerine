import { IStepConfiguration } from '../../contexts/configuration';
import {
  welcomeStep,
  documentSelectionStep,
  documentPhotoStep,
  checkDocumentStep,
  documentStartStep,
  documentPhotoBackStartStep,
  documentPhotoBackStep,
  checkDocumentPhotoBackStep,
  selfieStartStep,
  selfieStep,
  checkSelfieStep,
} from '../../default-configuration/theme';

export const defaultStepsConfigurations: IStepConfiguration[] = [
  welcomeStep,
  documentSelectionStep,
  documentStartStep,
  documentPhotoStep,
  checkDocumentStep,
  documentPhotoBackStartStep,
  documentPhotoBackStep,
  checkDocumentPhotoBackStep,
  selfieStartStep,
  selfieStep,
  checkSelfieStep
];
