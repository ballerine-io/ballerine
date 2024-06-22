import { conditionHelpers } from './condition/constants';

export { logger } from './logger';

export { setLogger } from './logger';

export interface IRuleEngine<T> {
  run: (data: object) => T | null;
}
