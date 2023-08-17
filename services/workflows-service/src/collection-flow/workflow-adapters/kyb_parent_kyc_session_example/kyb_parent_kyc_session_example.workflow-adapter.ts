import { IWorkflowAdapter } from '@/collection-flow/workflow-adapters/abstract-workflow-adapter';
import { KYBParentKYCSessionExampleFlowData } from '@/collection-flow/workflow-adapters/kyb_parent_kyc_session_example/kyb_parent_kyc_session_example.model';
import { KYBParentKYCSessionExampleContext } from '@/workflow/types';
import { WorkflowRuntimeData } from '@prisma/client';

export class KYBParentKYCSessionExampleAdapter
  implements IWorkflowAdapter<KYBParentKYCSessionExampleFlowData>
{
  serialize(workflow: WorkflowRuntimeData): KYBParentKYCSessionExampleFlowData {
    const flowData = new KYBParentKYCSessionExampleFlowData();
    const context = workflow.context as KYBParentKYCSessionExampleContext;

    flowData.id = workflow.id;
    flowData.flowData = context?.entity?.data?.dynamicInfo || {};
    flowData.state = context?.entity?.data?._stateKey || null;

    return flowData;
  }

  deserialize(
    payload: KYBParentKYCSessionExampleFlowData,
    baseWorkflowRuntimeData: WorkflowRuntimeData,
  ): WorkflowRuntimeData {
    const { flowData, state, mainRepresentative, documents, ubos } = payload;

    (baseWorkflowRuntimeData.context as KYBParentKYCSessionExampleContext).entity = {
      ...(baseWorkflowRuntimeData.context as KYBParentKYCSessionExampleContext).entity,
      data: {
        ...baseWorkflowRuntimeData.context.entity.data,
        additionalInfo: {
          ...baseWorkflowRuntimeData.context.entity.data.additionalInfo,
          mainRepresentative,
        },
        ubos: ubos.map(ubo => ({
          id: ubo.id,
          type: 'individual',
          data: {
            firstName: ubo.firstName,
            lastName: ubo.lastName,
            email: ubo.email,
            dateOfBirth: ubo.birthDate,
            title: ubo.title,
          },
        })),
        dynamicInfo: flowData,
        _stateKey: state,
      },
    };

    baseWorkflowRuntimeData.context.documents = documents.map(document => {
      return {
        category: document.category,
        type: document.type,
        // TO DO: This should use incorporation country code
        issuer: {
          country: 'GH',
        },
        decision: { status: '', revisionReason: '', rejectionReason: '' },
        pages: [{ ballerineFileId: document.fileId }],
        properties: document.properties,
        version: '1',
        issuingVersion: 1,
      };
    });

    return baseWorkflowRuntimeData;
  }
}
