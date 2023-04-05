import { useSelector } from '@xstate/react';
import React, { useMemo } from 'react';
import type { AnyStateNodeDefinition, Guard } from 'xstate';
import { DirectedGraphEdge } from './directedGraph';
import { EventTypeViz, toDelayString } from './EventTypeViz';
import { Point } from './pathUtils';
import { useSimulation } from './SimulationContext';
import { AnyStateMachine, StateFrom } from './types';
import { toSCXMLEvent } from 'xstate/lib/utils';
import { simulationMachine } from './simulationMachine';
import { ActionViz } from './ActionViz';
import { DelayViz } from './DelayViz';

const getGuardType = (guard: Guard<any, any>) => {
  return guard.name; // v4
};

export type DelayedTransitionMetadata =
  | { delayType: 'DELAYED_INVALID' }
  | { delayType: 'DELAYED_VALID'; delay: number; delayString: string };

const getDelayFromEventType = (
  eventType: string,
  delayOptions: AnyStateMachine['options']['delays'],
  context: AnyStateNodeDefinition['context'],
  event: any,
): DelayedTransitionMetadata | undefined => {
  try {
    const isDelayedEvent = eventType.startsWith('xstate.after');

    if (!isDelayedEvent) return undefined;

    const DELAYED_EVENT_REGEXT = /^xstate\.after\((.*)\)#.*$/;
    // Validate the delay duration
    const match = eventType.match(DELAYED_EVENT_REGEXT);

    if (!match) return { delayType: 'DELAYED_INVALID' };

    let [, delay] = match;

    // normal number or stringified number delays
    let finalDelay = +delay;

    // if configurable delay, get it from the machine options
    if (Number.isNaN(finalDelay)) {
      const delayExpr = delayOptions![delay];
      // if configured delay is a fixed number value
      if (typeof delayExpr === 'number') {
        finalDelay = delayExpr;
      } else {
        // if configured delay is getter function
        // @ts-expect-error
        finalDelay = delayExpr(context, event);
      }
    }

    return {
      delayType: 'DELAYED_VALID',
      delay: finalDelay,
      delayString: toDelayString(delay),
    };
  } catch (err) {
    console.log(err);
    return;
  }
};

const delayOptionsSelector = (state: StateFrom<typeof simulationMachine>) =>
  state.context.serviceDataMap[state.context.currentSessionId!]?.machine.options?.delays;

export const TransitionViz: React.FC<{
  edge: DirectedGraphEdge;
  position?: Point;
  index: number;
}> = ({ edge, index, position }) => {
  const definition = edge.transition;
  const service = useSimulation();
  const state = useSelector(
    service,
    s => s.context.serviceDataMap[s.context.currentSessionId!]?.state,
  );
  const delayOptions = useSelector(service, delayOptionsSelector);
  const delay = useMemo(
    () =>
      delayOptions
        ? getDelayFromEventType(definition.eventType, delayOptions, state?.context, state?.event)
        : undefined,
    [definition.eventType, delayOptions, state],
  );

  if (!state) {
    return null;
  }

  const isDisabled =
    delay?.delayType === 'DELAYED_INVALID' || !state.nextEvents.includes(definition.eventType);
  const isPotential =
    state.nextEvents.includes(edge.transition.eventType) &&
    !!state.configuration.find((sn: any) => sn === edge.source);

  return (
    <button
      data-viz="transition"
      data-viz-potential={isPotential || undefined}
      data-viz-disabled={isDisabled || undefined}
      data-is-delayed={delay ?? undefined}
      data-rect-id={edge.id}
      style={{
        position: 'absolute',
        ...(position && { left: `${position.x}px`, top: `${position.y}px` }),
        // @ts-ignore
        '--delay': delay?.delayType === 'DELAYED_VALID' && delay.delay,
      }}
      disabled={isDisabled}
      onMouseEnter={() => {
        service.send({
          type: 'EVENT.PREVIEW',
          eventType: definition.eventType,
        });
      }}
      onMouseLeave={() => {
        service.send({
          type: 'PREVIEW.CLEAR',
        });
      }}
      onClick={() => {
        // TODO: only if no parameters/schema
        service.send({
          type: 'SERVICE.SEND',
          event: toSCXMLEvent(
            {
              type: definition.eventType,
            },
            { origin: state._sessionid as string },
          ),
        });
      }}
    >
      <div data-viz="transition-label">
        <span data-viz="transition-event">
          <EventTypeViz eventType={definition.eventType} delay={delay} />
          {delay && delay.delayType === 'DELAYED_VALID' && (
            <DelayViz active={isPotential} duration={delay.delay} />
          )}
        </span>
        {definition.cond && (
          <span data-viz="transition-guard">{getGuardType(definition.cond)}</span>
        )}
      </div>
      <div data-viz="transition-content">
        {definition.actions.length > 0 && (
          <div data-viz="transition-actions">
            {definition.actions.map((action, index) => {
              return <ActionViz key={index} action={action} kind="do" />;
            })}
          </div>
        )}
      </div>
      {definition.description && (
        <div data-viz="transition-description">
          <p>{definition.description}</p>
        </div>
      )}
    </button>
  );
};
