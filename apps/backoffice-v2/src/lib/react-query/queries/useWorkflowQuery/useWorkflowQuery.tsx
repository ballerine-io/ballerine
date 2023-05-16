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
            id: '456eff27-d24a-4b05-b8b2-d97540af6fa4',
            data: {
              email: 'Ariel.Ankunding75@gmail.com',
              address: '637 Emma Oval',
              website: 'http://wealthy-mouse.name',
              industry: 'Devolved client-driven paradigm',
              legalForm: 'integrate dynamic synergies',
              vatNumber: '758841101',
              companyName: "O'Keefe LLC",
              phoneNumber: '1-666-387-0256',
              approvalState: 'NEW',
              businessPurpose: 'analyzing',
              numberOfEmployees: 688,
              registrationNumber: '783052309',
              dateOfIncorporation: '2022-07-15T21:18:06.457Z',
              countryOfIncorporation: 'Guyana',
              taxIdentificationNumber: '418873859792',
            },
            type: 'business',
            additionalDetails: {},
            ballerineEntityId: 'c58fea85-4f61-4e33-8ff6-d42f6525e7f0',
          },
          documents: [
            {
              id: crypto.randomUUID(),
              pages: [
                {
                  uri: 'http://ecstatic-therapy.biz',
                  data: '',
                  type: 'jpg',
                  metadata: {
                    side: 'front',
                    pageNumber: '1',
                  },
                  provider: 'http',
                  ballerineFileId: 'clhq62jdl0004phmwmm42izis',
                },
                {
                  uri: 'https://gaseous-misplacement.biz',
                  data: '',
                  type: 'jpg',
                  metadata: {
                    side: 'back',
                    pageNumber: '1',
                  },
                  provider: 'http',
                  ballerineFileId: 'clhq62mer0006phmw6fpczl03',
                },
              ],
              type: 'photo',
              issuer: {
                city: 'West Niko',
                name: 'Government',
                type: 'government',
                country: 'Japan',
                additionalDetails: {},
              },
              version: 1,
              category: 'ID',
              decision: {
                status: 'revision',
                revisionReason: 'Blurry image',
                rejectionReason: '',
              },
              properties: {
                fullName: {
                  type: 'string',
                  value: 'Dr. Neil Ledner',
                  isEditable: true,
                },
                dateOfBirth: {
                  type: 'date',
                  value: '2015-06-03',
                  isEditable: true,
                },
                nationality: {
                  type: 'string',
                  value: 'Madagascar',
                  isEditable: true,
                },
              },
              issuingVersion: 1,
            },
            {
              id: crypto.randomUUID(),
              pages: [
                {
                  uri: 'https://jumbo-bondsman.net',
                  data: '',
                  type: 'pdf',
                  metadata: {},
                  provider: 'http',
                  ballerineFileId: 'clhq62jdl0004phmwmm42izis',
                },
              ],
              type: 'certificate',
              issuer: {
                city: "O'Keefeton",
                name: 'Government',
                type: 'government',
                country: 'Antigua and Barbuda',
                additionalDetails: {},
              },
              version: 1,
              category: 'incorporation',
              decision: {
                status: 'approved',
                revisionReason: '',
                rejectionReason: '',
              },
              properties: {
                issueDate: {
                  type: 'date',
                  value: '2009-09-02',
                  isEditable: true,
                },
                companyName: {
                  type: 'string',
                  value: 'Torphy - West',
                  isEditable: true,
                },
                businessType: {
                  type: 'string',
                  value: 'enhance dynamic e-markets',
                  isEditable: true,
                },
                registeredAddress: {
                  type: 'string',
                  value: '104 Andres Burgs',
                  isEditable: true,
                },
                registrationNumber: {
                  type: 'string',
                  value: '632282906',
                  isEditable: true,
                },
              },
              issuingVersion: 1,
            },
          ],
        },
      };
    },
  });
};
