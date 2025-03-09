import { TDeepthLevelStack } from './types';

export const formatValueDestination = (valueDestination: string, stack: TDeepthLevelStack) => {
  let _valueDestination = valueDestination;

  stack?.forEach((stack, index) => {
    _valueDestination = _valueDestination?.replace(`$${index}`, stack.toString());
  });

  return _valueDestination;
};
