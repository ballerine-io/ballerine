import { faker } from '@faker-js/faker';
import {PrismaClient, WorkflowRuntimeDataStatus} from "@prisma/client";
import {generateBusiness} from "../generate-end-user";
import {WorkflowRuntimeStatusStatistic} from "@/metrics/repository/models/workflow-runtime-statistic.model";

export const createParentWithChildWorkflow = async (prismaClient: PrismaClient, customerName: string, withAml: boolean, projectId: string) => {
  const companyName = faker.company.companyName()
  const businessId = faker.datatype.uuid()
  const parentRuntimeInformation = generateParentRuntimeInformation(businessId, companyName, projectId)
  // @ts-ignore
  const businessData =  generateBusiness(
      {
        id: businessId,
        workflow: {
            workflowDefinitionId: parentRuntimeInformation.workflowDefinitionId,
            workflowDefinitionVersion: parentRuntimeInformation.workflowDefinitionVersion,
            context: parentRuntimeInformation.context,
        },
        projectId: projectId,
      }
  )
  await prismaClient.business.create({data: businessData})
  const parentWorkflowRuntime = await prismaClient.workflowRuntimeData.create({data: parentRuntimeInformation})
  const childWorkflowRuntimeInformation = generateChildRuntimeInformation(customerName, companyName, withAml, projectId, parentWorkflowRuntime.id);
  // @ts-ignore
  await prismaClient.workflowRuntimeData.create({data: childWorkflowRuntimeInformation})
}

export const generateChildRuntimeInformation = (customerName: string, companyName: string, withAml: boolean, projectId: string, parentWorkflowId: string) => {
  return {
    endUserId: faker.datatype.uuid(),
    workflowDefinitionId: 'kyc_email_session_example',
    workflowDefinitionVersion: 1,
    context: createKycRuntime(customerName, companyName, withAml),
    state: 'kyc_manual_review',
    status: WorkflowRuntimeDataStatus.active,
    createdAt: faker.date.recent(2),
    updatedAt: faker.date.recent(2),
    createdBy: 'SYSTEM',
    resolvedAt: null,
    config: {"callbackResult": {"deliverEvent": "KYC_DONE", "transformers": [{"mapping": "{data: @}", "transformer": "jmespath"}]}},
    parent_runtime_data_id: parentWorkflowId,
    projectId: projectId,
  }
}

export const generateParentRuntimeInformation = (businessId: string, companyName: string, projectId: string)  => {
  return {
    businessId: businessId,
    workflowDefinitionId: 'kyb_parent_kyc_session_example_v1',
    workflowDefinitionVersion: 1,
    context: generateParentRuntimeContext(companyName),
    state: 'manual_review',
    status: WorkflowRuntimeDataStatus.active,
    createdAt: faker.date.recent(2),
    updatedAt: faker.date.recent(2),
    createdBy: 'SYSTEM',
    resolvedAt: null,
    config: {"childCallbackResults": [{"definitionId": "kyc_email_session_example", "deliverEvent": "KYC_RESPONDED", "transformers": [{"mapping": "{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}", "transformer": "jmespath"}], "persistenceStates": ["kyc_manual_review"]}]},
    projectId: projectId,
  }
}

