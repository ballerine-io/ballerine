import { WorkflowLog } from '@/domains/workflows/api/workflow-logs';
import { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  ReactFlowProvider,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface WorkflowLogGraphProps {
  logs: WorkflowLog[];
}

// Custom node types
const CustomStateNode = ({ data }: { data: any }) => (
  <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 shadow-sm">
    <div className="text-sm font-medium">{data.label}</div>
    <Handle type="target" position={Position.Top} style={{ background: '#e09f3e' }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#e09f3e' }} />
  </div>
);

const CustomEventNode = ({ data }: { data: any }) => (
  <div className="rounded-md border border-green-300 bg-green-50 px-3 py-1 shadow-sm">
    <div className="text-xs">{data.label}</div>
    <Handle type="target" position={Position.Top} style={{ background: '#90be6d' }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#90be6d' }} />
  </div>
);

const CustomPluginNode = ({ data }: { data: any }) => (
  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1 shadow-sm">
    <div className="text-xs">{data.label}</div>
    <Handle type="target" position={Position.Top} style={{ background: '#6c757d' }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#6c757d' }} />
  </div>
);

// Function to generate a unique node ID
const getNodeId = (type: string, id: string | number) => `${type}-${id}`;

// Constants for layout
const STATE_NODE_WIDTH = 180;
const EVENT_NODE_WIDTH = 120;
const PLUGIN_NODE_WIDTH = 120;
const VERTICAL_SPACING = 150;
const HORIZONTAL_SPACING = 350;

// Helper function to find the event that triggered a state transition
const findTriggeringEvent = (
  logs: WorkflowLog[],
  stateTransitionId: number,
): WorkflowLog | null => {
  // Look for the most recent event before this state transition
  const eventLogs = logs.filter(log => log.type === 'EVENT_RECEIVED' && log.id < stateTransitionId);

  if (eventLogs.length === 0) return null;

  // Return the most recent event (highest ID lower than stateTransitionId)
  return eventLogs.reduce((latest, current) => (current.id > latest.id ? current : latest));
};

export const WorkflowLogGraph = ({ logs }: WorkflowLogGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Process logs to create nodes and edges for visualization
  useEffect(() => {
    if (!logs.length) return;

    // Sort logs by ID (which should be sequential)
    const sortedLogs = [...logs].sort((a, b) => a.id - b.id);

    const stateNodes: Node[] = [];
    const eventNodes: Node[] = [];
    const pluginNodes: Node[] = [];
    const transitionEdges: Edge[] = [];

    // Track state transitions
    type StateChange = {
      id: number;
      fromState: string;
      toState: string;
      node: Node;
      events: Array<{ id: number; name: string; node: Node }>;
      plugins: Array<{ id: number; name: string; node: Node }>;
    };

    const stateTransitions: StateChange[] = [];

    // Map of state names to their nodes
    const stateMap = new Map<string, Node>();

    // Create the initial "idle" state as the root
    const rootNode: Node = {
      id: 'state-idle',
      type: 'stateNode',
      data: { label: 'State: idle' },
      position: { x: 0, y: 0 }, // Will be positioned later
      draggable: false,
    };

    stateNodes.push(rootNode);
    stateMap.set('idle', rootNode);

    // Add initial state transition (virtual) to hold initial events
    const initialTransition: StateChange = {
      id: 0,
      fromState: 'idle',
      toState: 'idle',
      node: rootNode,
      events: [],
      plugins: [],
    };

    stateTransitions.push(initialTransition);

    // First pass: identify state transitions and collect related events/plugins
    let currentState = 'idle';
    let currentStateTransition = initialTransition;

    sortedLogs.forEach(log => {
      // Handle state transitions
      if (log.type === 'STATE_TRANSITION' && log.fromState && log.toState) {
        // Create target state if it doesn't exist
        if (!stateMap.has(log.toState)) {
          const stateNode: Node = {
            id: getNodeId('state', log.toState),
            type: 'stateNode',
            data: { label: `State: ${log.toState}` },
            position: { x: 0, y: 0 }, // Will be positioned later
            draggable: false,
          };

          stateNodes.push(stateNode);
          stateMap.set(log.toState, stateNode);
        }

        // Record this state transition
        const targetNode = stateMap.get(log.toState)!;

        const stateTransition: StateChange = {
          id: log.id,
          fromState: log.fromState,
          toState: log.toState,
          node: targetNode,
          events: [],
          plugins: [],
        };

        stateTransitions.push(stateTransition);
        currentStateTransition = stateTransition;
        currentState = log.toState;
      }
      // Handle events
      else if (log.type === 'EVENT_RECEIVED' && log.eventName) {
        const eventNode: Node = {
          id: getNodeId('event', log.id),
          type: 'eventNode',
          data: { label: `${log.eventName} (#${log.id})` },
          position: { x: 0, y: 0 }, // Will be positioned later
          draggable: false,
        };

        eventNodes.push(eventNode);

        // Safely add to current state transition
        if (currentStateTransition) {
          currentStateTransition.events.push({
            id: log.id,
            name: log.eventName,
            node: eventNode,
          });
        }
      }
      // Handle plugins
      else if (log.pluginName) {
        const pluginNode: Node = {
          id: getNodeId('plugin', log.id),
          type: 'pluginNode',
          data: { label: `${log.pluginName} (#${log.id})` },
          position: { x: 0, y: 0 }, // Will be positioned later
          draggable: false,
        };

        pluginNodes.push(pluginNode);

        // Safely add to current state transition
        if (currentStateTransition) {
          currentStateTransition.plugins.push({
            id: log.id,
            name: log.pluginName,
            node: pluginNode,
          });
        }
      }
    });

    // Sort state transitions by ID
    stateTransitions.sort((a, b) => a.id - b.id);

    // Second pass: connect events to state transitions they triggered
    stateTransitions.forEach((transition, index) => {
      if (index > 0) {
        // Skip the initial "virtual" transition
        // Find the event that triggered this transition
        const triggerEvent = findTriggeringEvent(sortedLogs, transition.id);

        // Connect from previous state to this state through the trigger event if found
        if (triggerEvent) {
          const previousTransition = stateTransitions[index - 1];
          const triggerEventNode = eventNodes.find(
            n => n.id === getNodeId('event', triggerEvent.id),
          );

          if (triggerEventNode && previousTransition) {
            // Connect from previous state to event
            transitionEdges.push({
              id: `from-state-to-event-${triggerEvent.id}`,
              source: previousTransition.node.id,
              target: triggerEventNode.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#90be6d' },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 12,
                height: 12,
                color: '#90be6d',
              },
            });

            // Connect from event to new state
            transitionEdges.push({
              id: `from-event-to-state-${transition.id}`,
              source: triggerEventNode.id,
              target: transition.node.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#e09f3e' },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 12,
                height: 12,
                color: '#e09f3e',
              },
            });
          }
        } else {
          // If no triggering event, direct connection between states
          const previousTransition = stateTransitions[index - 1];

          if (previousTransition) {
            transitionEdges.push({
              id: `state-to-state-${transition.id}`,
              source: previousTransition.node.id,
              target: transition.node.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#e09f3e' },
              label: `#${transition.id}`,
              labelStyle: { fontSize: 10 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 12,
                height: 12,
                color: '#e09f3e',
              },
            });
          }
        }
      }
    });

    // Position nodes in a vertical tree layout
    let currentY = 0;
    const centerX = 0;

    // Position state nodes vertically
    stateTransitions.forEach((transition, index) => {
      // Position state node
      transition.node.position = { x: centerX, y: currentY };

      // Position related events horizontally to the left
      transition.events.forEach((event, eventIndex) => {
        const eventX = centerX - HORIZONTAL_SPACING / 2 - eventIndex * (EVENT_NODE_WIDTH + 20);
        const eventY = currentY + VERTICAL_SPACING / 4;
        event.node.position = { x: eventX, y: eventY };

        // Connect state to event (if not already connected as a trigger)
        const alreadyConnected = transitionEdges.some(
          edge => edge.target === event.node.id && edge.source === transition.node.id,
        );

        if (!alreadyConnected) {
          transitionEdges.push({
            id: `state-to-event-${event.id}`,
            source: transition.node.id,
            target: event.node.id,
            type: 'smoothstep',
            style: { stroke: '#90be6d' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: '#90be6d',
            },
          });
        }
      });

      // Position related plugins horizontally to the right
      transition.plugins.forEach((plugin, pluginIndex) => {
        const pluginX = centerX + HORIZONTAL_SPACING / 2 + pluginIndex * (PLUGIN_NODE_WIDTH + 20);
        const pluginY = currentY + VERTICAL_SPACING / 4;
        plugin.node.position = { x: pluginX, y: pluginY };

        // Connect state to plugin
        transitionEdges.push({
          id: `state-to-plugin-${plugin.id}`,
          source: transition.node.id,
          target: plugin.node.id,
          type: 'smoothstep',
          style: { stroke: '#6c757d' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
            color: '#6c757d',
          },
        });
      });

      // Advance vertical position for next state
      currentY += VERTICAL_SPACING;
    });

    // Set nodes and edges
    setNodes([...stateNodes, ...eventNodes, ...pluginNodes]);
    setEdges(transitionEdges);
  }, [logs, setNodes, setEdges]);

  // Custom node types
  const nodeTypes = useMemo(
    () => ({
      stateNode: CustomStateNode,
      eventNode: CustomEventNode,
      pluginNode: CustomPluginNode,
    }),
    [],
  );

  // If no logs, show a message
  if (logs.length === 0) {
    return <div className="p-4 text-center text-gray-500">No logs to visualize</div>;
  }

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }} className="h-full min-h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          attributionPosition="bottom-right"
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          nodesDraggable={false}
        >
          <Controls />
          <Background color="#f0f0f0" gap={16} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowLogGraph;
