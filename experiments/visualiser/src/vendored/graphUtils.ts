import {
  DigraphBackLinkMap,
  DirectedGraphEdge,
  DirectedGraphNode,
  getBackLinkMap,
} from './directedGraph';
import type { ELK, ElkEdgeSection, ElkExtendedEdge, ElkNode } from 'elkjs/lib/main';
import { Point } from './pathUtils';
import { StateNode } from 'xstate';

declare global {
  export const ELK: typeof import('elkjs/lib/main').default;
}

let elk: ELK;

if (typeof ELK !== 'undefined') {
  elk = new ELK();
}

type RelativeNodeEdgeMap = [
  Map<StateNode | undefined, DirectedGraphEdge[]>,
  Map<string, StateNode | undefined>,
];

export function getAllEdges(digraph: DirectedGraphNode): DirectedGraphEdge[] {
  const edges: DirectedGraphEdge[] = [];
  const getEdgesRecursive = (dnode: DirectedGraphNode) => {
    edges.push(...dnode.edges);

    dnode.children.forEach(getEdgesRecursive);
  };
  getEdgesRecursive(digraph);

  return edges;
}

/**
 * Returns the node that contains the `source` and `target` of the edges, which may be
 * the `source` or `target` itself.
 *
 * See https://www.eclipse.org/elk/documentation/tooldevelopers/graphdatastructure/coordinatesystem.html
 *
 * @param edge
 * @returns containing node
 */
function getContainingNode(edge: DirectedGraphEdge): StateNode | undefined {
  const { source: sourceNode, target: targetNode } = edge;
  if (sourceNode === targetNode) {
    return sourceNode.parent;
  }

  const set = new Set([sourceNode]);

  let marker = sourceNode.parent;

  while (marker) {
    set.add(marker);
    marker = marker.parent;
  }

  marker = targetNode;

  while (marker) {
    if (set.has(marker)) {
      return marker;
    }
    marker = marker.parent;
  }

  return sourceNode.machine; // root
}

function getRelativeNodeEdgeMap(digraph: DirectedGraphNode): RelativeNodeEdgeMap {
  const edges = getAllEdges(digraph);

  const map: RelativeNodeEdgeMap[0] = new Map();
  const edgeMap: RelativeNodeEdgeMap[1] = new Map();

  edges.forEach(edge => {
    const containingNode = getContainingNode(edge);

    if (!map.has(containingNode)) {
      map.set(containingNode, []);
    }

    map.get(containingNode)!.push(edge);
    edgeMap.set(edge.id, containingNode);
  });

  return [map, edgeMap];
}

function getElkEdge(edge: DirectedGraphEdge, rectMap: DOMRectMap): ElkExtendedEdge & { edge: any } {
  const edgeRect = rectMap.get(edge.id)!;
  const targetPortId = getPortId(edge);
  const isSelfEdge = edge.source === edge.target;
  const isInitialEdge = edge.source.parent?.initial === edge.source.key;

  const sources = [edge.source.id];
  const targets = isSelfEdge ? [getSelfPortId(edge.target.id)] : [targetPortId];

  return {
    id: edge.id,
    sources,
    targets,

    labels: [
      {
        id: 'label:' + edge.id,
        width: edgeRect.width,
        height: edgeRect.height,
        text: edge.label.text || 'always',
        layoutOptions: {
          'edgeLabels.inline': !isSelfEdge ? 'true' : 'false',
          'edgeLabels.placement': 'CENTER',
          'edgeLabels.centerLabelPlacementStrategy': 'TAIL_LAYER',
        },
      },
    ],
    edge,
    sections: [],
    layoutOptions: {
      // Ensure that all edges originating from initial states point RIGHT
      // (give them direction priority) so that the initial states can end up on the top left
      'elk.layered.priority.direction': isInitialEdge ? '1' : '0',
    },
  };
}

function getPortId(edge: DirectedGraphEdge): string {
  return `port:${edge.id}`;
}

function getSelfPortId(nodeId: string): string {
  return `self:${nodeId}`;
}

function getElkId(id: string): string {
  return (id as any).replaceAll('.', '_').replaceAll(':', '__');
}

type DOMRectMap = Map<string, DOMRect>;

const getRectMap = (machineId: string): Promise<DOMRectMap> => {
  return new Promise(res => {
    const rectMap: DOMRectMap = new Map();

    // TODO: use MutationObserver
    const i = setInterval(() => {
      if (!document.querySelector(`[data-viz="machine"]`)) {
        return;
      }

      document.querySelectorAll('[data-rect-id]').forEach(el => {
        const rectId = (el as HTMLElement).dataset.rectId!;
        const rect = el.getBoundingClientRect();
        rectMap.set(rectId, rect);
      });

      clearInterval(i);
      res(rectMap);
    }, 100);
  });
};

