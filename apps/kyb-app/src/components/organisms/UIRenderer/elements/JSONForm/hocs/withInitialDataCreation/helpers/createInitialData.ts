import { DataCreationSchema } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation/withInitialDataCreation';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';
import set from 'lodash/set';

export const createAndInsertInitialData = (context: AnyObject, schema: DataCreationSchema) => {
  Object.entries(schema).forEach(([setDestination, getDestination]) => {
    set(context, setDestination, get(context, getDestination));
  });

  return context;
};
