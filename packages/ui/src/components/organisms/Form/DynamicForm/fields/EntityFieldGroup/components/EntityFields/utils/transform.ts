import { AnyObject } from '@/common';
import jsonata from 'jsonata';
import { IEntity } from '../../../types';

export const transform = async (context: AnyObject, entity: IEntity, expression: string) => {
  const transfomer = jsonata(expression);

  const transformerPayload = {
    context,
    entity,
  };

  const transformResult = await transfomer.evaluate(transformerPayload);

  return transformResult;
};