function getDeepestNodeLevel(node: DirectedGraphNode): number {
  if (!node.children.length) {
    return node.level;
  }
  return Math.max(...node.children.map(childNode => getDeepestNodeLevel(childNode)));
}

interface ElkRunContext {
  // On attempt 0, try with compaction and wrapping.
  // On attempt 1, try with wrapping and no compaction.
  // On attempt 2, try with no wrapping and no compaction.
  attempt: number;
  relativeNodeEdgeMap: RelativeNodeEdgeMap;
  backLinkMap: DigraphBackLinkMap;
  rectMap: DOMRectMap;
}

function getElkChild(node: DirectedGraphNode, runContext: ElkRunContext): StateElkNode {
  const { relativeNodeEdgeMap, backLinkMap, rectMap } = runContext;
  const nodeRect = rectMap.get(node.id)!;
  const contentRect = rectMap.get(`${node.id}:content`)!;

  // Edges whose source is this node
  const edges = relativeNodeEdgeMap[0].get(node.data) || [];
  // Edges whose target is this node
  const backEdges = Array.from(backLinkMap.get(node.data) ?? []);

  const hasSelfEdges = backEdges.some(edge => edge.source === edge.target);

  // Nodes should only wrap if they have non-atomic child nodes
  const shouldWrap = runContext.attempt < 2 && getDeepestNodeLevel(node) > node.level + 1;

  // Compaction should apply if there was no previous error, since errors can occur
  // sometimes with compaction:
  // https://github.com/kieler/elkjs/issues/98
  const shouldCompact = shouldWrap && runContext.attempt === 0;

  return {
    id: node.id,
    ...(!node.children.length
      ? {
          width: nodeRect.width,
          height: nodeRect.height,
        }
      : undefined),
    node,
    children: getElkChildren(node, runContext),
    absolutePosition: { x: 0, y: 0 },
    edges: edges.map(edge => {
      return getElkEdge(edge, rectMap);
    }),
    ports: backEdges
      .map(backEdge => {
        return {
          id: getPortId(backEdge),
          width: 5, // TODO: don't hardcode, find way to reference arrow marker size
          height: 5,
          layoutOptions: {},
        };
      })
      .concat(
        hasSelfEdges
          ? [
              {
                id: getSelfPortId(node.id),
                width: 5,
                height: 5,
                layoutOptions: {},
              },
            ]
          : [],
      ),
    layoutOptions: {
      'elk.padding': `[top=${contentRect.height + 30}, left=30, right=30, bottom=30]`,
      'elk.spacing.labelLabel': '10',
      ...(shouldWrap && {
        'elk.aspectRatio': '2',
        'elk.layered.wrapping.strategy': 'MULTI_EDGE',
        ...(shouldCompact && {
          'elk.layered.compaction.postCompaction.strategy': 'LEFT',
        }),
      }),
    },
  };
}
function getElkChildren(node: DirectedGraphNode, runContext: ElkRunContext): StateElkNode[] {
  return node.children.map(childNode => {
    return getElkChild(childNode, runContext);
  });
}

export interface StateElkNode extends ElkNode {
  node: DirectedGraphNode;
  absolutePosition: Point;
  edges: StateElkEdge[];
  children: StateElkNode[];
}

export interface StateElkEdge extends ElkExtendedEdge {
  edge: DirectedGraphEdge;
}

export function isStateElkNode(node: ElkNode): node is StateElkNode {
  return 'absolutePosition' in node;
}

function elkJSON(elkNode: ElkNode): any {
  const { id, layoutOptions, width, height, children, edges, ports } = elkNode;

  return {
    id: getElkId(id),
    layoutOptions,
    width,
    height,
    children: children?.map(node => elkJSON(node as StateElkNode)),
    ports: ports?.map(port => ({
      id: getElkId(port.id),
      width: port.width,
      height: port.height,
    })),
    edges: edges?.map(_edge => {
      const edge = _edge as ElkExtendedEdge;

      return {
        id: getElkId(edge.id),
        labels: edge.labels?.map(label => ({
          id: getElkId(label.id),
          width: label.width,
          height: label.height,
          text: label.text,
          layoutOptions: label.layoutOptions,
        })),
        layoutOptions: edge.layoutOptions,
        sources: edge.sources?.map(id => getElkId(id)),
        targets: edge.targets?.map(id => getElkId(id)),
      };
    }),
  };
}

