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
  loadingStep,
  finalStep,
  errorStep,
  resubmissionStep,
  declineStep
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
  checkSelfieStep,
  finalStep,
  loadingStep,
  errorStep,
  resubmissionStep,
  declineStep
];
