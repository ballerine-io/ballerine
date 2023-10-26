import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@app/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { createAndInsertInitialData } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation/helpers/createInitialData';
import { isInitialDataAlreadyExists } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation/helpers/isInitialDataAlreadyExists';
import { removeDataAndAssignChanges } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation/helpers/removeDataAndAssignChanges';
import { useUIElementProps } from '@app/components/organisms/UIRenderer/hooks/useUIElementProps';
import {
  UIElementComponent,
  UIElementComponentProps,
} from '@app/components/organisms/UIRenderer/types';
import { Rule } from '@app/domains/collection-flow';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

export type PickFromDestinationPath = string;
export type SetToDestinationPath = string;

export type DataCreationSchema = Record<SetToDestinationPath, PickFromDestinationPath>;

export interface InitialDataCreationSettings {
  destination?: string;
  createWhenHidden?: boolean;
  schema: DataCreationSchema;
  insertRules?: Rule[];
  deleteRules?: Rule[];
}

export interface DataCreationParams {
  dataCreation?: InitialDataCreationSettings;
}

export type WrappableComponentProps<TElementParams> = UIElementComponentProps<
  TElementParams & DataCreationParams
>;

export function withInitialDataCreation<TElementParams>(
  Component: React.ComponentType<WrappableComponentProps<TElementParams>>,
) {
  const Wrapper = (props: WrappableComponentProps<TElementParams>) => {
    const { definition } = props;
    const { dataCreation } = definition.options || {};

    const { state } = useDynamicUIContext();
    const { hidden } = useUIElementProps(definition);
    const { stateApi, payload } = useStateManagerContext();

    const insertRules = useMemo(() => dataCreation?.insertRules || [], [dataCreation]);
    const deleteRules = useMemo(() => dataCreation?.deleteRules || [], [dataCreation]);

    const dataCreationExecutionResult = useRuleExecutor(payload, insertRules, definition, state);
    const dataDeletionExectuionResult = useRuleExecutor(payload, deleteRules, definition, state);

    const isCanCreateInitialData = useMemo(() => {
      if (!dataCreation) return true;
      if (!dataCreation.insertRules || !dataCreation.insertRules.length) return true;
      return (
        dataCreationExecutionResult.length &&
        dataCreationExecutionResult.every(result => result.isValid)
      );
    }, [dataCreation, dataCreationExecutionResult]);

    const apiRef = useRef(stateApi);

    const isShouldDeleteData = useMemo(() => {
      if (!dataCreation || !dataCreation.deleteRules?.length) return false;

      return dataDeletionExectuionResult.length
        ? dataDeletionExectuionResult.every(rule => rule.isValid)
        : false;
    }, [dataDeletionExectuionResult, dataCreation]);

    useEffect(() => {
      apiRef.current = stateApi;
    }, [stateApi]);

    useLayoutEffect(() => {
      if (!dataCreation) return;
      if (!dataCreation.createWhenHidden && hidden) return;
      if (!isCanCreateInitialData) return;
      if (isInitialDataAlreadyExists(apiRef.current.getContext(), dataCreation.schema)) return;

      const ctx = createAndInsertInitialData(apiRef.current.getContext(), dataCreation.schema);

      apiRef.current.setContext(ctx);
    }, [dataCreation, hidden, apiRef, isCanCreateInitialData]);

    useLayoutEffect(() => {
      if (!isShouldDeleteData) return;

      apiRef.current.setContext(
        removeDataAndAssignChanges(apiRef.current.getContext(), dataCreation.destination || ''),
      );
    }, [isShouldDeleteData, dataCreation]);

    return <Component {...props} />;
  };

  Wrapper.displayName = `withInitialDataCreation(${Component.displayName})`;

  type WrappedComponent = UIElementComponent<TElementParams>;

  return Wrapper as WrappedComponent;
}
