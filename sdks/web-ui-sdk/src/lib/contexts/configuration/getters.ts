import { get } from 'svelte/store';
import { configuration } from '../configuration';
import { FlowsBackendConfig, FlowsBackendConfigEndpoints } from '../../../types/BallerineSDK';
import { resolveStringTemplate } from '../../utils/string-utils/resolve-string-template';

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

export const getStartVerificationEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('startVerification', templateParams);
export const getVerificationStatusEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('getVerificationStatus', templateParams);
export const processStepDataEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('processStepData', templateParams);
export const getConfigEndpoint = (templateParams?: StringKV): string =>
  resolveEndpoint('getConfig', templateParams);

export const getAuthorizationHeader = (): string => {
  const backendConfig = getBackendConfig();
  const { auth } = backendConfig;
  if (!auth) return '';

  return auth.authorizationHeader || '';
};

export const getIsDevelopment = (): boolean => {
  return get(configuration).isDevelopment;
};
