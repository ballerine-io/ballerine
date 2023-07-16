import { SchemaBase, SchemaStates } from '@app/common/providers/ViewStateProvider/types';

export type Views<TSchema extends SchemaBase> = Record<
  SchemaStates<TSchema>,
  React.ComponentType<unknown>
>;
