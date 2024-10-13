import React, { FunctionComponent } from 'react';
import { Card, CardContent } from '@ballerine/ui';
import { Handle, NodeProps, Position } from '@xyflow/react';

export const CustomNode: FunctionComponent<NodeProps> = ({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}) => {
  return (
    <div
      className={'relative flex flex-col items-center space-y-4'}
      style={{ left: positionAbsoluteX, top: positionAbsoluteY }}
    >
      <div className={'relative'}>
        <Handle type="source" position={Position.Top} />
        <Card className={'w-48'}>
          <CardContent className={'p-4 text-center'}>
            {data.label}
            {data.sharePercentage && (
              <div className={'text-sm font-bold'}>{data.sharePercentage}</div>
            )}
          </CardContent>
        </Card>
        <Handle type="target" position={Position.Bottom} />
      </div>
    </div>
  );
};
