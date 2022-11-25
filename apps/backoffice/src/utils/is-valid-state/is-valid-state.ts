import { EState } from '../../mock-service-worker/users/enums';

export const isValidState = (value: string): value is EState => {
  return Object.values(EState).includes(value as EState);
};
