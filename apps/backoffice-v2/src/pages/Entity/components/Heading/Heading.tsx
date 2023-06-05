import React, { FunctionComponent } from 'react';
import { IHeadingProps } from './interfaces';

export const Heading: FunctionComponent<IHeadingProps> = ({ value }) => (
  <h2 className={`ml-2 mt-6 p-2 text-2xl font-bold`}>{value}</h2>
);
