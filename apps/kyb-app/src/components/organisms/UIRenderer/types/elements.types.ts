import { CellOptions } from '@app/components/organisms/UIRenderer/elements/Cell';
import { TaskOptions } from '@app/components/organisms/UIRenderer/elements/Task';
import { AnyChildren } from '@ballerine/ui';
import React from 'react';

export type BaseElementComponentProps<TOptions> = { children: AnyChildren; options: TOptions };

export type ElementComponent<TOptions> = React.ComponentType<TOptions>;

export interface BaseElements {
  task: ElementComponent<TaskOptions>;
  cell: ElementComponent<CellOptions>;
}

export type BaseElementsType = keyof BaseElements;

export type ElementsMap = Record<string, ElementComponent<any>>;
