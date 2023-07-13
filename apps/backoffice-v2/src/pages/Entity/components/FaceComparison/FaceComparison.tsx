import React, { FunctionComponent } from 'react';
import { Case } from '../Case/Case';
import { ExtractCellProps } from '@ballerine/blocks';

export const FaceComparison: FunctionComponent<ExtractCellProps<'faceComparison'>> = ({
  value,
}) => (
  <div className={`m-2 rounded p-1`}>
    <h4 className={`mb-2 text-lg`}>Face Comparison</h4>
    <Case.FaceMatch faceAUrl={value.faceAUrl} faceBUrl={value.faceBUrl} />
  </div>
);
