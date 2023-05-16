import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { isString } from '../../../../utils/is-string/is-string';

export const useWorkflowQuery = ({ workflowId }: { workflowId: string }) => {
  return useQuery({
    ...workflows.byId({ workflowId }),
    enabled: isString(workflowId) && workflowId.length > 0,
    select: ({ workflowDefinition, workflowRuntimeData }) => {
      const { definition, definitionType, ...rest } = workflowDefinition;
      const workflow = {
        ...rest,
        definitionType,
        definition: {
          ...definition,
          initial: workflowRuntimeData?.state ?? definition.initial,
          context: workflowRuntimeData.context,
        },
        workflowContext: {
          machineContext: workflowRuntimeData.context,
          state: workflowRuntimeData?.state ?? definition.initial,
        },
      };
      const workflowService = createWorkflow(workflow);
      const snapshot = workflowService.getSnapshot();

      return {
        ...workflow,
        runtimeDataId: workflowRuntimeData?.id,
        nextEvents: snapshot.nextEvents,
        context: {
          ...workflow.context,
          entity: {
            entityType: 'business',
            entityData: {
              businessName: 'Tech Solutions Inc.',
              businessAddress: '123 Tech Lane, Techville',
              businessNumber: '123456789',
            },
            additionalDetails: {
              industry: 'Technology',
              numberOfEmployees: '50',
            },
            ballerineEntityId: 'B123456',
            id: 'E123456',
          },
          documents: [
            {
              category: 'Identification Document',
              type: 'ID Card',
              issuer: {
                type: 'Government',
                name: 'Techville City Council',
                country: 'USA',
                city: 'Techville',
                additionalDetails: {
                  department: 'Identification and Passport Services',
                },
              },
              issuingVersion: 1,
              decision: {
                status: 'pending',
                rejectionReason: '',
                revisionReason: '',
              },
              approvalStatus: 'new',
              version: 1,
              pages: [
                {
                  provider: 'http',
                  uri: 'http://example.com/id_front.jpg',
                  type: 'jpg',
                  data: '',
                  metadata: {
                    side: 'front',
                    pageNumber: '1',
                  },
                },
                {
                  provider: 'http',
                  uri: 'http://example.com/id_back.jpg',
                  type: 'jpg',
                  data: '',
                  metadata: {
                    side: 'back',
                    pageNumber: '2',
                  },
                },
              ],
              properties: {
                cardNumber: {
                  type: 'number',
                  value: '987654321',
                  isEditable: true,
                },
                issueDate: {
                  type: 'date',
                  value: '2020-01-01',
                  isEditable: true,
                },
                expiryDate: {
                  type: 'date',
                  value: '2030-12-31',
                  isEditable: true,
                },
                name: {
                  type: 'string',
                  value: 'John Doe',
                  isEditable: true,
                },
                address: {
                  type: 'string',
                  value: '123 Tech Lane, Techville',
                  isEditable: true,
                },
                dateOfBirth: {
                  type: 'date',
                  value: '1980-01-01',
                  isEditable: true,
                },
              },
            },
            {
              category: 'Registration Document',
              type: 'Certificate of Incorporation',
              issuer: {
                type: 'Government',
                name: 'Techville City Council',
                country: 'USA',
                city: 'Techville',
                additionalDetails: {
                  department: 'Business Registration',
                },
              },
              issuingVersion: 1,
              decision: {
                status: 'pending',
                rejectionReason: '',
                revisionReason: '',
              },
              approvalStatus: 'new',
              version: 1,
              pages: [
                {
                  provider: 'http',
                  uri: 'http://example.com/certificate.pdf',
                  type: 'pdf',
                  data: '',
                  metadata: {
                    side: 'front',
                    pageNumber: '1',
                  },
                },
              ],
              properties: {
                companyName: {
                  type: 'string',
                  value: 'Tech Solutions Inc.',
                  isEditable: true,
                },
                companyNumber: {
                  type: 'number',
                  value: '123456789',
                  isEditable: true,
                },
                issueDate: {
                  type: 'date',
                  value: '2020-01-01',
                  isEditable: true,
                },
                directors: {
                  type: 'string',
                  value: 'John Doe, Jane Doe',
                  isEditable: true,
                },
                registeredAddress: {
                  type: 'string',
                  value: '123 Tech Lane, Techville',
                  isEditable: true,
                },
              },
            },
          ],
        },
      };
    },
  });
};
