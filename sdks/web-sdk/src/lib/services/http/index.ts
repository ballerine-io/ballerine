import { DevMocks, ISelectedParams, IStoreData } from '../../contexts/app-state';
import { IDocumentVerificationResponse, ISendDocumentsResponse } from './types';
import { getFlowConfig } from '../../contexts/flows/hooks';
import { IAppConfiguration } from '../../contexts/configuration';
import {
  getAuthorizationHeader,
  getIsDevelopment,
  getStartVerificationEndpoint,
  getVerificationStatusEndpoint,
} from '../../contexts/configuration/getters';
import { DecisionStatus } from '../../contexts/app-state/types';
import { AnyRecord } from '../../../types';

const outerScopeContext = window.__blrn_context;
const docTypeMapping = {
  documentBack: 'document-back',
  documentFront: 'document-front',
  selfie: 'face',
};

export const generateParams = (data: IDocumentVerificationResponse): ISelectedParams => {
  const params: ISelectedParams = { sync: true };
  Object.keys(data).forEach(key => {
    const value = data[key as keyof IDocumentVerificationResponse] as string;
    params[key] = value;
  });
  return params;
};

const staticHeaders = {
  mode: 'no-cors',
  'Content-Type': 'application/json',
};

const httpPost = async <TResponse>(url: string, body: AnyRecord) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      ...staticHeaders,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(
      `Error fetching ${url}. http code: ${response.status}, ${response.statusText}.`,
    );
  }
  return response.json() as Promise<TResponse>;
};

const httpGet = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: getAuthorizationHeader(),
    },
  });
  if (!response.ok) {
    throw new Error(
      `Error fetching ${url}. http code: ${response.status}, ${response.statusText}.`,
    );
  }
  return response.json();
};

export const getVerificationStatus = async (_endUserId: string) => {
  const verificationId = localStorage.getItem('verificationId') as string;
  const endpointUrl = getVerificationStatusEndpoint({ verificationId });
  // Enter a validation step here that would infer the response's type
  return httpGet(endpointUrl) as Promise<IDocumentVerificationResponse>;
};

export const verifyDocuments = async (
  data: IStoreData,
  endUserId: string,
  configuration: IAppConfiguration,
): Promise<ISendDocumentsResponse> => {
  const documentsForUpload: {
    metadata: Record<string, string>;
    type: string;
    pages: unknown;
  }[] = [];
  if (data.selfie) {
    documentsForUpload.push({
      type: docTypeMapping['selfie'],
      metadata: {},
      pages: [{ base64: data.selfie }],
    });
  }
  documentsForUpload.push(...data.docs);

  const endUserInfo = {
    firstName: configuration.endUserInfo.firstName,
    lastName: configuration.endUserInfo.lastName,
    id: endUserId,
    type: getFlowConfig(configuration).userType,
    phone: configuration.endUserInfo.phone,
    email: configuration.endUserInfo.email,
    language: configuration.endUserInfo.language,
  };
  const payload: {
    endUserInfo: typeof endUserInfo;
    documents: typeof documentsForUpload;
    devMocks?: DevMocks;
  } = {
    endUserInfo,
    documents: documentsForUpload,
  };

  if (getIsDevelopment()) {
    const devMocks: DevMocks = {
      resultTime: (outerScopeContext && outerScopeContext.mockResultTime) || 7, // 3 seconds default
      reasonCode: outerScopeContext && outerScopeContext.mockReasonCode,
      code: outerScopeContext && outerScopeContext.mockCode,
      idvResult: (outerScopeContext && outerScopeContext.mockIdvResult) || DecisionStatus.APPROVED,
    };
    payload.devMocks = devMocks;
  }

  const verificationRes = await httpPost<
    ISendDocumentsResponse & {
      verificationId: string;
    }
  >(getStartVerificationEndpoint(), payload);
  localStorage.setItem('verificationId', verificationRes.verificationId);
  return verificationRes;
};
