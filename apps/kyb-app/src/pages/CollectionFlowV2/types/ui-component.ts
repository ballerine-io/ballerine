import { UIElementV2 } from '@/components/providers/Validator/types';
import React from 'react';

export interface IUIComponentProps<TOptions = {}> {
  definition: UIElementV2;
  options: TOptions;
  stack?: number[];
  children?: React.ReactNode | React.ReactNode[];
  uiElementProps: {
    onClick: () => void;
  };
}
