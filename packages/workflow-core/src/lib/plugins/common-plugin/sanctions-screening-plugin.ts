import { response } from './../../../../../../sdks/workflow-browser-sdk/src/lib/tests/msw';
import { ISerializableCommonPluginParams, ISerializableMappingPluginParams } from './types';
import {
  ApiPlugin,
  IApiPluginParams,
  SerializableValidatableTransformer,
} from '../external-plugin';
import { SANCSIONS_SCREENING_VENDOR, type SancsionsScreeningVendors } from './vendor-consts';

export interface ISanctionsScreeningParams {
  kind: 'sanctions-screening';
  vendor: SancsionsScreeningVendors;
  displayName: string | undefined;
  successAction?: string;
  errorAction?: string;
  stateNames: string[];
}

const DISPLAY_NAME = 'Sanctions Screening';
export class SanctionsScreeningPlugin extends ApiPlugin {
  public static pluginType = 'http';
  public static pluginKind = 'sanctions-screening';

  public vendor: string;
  static #url = '{secret.UNIFIED_API_URL}/aml-sessions';
  static #headers = { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' };
  static #method = 'POST' as const;

  constructor(params: ISanctionsScreeningParams & IApiPluginParams) {
    super({
      persistResponseDestination: undefined,
      ...params,
      name: SanctionsScreeningPlugin.pluginKind,
      displayName: params.displayName || DISPLAY_NAME,
      url: SanctionsScreeningPlugin.#url,
      method: SanctionsScreeningPlugin.#method,
      headers: SanctionsScreeningPlugin.#headers,
      request: SANCSIONS_SCREENING_VENDOR[params.vendor].request as any,
      response: SANCSIONS_SCREENING_VENDOR[params.vendor].response as any,
    });

    this.vendor = params.vendor;
  }
}

//   {
//     "url": "{secret.UNIFIED_API_URL}/aml-sessions",
//     "name": "sanctions-screening",
//     "method": "POST",
//     "headers": {
//       "Authorization": "Bearer {secret.UNIFIED_API_TOKEN}"
//     },
//     "request": {
//       "transform": [
//         {
//           "mapping": "{\n                        vendor: 'dow-jones',\n                        endUserId: join('__', [entity.ballerineEntityId, '']),\n                        firstName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.firstName,\n                        lastName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.lastName,\n                        dateOfBirth: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.dateOfBirth,\n                        ongoingMonitoring: false,\n                        clientId: clientId,\n                        callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/AML_RESPONSE_RECEIVED','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result.aml&processName=aml-unified-api'])\n                      }",
//           "transformer": "jmespath"
//         }
//       ]
//     },
//     "response": {
//       "transform": [
//         {
//           "mapping": "merge({ name: 'sanctions-screening', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || 'IN_PROGRESS' }, @)",
//           "transformer": "jmespath"
//         },
//         {
//           "mapping": [
//             {
//               "method": "setTimeToRecordUTC",
//               "source": "invokedAt",
//               "target": "invokedAt"
//             }
//           ],
//           "transformer": "helper"
//         }
//       ]
//     },
//     "pluginKind": "api",
//     "stateNames": [
//       "kyc_response_received"
//     ],
//     "displayName": "Sanctions Screening",
//     "errorAction": "API_CALL_ERROR"
//   }

// {
//   name: 'sanctions_screening',
//   displayName: 'Sanctions Screening',
//   pluginKind: 'api',
//   url: `{secret.UNIFIED_API_URL}/aml-sessions`,
//   method: 'POST',
//   stateNames: ['awaiting_response'],
//   errorAction: 'RESPONSE_FAILED',
//   headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
//   request: {
//     transform: [
//       {
//         transformer: 'jmespath',
//         mapping: `{
//               vendor: 'veriff',
//               endUserId: join('__', [entity.ballerineEntityId, '']),
//               firstName: entity.data.firstName,
//               lastName: entity.data.lastName,
//               dateOfBirth: entity.data.dateOfBirth,
//               ongoingMonitoring: ongoingMonitoring,
//               callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/RESPONSE_RECEIVED','?resultDestination=aml&processName=aml-unified-api'])
//             }`, // jmespath
//       },
//     ],
//   },
//   response: {
//     transform: createPluginAsyncResponseTransform(
//       'sanctions_screening',
//     ),
//   },
// }
