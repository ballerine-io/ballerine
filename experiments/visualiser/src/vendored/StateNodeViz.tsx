import { Link } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { StateNode } from 'xstate';
import { ActionViz } from './ActionViz';
import { DirectedGraphNode } from './directedGraph';
import { InvokeViz } from './EventTypeViz';
import { useSimulation } from './SimulationContext';

interface BaseStateNodeDef {
  key: string;
  id: string;
}

interface AtomicStateNodeDef extends BaseStateNodeDef {
  type: 'atomic';
}
interface CompoundStateNodeDef extends BaseStateNodeDef {
  type: 'compound';
  initial: string;
  states?: {
    [key: string]: StateNodeDef;
  };
}
interface ParallelStateNodeDef extends BaseStateNodeDef {
  type: 'parallel';
  states?: {
    [key: string]: StateNodeDef;
  };
}
interface FinalStateNodeDef extends BaseStateNodeDef {
  type: 'final';
}
interface HistoryStateNodeDef extends BaseStateNodeDef {
  type: 'history';
}

type StateNodeDef =
  | AtomicStateNodeDef
  | CompoundStateNodeDef
  | ParallelStateNodeDef
  | FinalStateNodeDef
  | HistoryStateNodeDef;

const StateNodeKey: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div data-viz="stateNode-key">
      <div data-viz="stateNode-keyText" title={value}>
        {value}
      </div>
    </div>
  );
};

export const StateNodeViz: React.FC<{
  node: DirectedGraphNode;
  stateNode: StateNode;
}> = ({ stateNode, node }) => {
  const service = useSimulation();
  const [state] = useActor(service);

  const serviceData = state.context.serviceDataMap[state.context.currentSessionId!];
  const simState = serviceData?.state;
  const simMachine = serviceData?.machine;

  const previewState = useMemo(() => {
    if (!state.context.previewEvent) {
      return undefined;
    }
    // Catch exceptions thrown by invalid actions or guards on the transition event
    try {
      return simMachine?.transition(simState, state.context.previewEvent);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, [state, simState, simMachine]);

  if (!simState) {
    return null;
  }

  const description = stateNode.description || stateNode.meta?.description;

  return (
    <div
      data-viz="stateNodeGroup"
      data-viz-active={
        !!simState.configuration.find((n: any) => n.id === stateNode.id) || undefined
      }
      data-viz-previewed={
        previewState?.configuration.find((n: any) => n.id === stateNode.id) || undefined
      }
      style={{
        // outline: '1px solid blue',
        position: 'absolute',
        // height: `${layout.height!}px`,
        // width: `${layout.width!}px`,
        ...(node.layout && {
          left: `${node.layout.x}px`,
          top: `${node.layout.y}px`,
        }),
      }}
    >
      <div
        data-viz="stateNode"
        data-viz-type={stateNode.type}
        data-viz-history={stateNode.history ?? undefined}
        data-viz-parent-type={stateNode.parent?.type}
        data-viz-atomic={['atomic', 'final'].includes(stateNode.type) || undefined}
        data-rect-id={stateNode.id}
        style={{
          // position: 'absolute',
          ...(node.layout && {
            width: `${node.layout.width}px`,
            height: `${node.layout.height}px`,
          }),
        }}
      >
        <div data-viz="stateNode-content" data-rect-id={`${stateNode.id}:content`}>
          <div data-viz="stateNode-header">
            {['history', 'final'].includes(stateNode.type) && (
              <div
                data-viz="stateNode-type"
                data-viz-type={stateNode.type}
                data-viz-history={stateNode.history ?? undefined}
              ></div>
            )}
            <StateNodeKey value={stateNode.key} />
            {stateNode.tags.length > 0 && (
              <div data-viz="stateNode-tags">
                {stateNode.tags.map((tag, i) => {
                  return (
                    <div data-viz="stateNode-tag" key={i}>
                      {tag}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {stateNode.definition.invoke.length > 0 && (
            <div data-viz="stateNode-invocations">
              {stateNode.definition.invoke.map(invokeDef => {
                return <InvokeViz invoke={invokeDef} key={invokeDef.id} />;
              })}
            </div>
          )}
          {stateNode.definition.entry.length > 0 && (
            <div data-viz="stateNode-actions" data-viz-actions="entry">
              {stateNode.definition.entry.map((action, index) => {
                return <ActionViz key={index} action={action} kind="entry" />;
              })}
            </div>
          )}
          {stateNode.definition.exit.length > 0 && (
            <div data-viz="stateNode-actions" data-viz-actions="exit">
              {stateNode.definition.exit.map((action, index) => {
                return <ActionViz key={index} action={action} kind="exit" />;
              })}
            </div>
          )}
          {description && (
            <div data-viz="stateNode-meta">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => <Link {...props} />,
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {'states' in stateNode && (
          <div data-viz="stateNode-states">
            {node.children.map(childNode => {
              return (
                <StateNodeViz key={childNode.id} stateNode={childNode.data} node={childNode} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
