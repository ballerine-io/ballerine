import { useSorting } from '@/common/hooks/useSorting';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import {
  getEventOptions,
  getStateOptions,
} from '@/components/molecules/WorkflowsTable/components/StateUpdaterColumn/helpers';
import { useFilters } from '@/components/providers/FiltersProvider/hooks/useFilters';
import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { useSendWorkflowEventMutation } from '@/pages/Workflows/hooks/useSendWorkflowEventMutation';
import { useUpdateWorkflowsStateMutation } from '@/pages/Workflows/hooks/useUpdateWorkflowsStateMutation';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { SelectGroup } from '@radix-ui/react-select';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

interface IStateUpdaterColumnProps {
  state: string;
  workflow: IWorkflow;
  workflowDefinition: IWorkflowDefinition;
}

export const StateUpdaterColumn: FunctionComponent<IStateUpdaterColumnProps> = ({
  state,
  workflow,
  workflowDefinition,
}) => {
  const { sortingDirection, sortingKey } = useSorting('order_by');
  const { filters: _filters } = useFilters<WorkflowsFiltersValues>();
  const { fromDate: _, orderBy, orderDirection, ...filters } = _filters;
  const { mutate: mutateWorkflowState, isLoading: isMutatingWorkflowState } =
    useUpdateWorkflowsStateMutation();
  const { mutate: sendWorkflowEvent, isLoading: isSendingWorkflowEvent } =
    useSendWorkflowEventMutation();
  const options = useMemo(() => getStateOptions(workflowDefinition), [workflowDefinition]);
  const eventOptions = useMemo(() => getEventOptions(workflowDefinition), [workflowDefinition]);
  const [pickedEvent, setPickedEvent] = useState<string | null>(null);

  const handleStateChange = useCallback(
    (newState: string) =>
      mutateWorkflowState({
        workflowId: workflow.id,
        state: newState,
        ...filters,
        ...(sortingKey && sortingDirection
          ? { orderBy: sortingKey, orderDirection: sortingDirection }
          : undefined),
      }),
    [filters, sortingKey, sortingDirection, mutateWorkflowState],
  );

  const handleSendEventClick = useCallback(() => {
    if (!pickedEvent) return;

    sendWorkflowEvent({
      workflowId: workflow.id,
      name: pickedEvent.split('-').slice(1).join('-'),
      ...filters,
      ...(sortingKey && sortingDirection
        ? { orderBy: sortingKey, orderDirection: sortingDirection }
        : undefined),
    });
  }, [filters, sortingKey, sortingDirection, pickedEvent, sendWorkflowEvent]);

  return (
    <div className="flex flex-row flex-nowrap items-center gap-2">
      <div className="flex-1">
        <Select
          defaultValue={state}
          key={state}
          disabled={isMutatingWorkflowState}
          onValueChange={handleStateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="State"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option} children={option} />
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Dialog onOpenChange={open => !open && setPickedEvent(null)}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">Send Event</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader className="flex flex-col gap-4">
                  <CardTitle>Workflow State: {state}</CardTitle>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <Select
                        defaultValue={state}
                        disabled={isMutatingWorkflowState}
                        onValueChange={event => setPickedEvent(event)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="State"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {eventOptions.map(option => (
                            <SelectGroup key={option.name}>
                              <SelectLabel>{`${option.name} ${
                                option.value === state ? '(current)' : ''
                              }`}</SelectLabel>
                              {option.options?.map(childOption => (
                                <SelectItem
                                  key={`${option.name}-${childOption.name}`}
                                  value={`${option.name}-${childOption.value}`}
                                >
                                  {childOption.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        className="whitespace-nowrap"
                        disabled={!pickedEvent}
                        onClick={handleSendEventClick}
                      >
                        Send Event
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
