import { useEffect, useRef, useState } from 'react';
import {
  ActionObject,
  ActionTypes,
  AssignAction,
  CancelAction,
  ChooseAction,
  EventObject,
  LogAction,
  RaiseAction,
  SendActionObject,
  SpecialTargets,
  StopAction,
} from 'xstate';
import { isDelayedTransitionAction, isStringifiedFunction } from './utils';

type AnyFunction = (...args: any[]) => any;

// atm inspected machines (their configs) are sent through postMessage
// that might, unfortunatelly, lose some information on our action objects
// this helper type ain't deep/recursive because we don't need it, our actions define properties only on the top-level of an object
type PotentiallyStructurallyCloned<T> = {
  [K in keyof T]: AnyFunction extends T[K] ? T[K] | undefined : T[K];
};

// at the moment a lot of invalid values can be passed through `createMachine` and reach lines like here
// so we need to be defensive about this before we implement some kind of a validation so we could raise such problems early and discard the invalid values
export function getActionLabel(action: ActionObject<any, any>): string | null {
  if (!action) {
    return null;
  }
  if (typeof action.exec === 'function') {
    return isStringifiedFunction(action.type) ? 'anonymous' : action.type;
  }
  if (!action.type) {
    return null;
  }
  if (action.type.startsWith('xstate.')) {
    return action.type.match(/^xstate\.(.+)$/)![1];
  }
  return action.type;
}

export const ActionType: React.FC<{ title?: string }> = ({ children, title }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [resolvedTitle, setTitle] = useState(title || '');

  useEffect(() => {
    if (ref.current && !title) {
      setTitle(ref.current.textContent!);
    }
  }, [title]);

  return (
    <div data-viz="action-type" title={resolvedTitle} ref={ref}>
      {children}
    </div>
  );
};

export const RaiseActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<RaiseAction<EventObject, any>>;
}> = ({ action }) => {
  return (
    <ActionType>
      <strong>raise</strong> {action.event}
    </ActionType>
  );
};

export const SendActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<SendActionObject<unknown, EventObject>>;
}> = ({ action }) => {
  if (!action.event) {
    return (
      <ActionType>
        <strong>send</strong> <em>unknown</em>
      </ActionType>
    );
  }

  const actionLabel =
    action.event.type === 'xstate.update' ? (
      <strong>send update</strong>
    ) : (
      <>
        <strong>send</strong> {action.event.type}
      </>
    );
  const actionTo = action.to ? (
    action.to === SpecialTargets.Parent ? (
      <>
        to <em>parent</em>
      </>
    ) : (
      <>to {action.to}</>
    )
  ) : (
    ''
  );

  return (
    <ActionType>
      {actionLabel} {actionTo}
    </ActionType>
  );
};

export const LogActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<LogAction<unknown, EventObject>>;
}> = ({ action }) => {
  return (
    <ActionType>
      <strong>log</strong> {action.label}
    </ActionType>
  );
};

export const CancelActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<CancelAction<any, any>>;
}> = ({ action }) => {
  return (
    <ActionType>
      <strong>cancel</strong> {action.sendId}
    </ActionType>
  );
};

export const StopActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<StopAction<unknown, EventObject>>;
}> = ({ action }) => {
  return (
    <ActionType>
      <strong>stop</strong>{' '}
      {typeof action.activity === 'object' && 'id' in action.activity ? (
        action.activity.id
      ) : (
        <em>expr</em>
      )}
    </ActionType>
  );
};

export const AssignActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<AssignAction<unknown, EventObject>>;
}> = ({ action }) => {
  return (
    <ActionType>
      <strong>assign</strong>{' '}
      {typeof action.assignment === 'object' ? (
        Object.keys(action.assignment).join(', ')
      ) : (
        <em>{action.assignment?.name || 'expr'}</em>
      )}
    </ActionType>
  );
};

export const ChooseActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<ChooseAction<unknown, EventObject>>;
}> = () => {
  return (
    <ActionType>
      <strong>choose</strong>
      {/* TODO: recursively add actions/guards */}
    </ActionType>
  );
};

export const CustomActionLabel: React.FC<{
  action: PotentiallyStructurallyCloned<ActionObject<any, any>>;
}> = ({ action }) => {
  const label = getActionLabel(action as any);

  if (label === null) {
    return null;
  }

  return (
    <ActionType>{label === 'anonymous' ? <em>anonymous</em> : <strong>{label}</strong>}</ActionType>
  );
};

export const ActionViz: React.FC<{
  action: ActionObject<any, any>;
  kind: 'entry' | 'exit' | 'do';
}> = ({ action, kind }) => {
  if (isDelayedTransitionAction(action)) {
    // Don't show implicit actions for delayed transitions
    return null;
  }

  const actionType = {
    [ActionTypes.Assign]: <AssignActionLabel action={action as AssignAction<any, any>} />,
    [ActionTypes.Raise]: <RaiseActionLabel action={action as RaiseAction<any, any>} />,
    [ActionTypes.Send]: <SendActionLabel action={action as SendActionObject<any, any>} />,
    [ActionTypes.Log]: <LogActionLabel action={action as LogAction<any, any>} />,
    [ActionTypes.Cancel]: <CancelActionLabel action={action as CancelAction<any, any>} />,
    [ActionTypes.Stop]: <StopActionLabel action={action as StopAction<any, any>} />,
    [ActionTypes.Choose]: <ChooseActionLabel action={action as ChooseAction<any, any>} />,
  }[action.type] ?? <CustomActionLabel action={action} />;

  return (
    <div data-viz="action" data-viz-action={kind}>
      {actionType}
    </div>
  );
};
