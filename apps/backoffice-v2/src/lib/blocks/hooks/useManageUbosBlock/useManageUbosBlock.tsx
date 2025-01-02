import { useWorkflowDefinitionByIdQuery } from '@/domains/workflow-definitions/hooks/queries/useWorkflowDefinitionByQuery/useWorkflowDefinitionByIdQuery';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { ubosFormJsonDefinition } from './ubos-form-json-definition';
import { useCallback } from 'react';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import {
  baseLayouts,
  DynamicForm,
  FieldLayout,
  ScrollArea,
  TextWithNAFallback,
} from '@ballerine/ui';
import { Button } from '@/common/components/atoms/Button/Button';
import { createColumnHelper } from '@tanstack/react-table';
import { createFormSchemaFromUIElements } from './utils/create-form-schema-from-ui-elements';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useMemo } from 'react';
import { ArrowLeft, Trash2Icon } from 'lucide-react';
import { set } from 'lodash-es';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { transformErrors } from '@/pages/Entities/components/CaseCreation/components/CaseCreationForm/utils/transform-errors';
import { useTranslateUiDefinitionQuery } from '@/domains/ui-definition/hooks/queries/useTranslateUiDefinitionQuery/useTranslateUiDefinitionQuery';
import { useDeleteUbosByIdsMutation } from '@/domains/workflows/hooks/mutations/useDeleteUbosByIdsMutation/useDeleteUbosByIdsMutation';
import { useCreateUboMutation } from '@/domains/workflows/hooks/mutations/useCreateUboMutation/useCreateUboMutation';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const useManageUbosBlock = ({
  create,
}: {
  create: {
    enabled: boolean;
  };
}) => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: workflowDefinition } = useWorkflowDefinitionByIdQuery({
    workflowDefinitionId: workflow?.workflowDefinition?.id ?? '',
  });
  const uiDefinition = workflowDefinition?.uiDefinitions?.find(
    uiDefinition => uiDefinition.uiContext === 'collection_flow',
  );
  const locale = useLocale();
  const { data: translatedUbos } = useTranslateUiDefinitionQuery({
    id: uiDefinition?.id ?? '',
    partialUiDefinition: ubosFormJsonDefinition,
    locale,
  });
  const { formSchema, uiSchema } = createFormSchemaFromUIElements(translatedUbos ?? {});
  const [isAddingUbo, _toggleIsAddingUbo, toggleOnIsAddingUbo, toggleOffIsAddingUbo] = useToggle();
  const [isManageUbosOpen, toggleIsManageUbosOpen] = useToggle();
  const { mutate: mutateCreateUbo } = useCreateUboMutation({
    workflowId: workflow?.id,
    onSuccess: () => {
      if (!isAddingUbo) {
        return;
      }

      toggleOffIsAddingUbo();
    },
  });
  const { mutate: mutateDeleteUbosByIds } = useDeleteUbosByIdsMutation({
    workflowId: workflow?.id,
  });
  const onRemoveUboFromContext = useCallback(
    (ids: string[]) => {
      return () => mutateDeleteUbosByIds(ids);
    },
    [mutateDeleteUbosByIds],
  );
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const layouts = useMemo(
    () => ({
      ...baseLayouts,
      FieldTemplate: FieldLayout,
      ButtonTemplates: {
        ...baseLayouts.ButtonTemplates,
        SubmitButton: () => (
          <div className="flex justify-end">
            <Button
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={!caseState.writeEnabled}
            >
              Submit
            </Button>
          </div>
        ),
      },
    }),
    [caseState.writeEnabled],
  );
  const columnHelper = createColumnHelper<{
    id: string;
    firstName: string;
    lastName: string;
    ownershipPercentage: number;
  }>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: 'First Name',
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
      }),
      columnHelper.accessor('ownershipPercentage', {
        header: '% of Ownership',
        cell: ({ getValue }) => {
          const value = getValue();

          return (
            <TextWithNAFallback>{value || value === 0 ? `${value}%` : value}</TextWithNAFallback>
          );
        },
      }),
      columnHelper.display({
        id: 'remove',
        header: '',
        cell: ({ row }) => {
          return (
            <Dialog
              trigger={
                <Button
                  type={'button'}
                  variant={'ghost'}
                  size={'icon'}
                  className={'aria-disabled:pointer-events-none aria-disabled:opacity-50'}
                  aria-disabled={!caseState.writeEnabled}
                >
                  <Trash2Icon className="h-4 w-4 text-destructive" />
                </Button>
              }
              title={'UBO removal confirmation'}
              description={
                <p className={`text-sm`}>
                  Are you sure you want to remove this UBO? This action will be logged, and the
                  UBO&apos;s data will be removed from the case.
                </p>
              }
              content={null}
              close={
                <div className={'space-x-2'}>
                  <Button type={'button'} variant={'secondary'}>
                    Cancel
                  </Button>
                  <Button
                    onClick={onRemoveUboFromContext([row.original.id])}
                    disabled={!caseState.writeEnabled}
                    className={'aria-disabled:pointer-events-none aria-disabled:opacity-50'}
                  >
                    Confirm
                  </Button>
                </div>
              }
              props={{
                content: {
                  className: 'mb-96',
                },
                title: {
                  className: `text-2xl`,
                },
              }}
            />
          );
        },
      }),
    ],
    [caseState.writeEnabled, columnHelper, onRemoveUboFromContext],
  );
  const onSubmit = useCallback(
    (data: Record<string, any>) => {
      const ubo = Object.entries(data).reduce((acc, [key, value]) => {
        const element = ubosFormJsonDefinition.elements.find(element => element.name === key);

        if (!element?.valueDestination) {
          return acc;
        }

        set(acc, element.valueDestination, value);

        return acc;
      }, {} as Record<string, unknown>);

      mutateCreateUbo(ubo);
    },
    [mutateCreateUbo],
  );
  const ubos = useMemo(() => {
    return (
      workflow?.childWorkflows?.map(childWorkflow => ({
        id: childWorkflow.context.entity.ballerineEntityId,
        firstName: childWorkflow.context.entity.data.firstName,
        lastName: childWorkflow.context.entity.data.lastName,
        ownershipPercentage:
          childWorkflow.context.entity.data.percentageOfOwnership ??
          childWorkflow.context.entity.data.ownershipPercentage ??
          childWorkflow.context.entity.data.additionalInfo.percentageOfOwnership ??
          childWorkflow.context.entity.data.additionalInfo.ownershipPercentage,
      })) ?? []
    );
  }, [workflow?.childWorkflows]);

  return createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'node',
      value: (
        <Dialog
          open={isManageUbosOpen}
          onOpenChange={toggleIsManageUbosOpen}
          props={{
            content: {
              className: 'px-0',
            },
          }}
          trigger={
            <Button
              type={'button'}
              variant="outline"
              className={
                'ms-auto px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50'
              }
              aria-disabled={!caseState.writeEnabled}
            >
              Manage UBOs
            </Button>
          }
          content={
            <div className={'flex flex-col justify-between space-y-4'}>
              {(!create.enabled || !isAddingUbo) && (
                <div className={'flex flex-col gap-4 px-4'}>
                  <h2 className={'text-lg font-semibold'}>Manage UBOs</h2>
                  <UrlDataTable
                    data={ubos}
                    columns={columns}
                    options={{
                      enableSorting: false,
                      getRowId: row => row.id,
                    }}
                    props={{
                      scroll: {
                        className: '[&>div]:max-h-[73vh]',
                      },
                    }}
                  />
                  {create.enabled && (
                    <Button
                      type={'button'}
                      className={
                        'ms-auto aria-disabled:pointer-events-none aria-disabled:opacity-50'
                      }
                      onClick={toggleOnIsAddingUbo}
                      aria-disabled={!caseState.writeEnabled}
                    >
                      Add UBO
                    </Button>
                  )}
                </div>
              )}
              {create.enabled && isAddingUbo && (
                <>
                  <Button
                    type={'button'}
                    variant={'ghost'}
                    onClick={toggleOffIsAddingUbo}
                    className={
                      'absolute left-4 top-4 rounded-sm p-0 opacity-70 transition-opacity d-4 hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 data-[state=open]:bg-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800'
                    }
                  >
                    <ArrowLeft className={'d-4'} />
                  </Button>

                  <div className={'flex flex-col gap-4 px-2'}>
                    <h2 className={'ps-2 text-lg font-semibold'}>Add UBO</h2>
                    <ScrollArea orientation={'vertical'} className={'h-[73vh]'}>
                      <DynamicForm
                        schema={formSchema}
                        uiSchema={uiSchema}
                        onSubmit={onSubmit}
                        layouts={layouts as typeof baseLayouts}
                        transformErrors={transformErrors}
                        className={'pe-4 ps-2 [&>div>fieldset>div:first-of-type]:py-0 [&>div]:py-0'}
                      />
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          }
          modal
        />
      ),
    })
    .build();
};
