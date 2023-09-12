import { Action } from '@app/components/organisms/DynamicUIRenderer/temp';

export abstract class ActionHandler {
  public readonly ACTION_TYPE: string;

  abstract run<TContext>(context: TContext, action: Action): Promise<TContext>;
}
