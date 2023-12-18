import { Prisma, PrismaClient } from '@prisma/client';
import { StateTag, WorkflowDefinitionVariant } from '@ballerine/common';

export const websiteMonitoringDefinition = {
  id: 'merchant_website_monitoring',
  name: 'merchant_website_monitoring',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'merchant_website_monitoring_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          START: 'start_website_monitoring',
        },
      },
      start_website_monitoring: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          WEBSITE_MONITORING_SUCCESS: 'pending_website_response',
          WEBSITE_MONITORING_FAIL: 'failed',
        },
      },
      pending_website_response: {
        tags: [StateTag.PENDING_PROCESS],
        on: {
          WEBSITE_MONITORING_FINISHED: 'manual_review',
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
              countryCode: entity.data.country,
              callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/WEBSITE_MONITORING_FINISHED','?resultDestination=pluginsOutput.website_monitoring.data']),
              vendor: 'legitscript'
              }`, // jmespath
            },
          ],
        },
        response: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: '{metadata: {result: @}}', // jmespath
            },
          ],
        },
      },
    ],
  },
  config: {
    initialEvent: 'START',
  },
  variant: WorkflowDefinitionVariant.DEFAULT,
} as const satisfies Prisma.WorkflowDefinitionUncheckedCreateInput;
export const generateWebsiteMonitoringExample = async (
  prismaClient: PrismaClient,
  projectId?: string,
) => {
  const websiteMonitoringExample = {
    ...websiteMonitoringDefinition,
    isPublic: !projectId,
    projectId: projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: websiteMonitoringExample,
  });

  return workflow;
};
