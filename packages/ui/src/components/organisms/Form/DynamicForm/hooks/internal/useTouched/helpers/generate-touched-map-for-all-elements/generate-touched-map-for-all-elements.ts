import { formatId } from '@/components/organisms/Form/Validator/utils/format-id';
import { formatValueDestination } from '@/components/organisms/Form/Validator/utils/format-value-destination';
import get from 'lodash/get';
import { TDeepthLevelStack } from '../../../../../../Validator/types';
import { ITouchedState } from '../../types';
import { TUIElement } from '@ballerine/common';

export const generateTouchedMapForAllElements = (
  elements: TUIElement[],
  context: object,
): ITouchedState => {
  const touchedMap: ITouchedState = {};

  const run = (elements: TUIElement[], stack: TDeepthLevelStack = []) => {
    elements.forEach(element => {
      const { children, valueDestination, id } = element;
      const formattedId = formatId(id, stack);
      const formattedValueDestination = valueDestination
        ? formatValueDestination(valueDestination, stack)
        : '';

      touchedMap[formattedId] = true;

      const value = formattedValueDestination ? get(context, formattedValueDestination) : null;

      if (children && formattedValueDestination && Array.isArray(value)) {
        value.forEach((_, index) => {
          run(children, [...stack, index]);
        });
      }
    });
  };

  run(elements);

  return touchedMap;
};
