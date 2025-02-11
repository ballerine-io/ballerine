import { TDeepthLevelStack } from '../../types';

import { IValidationError } from '../../types';
import { formatId } from '../format-id';

export const createValidationError = ({
  id,
  invalidValue,
  message,
  stack,
}: {
  id: string;
  invalidValue: unknown;
  message: string;
  stack: TDeepthLevelStack;
}): IValidationError => {
  const formattedId = formatId(id, stack);

  const error: IValidationError = {
    id: formattedId,
    originId: id,
    invalidValue,
    message: [message],
  };

  return error;
};
