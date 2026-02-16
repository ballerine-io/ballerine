import { get } from 'svelte/store';

import { configuration } from './store';
import { resolveStringTemplate } from '../../utils/string-utils/resolve-string-template';
import { FlowsBackendConfig, FlowsBackendConfigEndpoints } from '../../../types/BallerineSDK';

export const getBackendConfig = (): FlowsBackendConfig => {
  return get(configuration).backendConfig;
};

export const resolveEndpoint = (
  endpointName: keyof FlowsBackendConfigEndpoints,
  templateParams?: StringKV,
): string => {
  const backendConfig = getBackendConfig();

  return `${backendConfig.baseUrl ?? ''}${resolveStringTemplate(
    backendConfig.endpoints?.[endpointName] ?? '',
    templateParams,
  )}`;
};

export const getUploadFileEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('uploadFile', templateParams);

export const getUpdateContextEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('updateContext', templateParams);

export const getStartVerificationEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('startVerification', templateParams);

export const getVerificationStatusEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('getVerificationStatus', templateParams);

export const processStepDataEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('processStepData', templateParams);

export const getConfigEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('getConfig', templateParams);

export const getFinalSubmissionEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('finalSubmission', templateParams);

export const getSendEventEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('sendEvent', templateParams);

export const getActiveFlowEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('activeFlow', templateParams);

export const getAuthorizationHeader = (): string =>
  getBackendConfig().auth?.authorizationHeader || '';

export const getIsDevelopment = () => get(configuration).isDevelopment;

export const getEndUserInfo = () => get(configuration).endUserInfo;
