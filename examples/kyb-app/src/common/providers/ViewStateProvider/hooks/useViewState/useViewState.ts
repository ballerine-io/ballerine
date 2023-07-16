import { stateContext } from '@app/common/providers/ViewStateProvider/state.context';
import {
  SchemaBase,
  SchemaStates,
  ViewStateContext,
} from '@app/common/providers/ViewStateProvider/types';
import { AnyObject } from '@ballerine/ui';
import { useContext } from 'react';

export function useViewState<
  TSchema extends SchemaBase,
  TContext = AnyObject,
  TViewContext = AnyObject,
>() {
  return useContext(stateContext) as ViewStateContext<
    TContext,
    TViewContext,
    SchemaStates<TSchema>
  >;
}
