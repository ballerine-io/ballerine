import { DataCreationSchema } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation/withInitialDataCreation';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export const isInitialDataAlreadyExists = (context: AnyObject, schema: DataCreationSchema) => {
  for (const key in schema) {
    const setDestination = key;

    const isValueExists = get(context, setDestination) !== undefined;

    if (isValueExists) return true;
  }

  return false;
};
