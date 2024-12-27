import { useWorkflowDefinitionQuery } from '@/common/hooks/useWorkflowDefinitionQuery';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { XstateVisualizer } from '@/components/organisms/XstateVisualizer';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { EditorCard } from '@/pages/WorkflowDefinition/components/EditorCard';
import { WorkflowDefinitionEditor } from '@/pages/WorkflowDefinition/components/WorkflowDefinitionEditor/WorkflowDefinitionEditor';
import { WorkflowDefinitionSummaryCard } from '@/pages/WorkflowDefinition/components/WorkflowDefinitionSummaryCard';
import { useUpgradeWorkflowDefinitionVersionMutation } from '@/pages/WorkflowDefinition/hooks/useUpgradeWorkflowDefinitionVersionMutation';
import { useWorkflowDefinitionEdit } from '@/pages/WorkflowDefinition/hooks/useWorkflowDefinitionEdit';
import { useWorkflowDefinitionExtensionsEdit } from '@/pages/WorkflowDefinition/hooks/useWorkflowDefinitionExtensionsEdit';
import { ViewWorkflow } from '@/pages/Workflows/components/organisms/WorkflowsList/components/ViewWorkflow';
import { isAxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Dialog } from '@/components/atoms/Dialog';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';

export const VENDOR_DETAILS = {
  'api-plugins': {
    'registry-information': {
      title: 'Registry Information',
      description: 'Company registry and business information services',
      vendors: {
        'asia-verify': {
          logoUrl: 'https://cdn.ballerine.io/logos/AsiaVerify_Logo.png',
          description:
            'Company screening, UBO verification and registry information services focused on APAC region',
          configExample: {
            name: 'asiaVerifyRegistryInfo',
            vendor: 'asia-verify',
            pluginKind: 'registry-information',
            stateNames: ['run_vendor_data'],
            displayName: 'Asia Verify Registry Information',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
        kyckr: {
          logoUrl: 'https://cdn.ballerine.io/logos/kyckr-logo.png',
          description: 'UBO verification and company registry information services',
          configExample: {
            name: 'kyckrRegistryInfo',
            vendor: 'kyckr',
            pluginKind: 'registry-information',
            stateNames: ['run_vendor_data'],
            displayName: 'Kyckr Registry Information',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
        test: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Test vendor for development purposes',
          configExample: {
            name: 'testRegistryInfo',
            vendor: 'test',
            pluginKind: 'registry-information',
            stateNames: ['run_vendor_data'],
            displayName: 'Test Registry Information',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
      },
    },
    'individual-sanctions': {
      title: 'Individual Sanctions',
      description: 'Individual sanctions screening and risk assessment',
      vendors: {
        'dow-jones': {
          logoUrl: 'https://cdn.ballerine.io/logos/Dow_Jones_Logo.png',
          description: 'Sanctions screening and risk data for individuals',
          configExample: {
            name: 'dowJonesSanctions',
            vendor: 'dow-jones',
            pluginKind: 'individual-sanctions',
            stateNames: ['run_vendor_data'],
            displayName: 'Dow Jones Individual Sanctions',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
        'comply-advantage': {
          logoUrl: 'https://cdn.ballerine.io/logos/comply-advantage-logo.png',
          description: 'AI-driven sanctions screening and monitoring for individuals',
          configExample: {
            name: 'complyAdvantageSanctions',
            vendor: 'comply-advantage',
            pluginKind: 'individual-sanctions',
            stateNames: ['run_vendor_data'],
            displayName: 'ComplyAdvantage Individual Sanctions',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
      },
    },
    'company-sanctions': {
      title: 'Company Sanctions',
      description: 'Company sanctions screening and monitoring',
      vendors: {
        test: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Test vendor for company sanctions screening',
          configExample: {
            name: 'companySanctions',
            vendor: 'test',
            pluginKind: 'company-sanctions',
            stateNames: ['run_vendor_data'],
            displayName: 'Company Sanctions',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
      },
    },
    ubo: {
      title: 'UBO Verification',
      description: 'Ultimate Beneficial Owner verification services',
      vendors: {
        test: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Test vendor for UBO verification',
          configExample: {
            name: 'uboVerification',
            vendor: 'test',
            pluginKind: 'ubo',
            stateNames: ['run_vendor_data'],
            displayName: 'UBO Check',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
      },
    },
    'merchant-monitoring': {
      title: 'Merchant Monitoring',
      description: 'Ongoing merchant monitoring and risk assessment',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Merchant monitoring and risk assessment service',
          configExample: {
            name: 'merchantMonitoring',
            vendor: 'ballerine',
            pluginKind: 'merchant-monitoring',
            stateNames: ['run_merchant_monitoring'],
            displayName: 'Merchant Monitoring',
            errorAction: 'MERCHANT_MONITORING_FAILED',
            successAction: 'MERCHANT_MONITORING_SUCCESS',
            merchantMonitoringQualityControl: false,
          },
        },
      },
    },
    'mastercard-merchant-screening': {
      title: 'Mastercard Merchant Screening',
      description: 'Merchant screening via Mastercard services',
      vendors: {
        mastercard: {
          logoUrl: 'https://cdn.ballerine.io/logos/Mastercard%20logo.svg',
          description: 'Mastercard merchant screening service',
          configExample: {
            name: 'merchantScreening',
            vendor: 'mastercard',
            pluginKind: 'mastercard-merchant-screening',
            stateNames: ['run_vendor_data'],
            displayName: 'Merchant Screening',
            errorAction: 'VENDOR_DONE',
            successAction: 'VENDOR_DONE',
          },
        },
      },
    },
    'kyc-session': {
      title: 'KYC Session',
      description: 'Identity verification and KYC services',
      vendors: {
        veriff: {
          logoUrl: 'https://cdn.ballerine.io/logos/Veriff_logo.svg.png',
          description: 'KYC verification and identity proofing services',
          configExample: {
            name: 'veriffKyc',
            vendor: 'veriff',
            pluginKind: 'kyc-session',
            stateNames: ['run_kyc'],
            displayName: 'Veriff KYC Session',
            errorAction: 'KYC_FAILED',
            successAction: 'KYC_SUCCESS',
          },
        },
      },
    },
  },
  'common-plugins': {
    'template-email': {
      title: 'Email Templates',
      description: 'Email template services',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Email template service',
          configExample: {
            name: 'invitation-email',
            template: 'invitation',
            pluginKind: 'template-email',
            stateNames: ['collection_invite'],
            errorAction: 'INVITATION_FAILURE',
            successAction: 'INVITATION_SENT',
          },
        },
      },
    },
    'risk-rules': {
      title: 'Risk Rules',
      description: 'Risk assessment rules engine',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Risk rules engine service',
          configExample: {
            name: 'riskEvaluation',
            pluginKind: 'riskRules',
            stateNames: ['manual_review', 'run_vendor_data'],
            rulesSource: {
              source: 'notion',
              databaseId: 'd29390ac964b45b1a79ef45eed735a77',
            },
          },
        },
      },
    },
    'child-workflow': {
      title: 'Child Workflows',
      description: 'Child workflow management',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Child workflow service',
          configExample: {
            name: 'veriff_kyc_child_plugin',
            initEvent: 'start',
            pluginKind: 'child',
            definitionId: 'kyc_email_session_example',
          },
        },
      },
    },
    'dispatch-event': {
      title: 'Event Dispatch',
      description: 'Event dispatch service',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Event dispatch service',
          configExample: {
            name: 'dispatchEvent',
            pluginKind: 'dispatch-event',
            stateNames: ['dispatch_event'],
            eventName: 'CUSTOM_EVENT',
          },
        },
      },
    },
    iterative: {
      title: 'Iterative',
      description: 'Iterative plugin service',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Iterative plugin service',
          configExample: {
            name: 'ubos_iterative',
            pluginKind: 'iterative',
            stateNames: ['run_ubos'],
            iterateOn: [
              {
                mapping: 'entity.data.additionalInfo.contacts',
                transformer: 'jmespath',
              },
            ],
            errorAction: 'FAILED_EMAIL_SENT_TO_UBOS',
            successAction: 'EMAIL_SENT_TO_UBOS',
          },
        },
      },
    },
    transformer: {
      title: 'Transformer',
      description: 'Data transformation service',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'Data transformation service',
          configExample: {
            name: 'transformData',
            pluginKind: 'transformer',
            stateNames: ['transform_data'],
            transformers: [
              {
                mapping: '{transformed: @}',
                transformer: 'jmespath',
              },
            ],
          },
        },
      },
    },
    'attach-ui-definition': {
      title: 'UI Definition',
      description: 'UI definition attachment service',
      vendors: {
        ballerine: {
          logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          description: 'UI definition attachment service',
          configExample: {
            name: 'Attach APAC Flow UI',
            pluginKind: 'attach-ui-definition',
            stateNames: ['collection_flow'],
            errorAction: 'INVITATION_FAILURE',
            uiDefinitionId: 'cm500fmsi000grukeo31qdigh',
            expireInMinutes: 21600,
          },
        },
      },
    },
  },
} as const;

