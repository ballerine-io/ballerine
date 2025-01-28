import { TDeepthLevelStack } from '../../types';

export const formatId = (id: string, stack: TDeepthLevelStack) => {
  const _id = `${id}${stack?.length ? `-${stack.join('-')}` : ''}`;

  return _id;
};
