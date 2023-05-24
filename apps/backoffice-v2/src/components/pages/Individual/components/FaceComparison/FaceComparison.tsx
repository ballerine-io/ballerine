import React, { FunctionComponent } from 'react';
import { Subject } from 'components/organisms/Subject/Subject';
import { IFaceComparisonProps } from 'components/pages/Individual/components/FaceComparison/interfaces';

export const FaceComparison: FunctionComponent<IFaceComparisonProps> = ({ value }) => (
  <div className={`m-2 rounded p-1`}>
    <h4 className={`mb-2 text-lg`}>Face Comparison</h4>
    <Subject.FaceMatch faceAUrl={value.faceAUrl} faceBUrl={value.faceBUrl} />
  </div>
);