export type VendorId = keyof typeof VENDOR_DETAILS;

export const WorkflowDefinition = () => {
  const id = useParams<{ id: string }>().id;
  const { data, isLoading, error } = useWorkflowDefinitionQuery(id);
  const { workflowDefinitionValue, handleWorkflowDefinitionSave } = useWorkflowDefinitionEdit(data);
  const { workflowDefinitionExtensions, handleWorkflowExtensionsSave } =
    useWorkflowDefinitionExtensionsEdit(data);
  const { mutate: upgradeWorkflowDefinitionVersion } =
    useUpgradeWorkflowDefinitionVersionMutation();
  const [isIntegrationCatalogOpen, setIsIntegrationCatalogOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <DashboardLayout pageName="Loading">
        <div className="flex h-full w-full justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      return (
        <DashboardLayout pageName="Workflow Definition">
          <h1 className="flex flex-col gap-4">Workflow Definition not found.</h1>
          <h2>
            Back to{' '}
            <Link to="/workflow-definitions">
              <span className="underline">list.</span>
            </Link>
          </h2>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout pageName="Workflow Definition">
        Failed to fetch workflow definition.
      </DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <>
      <DashboardLayout pageName={`Workflow Definition - ${data?.displayName || data?.name}`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-stretch gap-2">
            <div className="w-[75%]">
              <Card className="h-full bg-gradient-to-br from-slate-50 to-white shadow-lg">
                <CardHeader className="flex flex-row justify-between border-b border-slate-200 bg-white/50">
                  <h2 className="text-lg font-bold text-slate-800">X-State Visualizer</h2>
                  <ViewWorkflow
                    workflow={{ state: '', workflowDefinitionId: data?.id } as IWorkflow}
                  />
                </CardHeader>
                <CardContent className="mr-6 flex h-[400px] flex-row overflow-hidden">
                  <XstateVisualizer
                    stateDefinition={data?.definition}
                    state={''}
                    key={JSON.stringify(data?.definition || {})}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="w-[25%]">
              <WorkflowDefinitionSummaryCard workflowDefinition={data} />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <WorkflowDefinitionEditor workflowDefinition={data} />
            </div>
            <div className="w-1/2">
              <EditorCard
                title="Config"
                value={data.config}
                onChange={value => {
                  console.log('changed value', value);
                }}
                onUpgrade={() =>
                  upgradeWorkflowDefinitionVersion({ workflowDefinitionId: data.id! })
                }
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <EditorCard
                title="Plugins"
                value={workflowDefinitionExtensions || {}}
                onSave={handleWorkflowExtensionsSave}
                onUpgrade={() =>
                  upgradeWorkflowDefinitionVersion({ workflowDefinitionId: data.id! })
                }
                enableViewMode={true}
                viewDialogContent={
                  <div className="flex flex-col gap-8 bg-slate-50 p-6">
                    <div className="flex justify-end">
                      <Button onClick={() => setIsIntegrationCatalogOpen(true)}>
                        View Integrations Catalog
                      </Button>
                    </div>
                    {isIntegrationCatalogOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Dialog
                          open={isIntegrationCatalogOpen}
                          onOpenChange={setIsIntegrationCatalogOpen}
                        >
                          <div className="max-h-[90vh] w-[90vw] overflow-y-auto rounded-xl bg-white p-8 shadow-2xl">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">Integrations Catalog</h2>
                                <Button
                                  variant="ghost"
                                  onClick={() => setIsIntegrationCatalogOpen(false)}
                                  className="rounded-full p-2 hover:bg-slate-100"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </Button>
                              </div>
                              <div className="flex flex-col gap-8 p-6">
                                {Object.entries(VENDOR_DETAILS['api-plugins']).map(
                                  ([pluginKind, pluginInfo]) => {
                                    return (
                                      <div key={pluginKind} className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-10 w-1 rounded-full bg-blue-500" />
                                          <div>
                                            <h3 className="text-2xl font-bold text-slate-800">
                                              {pluginInfo.title}
                                            </h3>
                                            <p className="text-slate-600">
                                              {pluginInfo.description}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                          {Object.entries(pluginInfo.vendors).map(
                                            ([vendorKey, vendorInfo]) => (
                                              <div
                                                key={vendorKey}
                                                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg"
                                              >
                                                <div className="flex items-center gap-4">
                                                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-slate-100 bg-white p-2">
                                                    <img
                                                      src={vendorInfo.logoUrl}
                                                      alt={vendorKey}
                                                      className="h-full w-full object-contain"
                                                      onError={e => {
                                                        e.currentTarget.src =
                                                          'https://cdn.ballerine.io/logos/ballerine-logo.png';
                                                      }}
                                                    />
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                      <h4 className="font-semibold text-slate-800">
                                                        {vendorKey
                                                          .split('-')
                                                          .map(
                                                            word =>
                                                              word.charAt(0).toUpperCase() +
                                                              word.slice(1),
                                                          )
                                                          .join(' ')}
                                                      </h4>
                                                      <button
                                                        onClick={() => copyToClipboard(vendorKey)}
                                                        className="rounded-md p-1 hover:bg-slate-100"
                                                        title="Copy vendor key"
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          className="h-4 w-4"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          strokeWidth="2"
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                        >
                                                          <rect
                                                            x="9"
                                                            y="9"
                                                            width="13"
                                                            height="13"
                                                            rx="2"
                                                            ry="2"
                                                          ></rect>
                                                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                      </button>
                                                    </div>
                                                    <p className="text-sm text-slate-600">
                                                      {vendorInfo.description}
                                                    </p>
                                                  </div>
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-700">
                                                      Configuration Example
                                                    </span>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        copyToClipboard(
                                                          JSON.stringify(
                                                            vendorInfo.configExample,
                                                            null,
                                                            2,
                                                          ),
                                                        )
                                                      }
                                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                      >
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                      </svg>
                                                      Copy Config
                                                    </Button>
                                                  </div>
                                                  <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-sm text-slate-800">
                                                    <code>
                                                      {JSON.stringify(
                                                        vendorInfo.configExample,
                                                        null,
                                                        2,
                                                      )}
                                                    </code>
                                                  </pre>
                                                </div>

                                                {vendorInfo.configExample.stateNames?.length >
                                                  0 && (
                                                  <div className="flex flex-wrap gap-2">
                                                    {vendorInfo.configExample.stateNames?.map(
                                                      (state: string) => (
                                                        <span
                                                          key={state}
                                                          className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm"
                                                        >
                                                          {state}
                                                        </span>
                                                      ),
                                                    )}
                                                  </div>
                                                )}

                                                <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-4">
                                                  {vendorInfo.configExample.successAction && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                      <span className="font-medium text-slate-600">
                                                        Success:
                                                      </span>
                                                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                                                        {vendorInfo.configExample.successAction}
                                                      </span>
                                                    </div>
                                                  )}

                                                  {vendorInfo.configExample.errorAction && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                      <span className="font-medium text-slate-600">
                                                        Error:
                                                      </span>
                                                      <span className="rounded-md bg-red-50 px-2 py-0.5 font-medium text-red-600">
                                                        {vendorInfo.configExample.errorAction}
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        </Dialog>
                      </div>
                    )}
                    {Object.entries(workflowDefinitionExtensions || {}).map(
                      ([category, plugins]) => (
                        <div
                          key={category}
                          className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition-shadow hover:shadow-lg"
                        >
                          <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold text-slate-800">
                            <div className="h-10 w-1 rounded-full bg-blue-500" />
                            {category
                              .split(/(?=[A-Z])/)
                              .join(' ')
                              .replace('Plugins', '')
                              .replace(/^\w/, c => c.toUpperCase())}{' '}
                            Plugins
                          </h3>
                          <div className="grid grid-cols-3 gap-6">
                            {(plugins as any[]).map(plugin => (
                              <div
                                key={plugin.name}
                                className="group flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all group-hover:border-blue-100 group-hover:shadow-md">
                                    {plugin.vendor === 'test' ? (
                                      <div className="flex h-full w-full items-center justify-center">
                                        <span className="text-lg font-medium text-slate-400">
                                          Test
                                        </span>
                                      </div>
                                    ) : plugin.vendor ? (
                                      <img
                                        src={
                                          // @ts-expect-error -- TODO: fix this
                                          (VENDOR_DETAILS?.['api-plugins']?.[plugin.pluginKind]
                                            ?.vendors?.[plugin.vendor]?.logoUrl as string) ||
                                          `https://cdn.ballerine.io/logos/${plugin.vendor.toLowerCase()}-logo.png`
                                        }
                                        alt={plugin.vendor}
                                        className="h-full w-full object-contain"
                                        onError={e => {
                                          e.currentTarget.src =
                                            'https://cdn.ballerine.io/logos/ballerine-logo.png';
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src="https://cdn.ballerine.io/logos/ballerine-logo.png"
                                        alt="Ballerine"
                                        className="mx-auto h-12 w-12 rounded-full object-contain"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
                                      {(plugin.displayName || plugin.name)
                                        .split(/(?=[A-Z])/)
                                        .join(' ')}
                                    </h4>
                                    <div className="flex flex-col gap-1">
                                      <p className="text-sm font-medium text-slate-400">
                                        {plugin.pluginKind}
                                      </p>
                                      {plugin.vendor && (
                                        <p className="text-sm font-medium text-slate-500">
                                          by {plugin.vendor}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {plugin.stateNames?.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {plugin.stateNames?.map((state: string) => (
                                      <span
                                        key={state}
                                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm"
                                      >
                                        {state}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-4">
                                  {plugin.successAction && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-slate-600">Success:</span>
                                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                                        {plugin.successAction}
                                      </span>
                                    </div>
                                  )}

                                  {plugin.errorAction && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-medium text-slate-600">Error:</span>
                                      <span className="rounded-md bg-red-50 px-2 py-0.5 font-medium text-red-600">
                                        {plugin.errorAction}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                }
              />
            </div>
            <div className="w-1/2">
              <EditorCard
                title="Context Schema"
                value={data.contextSchema}
                onChange={value => {
                  console.log('changed value', value);
                }}
                onUpgrade={() =>
                  upgradeWorkflowDefinitionVersion({ workflowDefinitionId: data.id! })
                }
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};
