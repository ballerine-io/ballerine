import React from 'react';
import { AnyChildren } from '@common/types';
import { CellOptions } from '@components/organisms/UIRenderer/elements/Cell';
import { TaskOptions } from '@components/organisms/UIRenderer/elements/Task';

export type BaseElementComponentProps<TOptions> = { children: AnyChildren; options: TOptions };

export type ElementComponent<TOptions> = React.ComponentType<TOptions>;

export interface BaseElements {
  task: ElementComponent<TaskOptions>;
  cell: ElementComponent<CellOptions>;
}

export type BaseElementsType = keyof BaseElements;

export type ElementsMap = Record<BaseElementsType, ElementComponent<any>> &
  Record<string, ElementComponent<any>>;
