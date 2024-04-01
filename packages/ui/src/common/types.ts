import { ReactNode } from 'react';

export type ChildrenList = ReactNode[];
export type AnyChildren = ReactNode | ChildrenList;
export type AnyObject = Record<PropertyKey, any>;
export type WithTestId<TParams> = { testId?: string } & TParams;
