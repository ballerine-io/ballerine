import { Action } from '@app/domains/collection-flow';

export abstract class ActionHandler {
  public readonly ACTION_TYPE: string;

  abstract run<TContext>(context: TContext, action: Action): Promise<TContext>;
}
