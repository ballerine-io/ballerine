import { Prisma, PrismaClient } from '@prisma/client';
import { kycDynamicExample } from './kyc-dynamic-process-example';
import { env } from '../../src/env';
import { StateTag } from '@ballerine/common';
import { generateDynamicUiTest } from './ui-definition/ui-kyb-parent-dynamic-example';

export const websiteMonitoringDefinition = {
  id: 'workflow_monitoring',
  name: 'workflow_monitoring',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'workflow_monitoring_v1',
    predictableActionArguments: true,
    initial: 'start_website_monitoring',
    context: {
      documents: [],
    },
    states: {
      start_website_monitoring: {
        always: {
          WEBSITE_MONITORING_SUCCESS: 'manual_review',
          WEBSITE_MONITORING_FAIL: 'failed',
        },
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          reject: 'reject',
          approve: 'approve',
        },
      },
      reject: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      approve: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      failed: {
        tags: [StateTag.FAILURE],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'website_monitoring',
        pluginKind: 'api',
        url: `{secret.UNIFIED_API_URL}/website-monitoring`,
        method: 'POST',
        stateNames: ['start_website_monitoring'],
        successAction: 'WEBSITE_MONITORING_SUCCESS',
        errorAction: 'WEBSITE_MONITORING_FAIL',
        headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              businessId: entity.ballerineEntityId || entity.data.id,
              websiteUrl: entity.data.additionalInfo.store.website.mainWebsite,
              lastName: entity.data.country,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/WEBSITE_MONITORING_FINISHED','?resultDestination=pluginsOutput.website_monitoring.result']),
              vendor: 'legitscript'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping:
                "{website_monitoring: {vendor: 'legitscript', type: 'website-monitoring', result: {metadata: @}}}", // jmespath
            },
          ],
        },
      },
    ],
  },
  config: {},
} as const satisfies Prisma.WorkflowDefinitionUncheckedCreateInput;
export const generateWebsiteMonitoringExample = async (
  prismaClient: PrismaClient,
  projectId?: string,
) => {
  const websiteMonitoringExample = {
    ...websiteMonitoringDefinition,
    isPublic: !!projectId,
    projectId: projectId,
  };

  return websiteMonitoringExample;
};