export const createKycRuntime = (customerName: string, companyName: string, withAml: boolean) => ({
  "entity": {
    "id": faker.datatype.uuid(),
    "data": {
      "email": faker.internet.email(),
      "lastName": faker.name.lastName(),
      "firstName": faker.name.firstName(),
      "additionalInfo": {
        "companyName": companyName,
        "customerCompany": customerName,
      }
    },
    "type": "individual"
  },
  "documents": [
    {
      "id": faker.datatype.uuid(),
      "type": "identification_document",
      "pages": [
        // Add as many pages as needed
      ],
      "issuer": {
        "city": null,
        "name": null,
        "country": "IL",
        "issuingVersion": null,
        "additionalDetails": {
          "validFrom": faker.date.past().toISOString(),
          "firstIssue": null,
          "validUntil": faker.date.future().toISOString()
        }
      },
      "category": "passport",
      "properties": {
        "idNumber": faker.datatype.number().toString(),
        "validFrom": faker.date.past().toISOString(),
        "expiryDate": faker.date.future().toISOString(),
        "firstIssue": null,
        "validUntil": faker.date.future().toISOString()
      }
    }
  ],
  "pluginsOutput": {
    "kyc_session": {
      "kyc_session_1": {
        "type": "kyc",
        "result": {
          "aml": withAml ? createAmlData(2) : {
            "hits": [],
            "endUserId": faker.datatype.uuid(),
            "matchStatus": "no_match"
          },
          "entity": {
            "data": {
              "lastName": faker.name.lastName(),
              "firstName": faker.name.firstName(),
              "nationalId": faker.datatype.number().toString(),
              "dateOfBirth": faker.date.past().toISOString(),
              "additionalInfo": {
                "gender": "M",
                "addresses": [],
                "nationality": "IL",
                "yearOfBirth": null,
                "placeOfBirth": null
              }
            },
            "type": "individual"
          },
          "decision": {
            "status": "approved",
            "riskLabels": [],
            "decisionReason": null,
            "metadata": {
              "id": faker.datatype.uuid(),
              "url": faker.internet.url()
            }
          }
        },
        "vendor": "veriff"
      }
    }
  },
  "workflowRuntimeId": faker.datatype.uuid()
});

const createAmlData = (numberOfHits: number) => {
  const hits = Array.from({ length: numberOfHits }, () => ({
    aka: [faker.name.findName(), faker.name.findName(), faker.name.findName()],
    countries: [faker.address.country(), faker.address.country(), faker.address.country()],
    matchTypes: [faker.helpers.arrayElement(['unknown', 'year_of_birth', 'full_name', 'last_name']), faker.helpers.arrayElement(['unknown', 'year_of_birth', 'full_name', 'last_name'])],
    dateOfBirth: faker.date.between('1970-01-01', '2000-01-01').toISOString().split('T')[0],
    dateOfDeath: null,
    matchedName: faker.name.findName(),
    listingsRelatedToMatch: {
      pep: [],
      warnings: [],
      sanctions: [
        {
          sourceUrl: 'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
          sourceName: 'OFAC SDN List',
        },
      ],
      fitnessProbity: [],
    },
  }));

  return {
    attemptId: faker.datatype.uuid(),
    vendorData: '123123-my-vendor-data',
    checkType: 'initial_result',
    matchStatus: 'possible_match',
    searchTerm: {
      name: faker.name.findName(),
      year: faker.date.past().getFullYear().toString(),
    },
    totalHits: numberOfHits,
    createdAt: faker.date.recent().toISOString(),
    hits: hits,
  };
};