export async function getElkGraph(rootDigraphNode: DirectedGraphNode): Promise<ElkNode> {
  const rectMap = await getRectMap(rootDigraphNode.id);
  const relativeNodeEdgeMap = getRelativeNodeEdgeMap(rootDigraphNode);
  const backLinkMap = getBackLinkMap(rootDigraphNode);
  const rootEdges = relativeNodeEdgeMap[0].get(undefined) || [];
  const initialRunContext: ElkRunContext = {
    attempt: 0,
    relativeNodeEdgeMap,
    backLinkMap,
    rectMap,
  };

  // The root node is an invisible node; the machine node is a direct child of this node.
  // It is wrapped so we can have self-loops, which cannot be placed in the root node.
  const getRootElkNodeData = (runContext: ElkRunContext): ElkNode => ({
    id: 'root',
    edges: rootEdges.map(edge => getElkEdge(edge, rectMap)),
    children: [getElkChild(rootDigraphNode, runContext)],
    layoutOptions: {
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.algorithm': 'layered',
      'elk.layered.considerModelOrder': 'NODES_AND_EDGES',
      'elk.layered.wrapping.strategy': 'MULTI_EDGE',
      'elk.aspectRatio': '2',
      'elk.direction': 'RIGHT',
    },
  });

  let rootElkNode: ElkNode | undefined = undefined;

  // Make multiple attempts to layout ELK node.
  // Depending on the error, certain heuristics may be applied to mitigate the error on the next attempt.
  // These heuristics read the `initialRunContext.previousError` to determine what layout options to change.
  while (initialRunContext.attempt <= 2 && !rootElkNode) {
    try {
      rootElkNode = await elk.layout(getRootElkNodeData(initialRunContext));
    } catch (err) {
      console.error(err);
      initialRunContext.attempt += 1;
    }
  }

  if (!rootElkNode) {
    throw new Error('Unable to layout ELK node.');
  }

  const stateNodeToElkNodeMap = new Map<StateNode, StateElkNode>();

  const setEdgeLayout = (edge: StateElkEdge) => {
    const containingNode = relativeNodeEdgeMap[1].get(edge.id);
    const elkContainingNode = containingNode && stateNodeToElkNodeMap.get(containingNode)!;

    const translatedSections: ElkEdgeSection[] = elkContainingNode
      ? edge.sections.map(section => {
          return {
            ...section,
            startPoint: {
              x: section.startPoint.x + elkContainingNode.absolutePosition.x,
              y: section.startPoint.y + elkContainingNode.absolutePosition.y,
            },
            endPoint: {
              x: section.endPoint.x + elkContainingNode.absolutePosition.x,
              y: section.endPoint.y + elkContainingNode.absolutePosition.y,
            },
            bendPoints:
              section.bendPoints?.map(bendPoint => {
                return {
                  x: bendPoint.x + elkContainingNode.absolutePosition.x,
                  y: bendPoint.y + elkContainingNode.absolutePosition.y,
                };
              }) ?? [],
          };
        })
      : edge.sections;

    edge.edge.sections = translatedSections;
    edge.edge.label.x = (edge.labels?.[0].x || 0) + (elkContainingNode?.absolutePosition.x || 0);
    edge.edge.label.y = (edge.labels?.[0].y || 0) + (elkContainingNode?.absolutePosition.y || 0);
  };

  const setLayout = (elkNode: StateElkNode, parent: StateElkNode | undefined) => {
    stateNodeToElkNodeMap.set(elkNode.node.data, elkNode);
    elkNode.absolutePosition = {
      x: (parent?.absolutePosition.x ?? 0) + elkNode.x!,
      y: (parent?.absolutePosition.y ?? 0) + elkNode.y!,
    };

    elkNode.node.layout = {
      width: elkNode.width!,
      height: elkNode.height!,
      x: elkNode.x!,
      y: elkNode.y!,
    };

    elkNode.edges?.forEach(edge => {
      setEdgeLayout(edge);
    });

    elkNode.children?.forEach(cn => {
      if (isStateElkNode(cn)) {
        setLayout(cn, elkNode);
      }
    });
  };

  (rootElkNode.edges as StateElkEdge[])?.forEach(setEdgeLayout);

  // Uncomment this for graph debugging:
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log(JSON.stringify(elkJSON(rootElkNode as StateElkNode), null, 2));
  // }

  // unwrap from the "fake" ancestor node created in the `elkNode` structure
  const machineElkNode = rootElkNode.children![0] as StateElkNode;

  setLayout(machineElkNode, undefined);

  return rootElkNode;
}
