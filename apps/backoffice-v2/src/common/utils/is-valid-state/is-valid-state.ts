import { State } from '../../enums';
import { TState } from '../../types';

export const isValidState = (value: string): value is TState => {
  return Object.values(State).includes(value as TState);
};
