import React, { FunctionComponent } from 'react';
import { IFaceComparisonProps } from './interfaces';
import { Case } from '@/pages/Entity/components/Case/Case';

export const FaceComparison: FunctionComponent<IFaceComparisonProps> = ({ value }) => (
  <div className={`m-2 rounded p-1`}>
    <h4 className={`mb-2 text-lg`}>Face Comparison</h4>
    <Case.FaceMatch faceAUrl={value.faceAUrl} faceBUrl={value.faceBUrl} />
  </div>
);