const generateParentRuntimeContext = (companyName: string) => {
  return {
    entity: {
      id: `company_id_${faker.datatype.number()}`,
      data: {
        companyName: companyName,
        additionalInfo: {
          ubos: [
            {
              entity: {
                id: faker.datatype.uuid(),
                data: {
                  email: faker.internet.email(),
                  lastName: faker.name.lastName(),
                  firstName: faker.name.firstName(),
                  additionalInfo: {
                    companyName: faker.company.companyName(),
                    customerCompany: faker.random.word(),
                  },
                },
                type: 'individual',
              },
            },
          ],
          registrationNumber: faker.random.alphaNumeric(8),
          countryOfIncorporation: faker.address.country(),
          taxIdentificationNumber: faker.random.alphaNumeric(8),
        },
        type: 'business',
      },
      documents: [
        {
          id: faker.datatype.uuid(),
          type: 'unknown',
          pages: [
            {
              uri: faker.image.imageUrl(),
              type: 'pdf',
              metadata: { side: 'front', pageNumber: '1' },
              provider: 'http',
              ballerineFileId: faker.random.alphaNumeric(20),
            },
          ],
          issuer: { country: faker.address.countryCode() },
          version: '1',
          category: 'proof_of_Address',
          properties: { docNumber: '1234', userAddress: faker.address.streetAddress() },
          issuingVersion: 1,
        },
      ],
      pluginsOutput: {
        open_corporates: {
          name: companyName,
          source: {
            url: faker.internet.url(),
            publisher: faker.company.companyName(),
            retrievedAt: faker.date.past().toISOString(),
          },
          isBranch: faker.datatype.boolean(),
          officers: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => ({
            name: faker.name.findName(),
            address: faker.address.streetAddress(),
            endDate: faker.date.past().toISOString(),
            position: faker.name.jobTitle(),
            startDate: faker.date.past().toISOString(),
            isInactive: faker.datatype.boolean(),
            occupation: faker.random.word(),
            currentStatus: faker.helpers.arrayElement([null, 'active']),
          })),
          agentName: faker.name.findName(),
          industries: Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, () => ({
            uid: faker.datatype.uuid(),
            code: faker.random.alphaNumeric(4),
            description: faker.company.catchPhrase(),
            codeSchemeId: faker.random.word(),
            codeSchemeName: faker.random.word(),
          })),
          isInactive: faker.datatype.boolean(),
          companyType: 'Private Limited Company',
          identifiers: [
            {
              uid: faker.random.numeric(),
              identifierSystemCode: faker.random.alphaNumeric(6),
              identifierSystemName: faker.random.word(),
            },
          ],
          registryUrl: faker.internet.url(),
          branchStatus: null,
          companyNumber: faker.random.alphaNumeric(8),
          currentStatus: 'Active',
          previousNames: [
            {
              type: null,
              endDate: faker.date.past().toISOString(),
              language: null,
              startDate: faker.date.past().toISOString(),
              companyName: faker.company.companyName(),
            },
          ],
          dissolutionDate: null,
          alternativeNames: [],
          jurisdictionCode: 'gb',
          incorporationDate: faker.date.past().toISOString(),
          numberOfEmployees: faker.random.numeric(),
          registeredAddress: {
            region: null,
            country: faker.address.country(),
            locality: faker.address.city(),
            postalCode: faker.address.zipCode(),
            streetAddress: faker.address.streetAddress(),
          },
          registeredAddressInFull: faker.address.streetAddress(),
        },
      },
      childWorkflows: {
        kyc_email_session_example: {
          [faker.random.alphaNumeric(20)]: {
            result: {
              childEntity: {
                email: faker.internet.email(),
                lastName: faker.name.lastName(),
                firstName: faker.name.firstName(),
                additionalInfo: {
                  companyName: faker.company.companyName(),
                  customerCompany: faker.random.word(),
                },
              },
              vendorResult: {
                aml: {
                  hits: [],
                  endUserId: faker.random.alphaNumeric(40),
                  matchStatus: 'no_match',
                },
                entity: {
                  data: {
                    lastName: faker.name.lastName(),
                    firstName: faker.name.firstName(),
                    nationalId: faker.random.alphaNumeric(10),
                    dateOfBirth: faker.date.past().toISOString(),
                    additionalInfo: {
                      gender: faker.helpers.arrayElement(['M', 'F']),
                      addresses: [],
                      nationality: faker.address.countryCode(),
                      yearOfBirth: null,
                      placeOfBirth: null,
                    },
                  },
                  type: 'individual',
                },
                decision: {
                  status: 'approved',
                  riskLabels: [],
                  decisionReason: null,
                },
                metadata: {
                  id: faker.datatype.uuid(),
                  url: faker.internet.url(),
                },
              },
            },
            status: 'active',
            entityId: faker.datatype.uuid(),
          },
        },
      },
      workflowRuntimeId: faker.random.alphaNumeric(20),
    },
  };
}
