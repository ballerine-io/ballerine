import {
  ISerializableCommonPluginParams,
  ISerializableMappingPluginParams,
} from '../../plugins/common-plugin/types';
import { ApiPlugin, SerializableValidatableTransformer } from '../../plugins/external-plugin';
import { TContext, THelperFormatingLogic } from '../../utils';

export type SanctionsScreeningParams = {
  kind: 'sanctions-screening';
  vendor: 'dow-jones' | 'comply-advantage' | 'asia-verify';
  displayName: string;
  successAction?: string;
  errorAction?: string;
  stateNames: string[];
};

const REQUEST = {
  transform: [
    {
      transformer: 'jmespath',
      mapping: `{
                  vendor: 'dow-jones',
                  endUserId: join('__', [entity.ballerineEntityId, '']),
                  firstName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.firstName,
                  lastName: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.lastName,
                  dateOfBirth: pluginsOutput.kyc_session.kyc_session_1.result.entity.data.dateOfBirth,
                  ongoingMonitoring: false,
                  clientId: clientId,
                  callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/AML_RESPONSE_RECEIVED','?resultDestination=pluginsOutput.kyc_session.kyc_session_1.result.aml&processName=aml-unified-api'])
                }`, // jmespath
    },
  ],
};

const RESPONSE = {
  transform: [
    {
      mapping:
        "merge({ name: 'company_sanctions', status: reason == 'NOT_IMPLEMENTED' && 'CANCELED' || error != `null` && 'ERROR' || 'SUCCESS' }, @)",
      transformer: 'jmespath',
    },
    {
      mapping: [
        {
          method: 'setTimeToRecordUTC',
          source: 'invokedAt',
          target: 'invokedAt',
        },
      ],
      transformer: 'helper',
    },
  ],
} as SerializableValidatableTransformer;

const DISPLAY_NAME = 'Sanctions Screening';
export class SanctionsScreeningPlugin extends ApiPlugin {
  public static pluginType = 'sanctions-screening';
  public actionPluginName: string;
  public vendor: string;
  public successAction?: string;

  static #request = REQUEST;
  static #response = RESPONSE;
  static #url = '{secret.UNIFIED_API_URL}/aml-sessions';
  static #headers = { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' };
  static #method = 'POST' as const;

  constructor(params: SanctionsScreeningParams) {
    super({
      name: params.kind,
      stateNames: params.stateNames,
      displayName: params.displayName || DISPLAY_NAME,
      url: SanctionsScreeningPlugin.#url,
      method: SanctionsScreeningPlugin.#method,
      headers: SanctionsScreeningPlugin.#headers,
      request: SanctionsScreeningPlugin.#request as any,
      response: SanctionsScreeningPlugin.#response as any,
      successAction: params.successAction,
      errorAction: params.errorAction,
      persistResponseDestination: undefined,
    });

    this.actionPluginName = params.kind;
    this.vendor = params.vendor;
    this.successAction = params.successAction;
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
