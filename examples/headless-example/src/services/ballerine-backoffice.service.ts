import { fetchJson } from '@/utils';

export type WorkServiceEndpoints = {
  base: string;
};
export class BallerineBackOfficeService {
  constructor(private readonly baseUrl: string = 'http://localhost:3000/api/external') {}

  fetchEndUser = async (id: string) => fetchJson(`${this.baseUrl}/end-users/${id}`);
  fetchBusiness = async (id: string) => fetchJson(`${this.baseUrl}/businesses/${id}`);

  fetchWorkflow = async (id: string) => fetchJson(`${this.baseUrl}/workflows/${id}`);
  fetchWorkflows = async () =>
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
    >(`${this.baseUrl}/workflows`);
  fetchIntent = async () =>
    fetchJson<Array<Record<string, unknown>>>(`${this.baseUrl}/workflows/intent`, {
      method: 'POST',
      body: { intentName: import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? 'kycSignup' : 'kybSignup' },
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
