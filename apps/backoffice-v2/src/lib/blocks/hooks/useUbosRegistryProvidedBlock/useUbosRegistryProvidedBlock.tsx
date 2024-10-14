import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React, { useCallback, useMemo } from 'react';
import { WarningFilledSvg } from '@ballerine/ui';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { buildTree } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/build-tree';
import { CustomNode } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/CustomNode';

const nodeTypes = {
  customNode: CustomNode,
};

export const useUbosRegistryProvidedBlock = ({
  nodes,
  edges,
  message,
  isRequestTimedOut,
}: {
  nodes: Array<{
    id: string;
    data: {
      name: string;
      type: string;
      sharePercentage?: number;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data: {
      sharePercentage?: number;
    };
  }>;
  message: string | undefined;
  isRequestTimedOut: boolean | undefined;
}) => {
  const { nodes: uiNodes, edges: uiEdges } = buildTree({
    nodes,
    edges,
  });

  const getCell = useCallback(() => {
    if (Array.isArray(uiNodes) && uiNodes?.length && Array.isArray(uiEdges) && uiEdges?.length) {
      // TODO create a graph cell
      return {
        type: 'node',
        value: (
          <div className="min-h-[27rem] p-4">
            <div className={'d-full rounded-sm border border-slate-200'}>
              <ReactFlow
                nodeTypes={nodeTypes}
                nodes={uiNodes}
                edges={uiEdges}
                defaultViewport={{
                  x: 500,
                  y: 50,
                  zoom: 0.8,
                }}
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </div>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'node';
        }
      >;
    }

    if (message) {
      return {
        type: 'paragraph',
        value: (
          <span className="flex text-sm text-black/60">
            <WarningFilledSvg
              className={'me-2 mt-px text-black/20 [&>:not(:first-child)]:stroke-background'}
              width={'20'}
              height={'20'}
            />
            <span>{message}</span>
          </span>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'paragraph';
        }
      >;
    }

    if (isRequestTimedOut) {
      return {
        type: 'paragraph',
        value: (
          <span className="flex text-sm text-black/60">
            <WarningFilledSvg
              className={'me-2 mt-px text-black/20 [&>:not(:first-child)]:stroke-background'}
              width={'20'}
              height={'20'}
            />
            <span>
              The request timed out either because the company was not found in the registry, or the
              information is currently unavailable.
            </span>
          </span>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'paragraph';
        }
      >;
    }
  }, [message, isRequestTimedOut, uiNodes, uiEdges]);

  return useMemo(() => {
    const cell = getCell();

    if (!cell) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'heading',
            value: 'UBOs',
          })
          .addCell({
            type: 'subheading',
            value: 'Registry-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell(cell)
          .build()
          .flat(1),
      })
      .build();
  }, [getCell]);
};
