import { fetchJson } from '@/utils';
import { ENTITY_ID_STORAGE_KEY } from '@/constants';

export type WorkServiceEndpoints = {
  base: string;
};
export class BallerineBackOfficeService {
  constructor(private readonly baseUrl: string = 'http://localhost:3000/api/v1/external') {}

  fetchEndUser = async (id: string) => fetchJson(`${this.baseUrl}/end-users/${id}`);
  fetchBusiness = async (id: string) => fetchJson(`${this.baseUrl}/businesses/${id}`);

  fetchWorkflow = async (id: string) => fetchJson(`${this.baseUrl}/workflows/${id}`);
  fetchWorkflows = async ({
    entityType,
    entityId,
  }: {
    entityType: 'end-user' | 'business';
    entityId: string;
  }) =>
    fetchJson<
      Array<{
        workflowDefinition: {
          id: string;
          name: string;
        };
        workflowRuntimeData: {
          id: string;
          status: string;
        };
      }>
    >(`${this.baseUrl}/workflows/${entityType}/${entityId}`);
  fetchIntent = async () =>
    fetchJson<Array<Record<string, unknown>>>(`${this.baseUrl}/workflows/intent`, {
      method: 'POST',
      body: {
        intentName: import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? 'kycSignup' : 'kybSignup',
        entityId: sessionStorage.getItem(ENTITY_ID_STORAGE_KEY),
      },
    });

  fetchBusinessSignUp = async ({
    companyName,
    registrationNumber,
  }: {
    companyName: string;
    registrationNumber: string;
  }) =>
    fetchJson(
      `${this.baseUrl}/${import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? 'end-users' : 'businesses'}`,
      {
        method: 'POST',
        body: {
          companyName,
          registrationNumber,
        },
      },
    );

  fetchEnduserSignUp = async ({ firstName, lastName }: { firstName: string; lastName: string }) =>
    fetchJson(
      `${this.baseUrl}/${import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? 'end-users' : 'businesses'}`,
      {
        method: 'POST',
        body: {
          firstName,
          lastName,
        },
      },
    );
}
