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

export const VENDOR_DETAILS = {
  'dow-jones': {
    logoUrl: 'https://cdn.ballerine.io/logos/Dow_Jones_Logo.png',
    description: 'Dow Jones provides sanctions screening and risk data for individuals',
  },
  'comply-advantage': {
    logoUrl: 'https://cdn.ballerine.io/logos/comply-advantage-logo.png',
    description:
      'ComplyAdvantage offers AI-driven sanctions screening and monitoring for individuals',
  },
  asiaverify: {
    logoUrl: 'https://cdn.ballerine.io/logos/AsiaVerify_Logo.png',
    description:
      'AsiaVerify provides company screening, UBO verification and registry information services focused on APAC region',
  },
  veriff: {
    logoUrl: 'https://cdn.ballerine.io/logos/Veriff_logo.svg.png',
    description: 'Veriff provides KYC verification and identity proofing services',
  },
  ballerine: {
    logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
    description: 'Ballerine provides merchant monitoring services',
  },
  kyckr: {
    logoUrl: 'https://cdn.ballerine.io/logos/kyckr-logo.png',
    description: 'Kyckr provides UBO verification and company registry information services',
  },
  test: {
    logoUrl: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
    description: 'Test vendor for development purposes',
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
              onUpgrade={() => upgradeWorkflowDefinitionVersion({ workflowDefinitionId: data.id! })}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <EditorCard
              title="Plugins"
              value={workflowDefinitionExtensions || {}}
              onSave={handleWorkflowExtensionsSave}
              onUpgrade={() => upgradeWorkflowDefinitionVersion({ workflowDefinitionId: data.id! })}
              enableViewMode={true}
              viewDialogContent={
                <div className="flex flex-col gap-8 bg-slate-50 p-6">
                  {Object.entries(workflowDefinitionExtensions || {}).map(([category, plugins]) => (
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
                              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-sm transition-all group-hover:border-blue-100 group-hover:shadow-md">
                                {plugin.vendor === 'test' ? (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <span className="text-sm font-medium text-slate-400">Test</span>
                                  </div>
                                ) : plugin.vendor ? (
                                  <img
                                    src={
                                      VENDOR_DETAILS[plugin.vendor as VendorId]?.logoUrl ||
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
                                    className="h-full w-full object-contain"
                                  />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
                                  {(plugin.displayName || plugin.name).split(/(?=[A-Z])/).join(' ')}
                                </h4>
                                <p className="text-sm font-medium text-slate-400">
                                  {plugin.pluginKind}
                                </p>
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
                  ))}
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
              onUpgrade={() => upgradeWorkflowDefinitionVersion({ workflowDefinitionId: data.id! })}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
