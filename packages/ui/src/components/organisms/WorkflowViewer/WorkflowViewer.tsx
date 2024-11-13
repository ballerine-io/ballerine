import { FC } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import {
  CircleDot,
  ClipboardCheck,
  FileSearch,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  LucideIcon,
  Clock,
  Calendar,
  User,
  CheckSquare,
  XSquare,
  AlertCircle,
} from 'lucide-react';

// Define workflow groups configuration
interface WorkflowGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  states: string[];
  color?: {
    background: string;
    border: string;
    text: string;
  };
  hoverContent?: {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    assignee?: string;
    collectionProgress?: number;
    currentCollectionStep?: string;
    workflowStarter?: string;
    vendors?: Array<{ name: string; status: 'completed' | 'pending' | 'failed' }>;
    rejectionReason?: string;
    fields?: Array<{ label: string; value: string }>;
  };
}

const workflowGroups: WorkflowGroup[] = [
  {
    id: 'collection',
    label: 'Data Collection',
    icon: ClipboardCheck,
    states: ['collection_invite', 'collection_flow', 'update_entities'],
    hoverContent: {
      title: 'Data Collection',
      description: 'Collection and verification of required documents and information',
      startDate: '2024-01-15T10:30:00Z',
      collectionProgress: 65,
      currentCollectionStep: 'Proof of Address Upload',
      fields: [
        { label: 'Required Documents', value: 'ID, Proof of Address' },
        { label: 'SLA', value: '24 hours' },
      ],
    },
  },
  {
    id: 'review',
    label: 'Manual Review',
    icon: UserCheck,
    states: ['manual_review', 'pending_resubmission', 'revision', 'pending_kyc_response_to_finish'],
    hoverContent: {
      title: 'Manual Review',
      description: 'Case under review by compliance team',
      startDate: '2024-01-16T14:20:00Z',
      assignee: 'Sarah Johnson',
      fields: [
        { label: 'Priority', value: 'High' },
        { label: 'Expected completion', value: '4 hours' },
      ],
    },
  },
  {
    id: 'enrichment',
    label: 'Data Enrichment',
    icon: FileSearch,
    states: ['run_merchant_monitoring', 'run_ubos', 'run_vendor_data'],
    hoverContent: {
      title: 'Data Enrichment',
      description: 'External data verification and risk assessment',
      startDate: '2024-01-15T12:00:00Z',
      vendors: [
        { name: 'Business Registry', status: 'completed' },
        { name: 'AML Screening', status: 'pending' },
        { name: 'Credit Score', status: 'failed' },
      ],
    },
  },
  {
    id: 'approved',
    label: 'Approved',
    icon: CheckCircle2,
    states: ['approved'],
    color: {
      background: '#f0fdf4',
      border: '#22c55e',
      text: '#15803d',
    },
    hoverContent: {
      title: 'Approved',
      description: 'All verifications passed successfully',
      startDate: '2024-01-15T10:30:00Z',
      endDate: '2024-01-17T15:45:00Z',
      fields: [
        { label: 'Risk Score', value: 'Low' },
        { label: 'Processing Time', value: '2d 5h 15m' },
      ],
    },
  },
  {
    id: 'rejected',
    label: 'Rejected',
    icon: XCircle,
    states: ['rejected', 'failed', 'error'],
    color: {
      background: '#fef2f2',
      border: '#ef4444',
      text: '#b91c1c',
    },
    hoverContent: {
      title: 'Rejected',
      description: 'Application rejected due to compliance issues',
      startDate: '2024-01-15T10:30:00Z',
      endDate: '2024-01-16T16:20:00Z',
      rejectionReason: 'High risk jurisdiction detected in business operations',
      fields: [
        { label: 'Rejection Category', value: 'Compliance Risk' },
        { label: 'Appeal Available', value: 'Yes' },
      ],
    },
  },
  {
    id: 'start',
    label: 'Start',
    icon: CircleDot,
    states: ['idle'],
    color: {
      background: '#f0f9ff',
      border: '#0ea5e9',
      text: '#0369a1',
    },
    hoverContent: {
      title: 'Workflow Started',
      description: 'Initial application submission',
      startDate: '2024-01-15T10:30:00Z',
      workflowStarter: 'John Smith',
      fields: [
        { label: 'Application ID', value: 'APP-2024-001' },
        { label: 'Business Name', value: 'Acme Corp' },
      ],
    },
  },
];

// Custom node component
const CustomNode: FC<NodeProps> = ({ data }) => {
  const Icon = data.icon as LucideIcon;
  const hoverContent = data.hoverContent as WorkflowGroup['hoverContent'];
  const isCurrentNode = data.isCurrent as boolean;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="group relative hover:-translate-y-1"
      style={{
        // @ts-ignore
        background: isCurrentNode ? data.background || '#fff' : '#fff',
        // @ts-ignore
        border: data.border ? data.border : `1px solid #000`,
        padding: 16,
        borderRadius: 12,
        width: 220,
        boxShadow: `${data.boxShadow}, 0 10px 30px -10px rgba(0,0,0,0.1)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
        color: isCurrentNode ? data.textColor?.toString() : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        className={`flex items-center ${
          isCurrentNode ? 'scale-105 transition-transform duration-300' : ''
        }`}
      >
        <div
          className={`rounded-lg border border-slate-200 p-2 ${
            isCurrentNode ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-slate-50'
          }`}
        >
          <Icon
            className={`h-5 w-5 ${isCurrentNode ? 'animate-pulse-' : ''}`}
            style={{ color: data.textColor?.toString() || '#475569' }}
          />
        </div>
        <div className="flex-1 text-center">
          <span className={`font-medium`}>{data.label as string}</span>
        </div>
      </div>

      {hoverContent && (
        <div
          className="absolute right-full top-0 mr-3 hidden w-80 rounded-xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-200 ease-out group-hover:block"
          style={{ zIndex: 99999 }}
        >
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">{hoverContent?.title}</h4>
              {isCurrentNode && (
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  Current
                </span>
              )}
            </div>

            {hoverContent?.description && (
              <p className="mb-4 text-sm text-slate-600">{hoverContent.description}</p>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>Started: {formatDate(hoverContent.startDate!)}</span>
              </div>

              {hoverContent.endDate && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>Ended: {formatDate(hoverContent.endDate)}</span>
                </div>
              )}

              {hoverContent.workflowStarter && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  <span>Started by: {hoverContent.workflowStarter}</span>
                </div>
              )}

              {hoverContent.assignee && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  <span>Assigned to: {hoverContent.assignee}</span>
                </div>
              )}

              {hoverContent.collectionProgress !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Current step:</span>
                    <span className="font-medium text-slate-800">
                      {hoverContent.currentCollectionStep}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${hoverContent.collectionProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {hoverContent.collectionProgress}%
                    </span>
                  </div>
                </div>
              )}

              {hoverContent.vendors && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-slate-700">Data Vendors:</h5>
                  <div className="space-y-1.5">
                    {hoverContent.vendors.map((vendor, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{vendor.name}</span>
                        {vendor.status === 'completed' && (
                          <CheckSquare className="h-4 w-4 text-green-500" />
                        )}
                        {vendor.status === 'pending' && (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )}
                        {vendor.status === 'failed' && <XSquare className="h-4 w-4 text-red-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hoverContent.rejectionReason && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-red-500" />
                    <div>
                      <h6 className="mb-1 text-sm font-medium text-red-700">Rejection Reason:</h6>
                      <p className="text-sm text-red-600">{hoverContent.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {hoverContent.fields && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  {hoverContent.fields.map((field, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-500">{field.label}:</span>
                      <span className="font-medium text-slate-800">{field.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Node types definition
const nodeTypes = {
  workflowNode: CustomNode,
};

export interface WorkflowViewerProps {
  definition: string;
  currentState: string | undefined;
}

const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 120 }); // Increased spacing

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: 180, height: 60 }); // Larger nodes
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 30,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const tagIconMap: Record<string, LucideIcon> = {
  default: CircleDot,
  collection_flow: ClipboardCheck,
  data_enrichment: FileSearch,
  manual_review: UserCheck,
  failure: AlertTriangle,
  approved: CheckCircle2,
  rejected: XCircle,
};

const getIconForTag = (tags: string[]): LucideIcon => {
  for (const tag of tags) {
    if (tag in tagIconMap) {
      const icon = tagIconMap[tag];

      if (icon) {
        return icon;
      }
    }
  }

  const defaultIcon = tagIconMap.default;

  if (!defaultIcon) {
    throw new Error('Default icon not found in tagIconMap');
  }

  return defaultIcon;
};

const isNegativeEvent = (event: string) => {
  const negativeEvents = ['FAIL', 'DECLINE', 'CANCEL'];

  return negativeEvents.some(negative => event.toUpperCase().includes(negative));
};

const isBlacklistedEvent = (event: string) => {
  const blacklistedEvents = ['pending_process'];

  return blacklistedEvents.some(blacklisted => event.toUpperCase().includes(blacklisted));
};

export interface WorkflowViewerProps {
  definition: string;
  currentState: string | undefined;
  showErrorFlows?: boolean;
}

export const WorkflowViewer: FC<WorkflowViewerProps> = ({
  definition,
  currentState,
  showErrorFlows = false,
}) => {
  const workflowDefinition = JSON.parse(definition);

  // Map states to predefined groups
  const stateGroups = workflowGroups.reduce((groups: any, group) => {
    const matchingStates = Object.entries(workflowDefinition.states)
      .filter(([id]) => group.states.includes(id))
      .map(([id, state]) => ({ id, ...(state as object) }));

    if (matchingStates.length > 0) {
      groups[group.id] = {
        ...group,
        states: matchingStates,
      };
    }

    return groups;
  }, {});

  const initialNodes = Object.entries(stateGroups).map(([groupId, group]: [string, any]) => {
    const isCurrentNodeGroup = group.states.some((s: any) => s.id === currentState);

    const background = (() => {
      if (group.color?.background) return group.color.background;

      if (isCurrentNodeGroup) return '#e0f2fe';

      if (group.states.some((s: any) => s.type === 'final')) {
        return group.states.some((s: any) => s.tags?.includes('failure')) ? '#fee2e2' : '#f1f5f9';
      }

      return '#ffffff';
    })();

    const border = (() => {
      if (group.color?.border) return `2px solid ${group.color.border}`;

      if (isCurrentNodeGroup) return '2px solid #0ea5e9';

      if (group.states.some((s: any) => s.type === 'final')) {
        return group.states.some((s: any) => s.tags?.includes('failure'))
          ? '2px solid #ef4444'
          : '2px solid #94a3b8';
      }

      return '2px solid #94a3b8';
    })();

    const boxShadow = isCurrentNodeGroup
      ? '0 0 0 2px #bae6fd, 0 0 20px rgba(14, 165, 233, 0.3)'
      : '0 2px 4px rgba(0,0,0,0.1)';

    return {
      id: groupId,
      type: 'workflowNode',
      data: {
        label: group.label,
        states: group.states.map((s: { id: any }) => s.id),
        icon: group.icon,
        hoverContent: group.hoverContent,
        background,
        border,
        boxShadow,
        textColor: group.color?.text,
        isCurrent: isCurrentNodeGroup,
        currentState,
      },
      position: { x: 0, y: 0 }, // Will be set by dagre
    };
  });

  // Find the current node group
  const currentNodeGroupStates = initialNodes.find(node =>
    node.data.states.some((s: string) => s === currentState),
  );

  // Create edges between groups based on state transitions
  const initialEdges = Object.entries(workflowDefinition.states)
    .flatMap(([sourceId, state]: [string, any]) => {
      if (!state.on) return [];

      const sourceGroup = Object.entries(stateGroups).find(([_, group]: [string, any]) =>
        group.states.some((s: any) => s.id === sourceId),
      )?.[0];

      return Object.entries(state.on).flatMap(([event, target]) => {
        if (Array.isArray(target)) {
          return target
            .map(t => {
              const targetGroup1 = Object.entries(stateGroups).find(([_, group]: [string, any]) => {
                return group.states.some((s: any) => s.id === t.target);
              })?.[0];

              if (sourceGroup === targetGroup1) return null;

              if (!showErrorFlows && isNegativeEvent(event)) return null;

              if (!showErrorFlows && isBlacklistedEvent(event)) return null;

              return {
                id: `${sourceGroup}-${targetGroup1}`,
                source: sourceGroup,
                target: targetGroup1,
                animated: currentNodeGroupStates?.id === sourceGroup,
                style: {
                  stroke: isNegativeEvent(event) ? '#ef4444' : '#64748b',
                  strokeWidth: currentNodeGroupStates?.id === sourceGroup ? 3 : 2,
                },
                labelStyle: {
                  fill: isNegativeEvent(event) ? '#ef4444' : '#475569',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '4px 8px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 4,
                },
                labelBgStyle: {
                  fill: '#f8fafc',
                  borderRadius: 4,
                },
              };
            })
            .filter(Boolean);
        }

        const targetGroup = Object.entries(stateGroups).find(([_, group]: [string, any]) =>
          group.states.some((s: any) => s.id === target),
        )?.[0];

        if (sourceGroup === targetGroup) return [];

        if (!showErrorFlows && isNegativeEvent(event)) return [];

        if (!showErrorFlows && isBlacklistedEvent(event)) return [];

        return [
          {
            id: `${sourceGroup}-${targetGroup}`,
            source: sourceGroup,
            target: targetGroup,
            animated: currentNodeGroupStates?.id === sourceGroup,
            style: {
              stroke: isNegativeEvent(event) ? '#ef4444' : '#64748b',
              strokeWidth: currentNodeGroupStates?.id === sourceGroup ? 3 : 2,
            },
            labelStyle: {
              fill: isNegativeEvent(event) ? '#ef4444' : '#475569',
              fontSize: 13,
              fontWeight: 500,
              padding: '4px 8px',
              backgroundColor: '#f8fafc',
              borderRadius: 4,
            },
            labelBgStyle: {
              fill: '#f8fafc',
              borderRadius: 4,
            },
          },
        ];
      });
    })
    .filter(Boolean);

  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

  // Find the current node group
  const currentNodeGroup = nodes.find(node =>
    node.data.states.some((s: string) => s === currentState),
  );

  return (
    <div className="h-full min-h-[500px] w-full rounded-lg border border-slate-200 bg-white shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultViewport={{
          x: currentNodeGroup ? currentNodeGroup.position.x + 150 : 0,
          y: currentNodeGroup ? currentNodeGroup.position.y - 500 : 0,
          zoom: currentNodeGroup ? 1.2 : 0.85,
        }}
        fitView={!currentNodeGroup}
        fitViewOptions={{
          padding: 0.3,
          duration: 800,
        }}
        onInit={instance => {
          if (currentNodeGroup) {
            setTimeout(() => {
              void instance.fitView({ duration: 1000, padding: 0.3 });
            }, 1000);
          }
        }}
        minZoom={0.5}
        maxZoom={1.5}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <MiniMap
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Controls
          style={{
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
          }}
          showInteractive={false}
        />
        <Background gap={20} color="#e2e8f0" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
};
