import { get } from 'lodash-es';

export const getPropertyPath = <TObj extends Record<PropertyKey, any>>({
  obj,
  accessor,
  propertyId,
}: {
  obj: TObj;
  accessor: (proxy: TObj) => any;
  propertyId?: string;
}) => {
  const path: string[] = [];

  const proxy = new Proxy(obj, {
    get(target: TObj, prop: PropertyKey) {
      path.push(String(prop));

      return new Proxy({}, this);
    },
  });

  // Invoke the accessor function to trigger the proxy
  accessor(proxy);

  const fullPath = path.join('.');
  const prop = path.at(-1);

  if (!prop) {
    throw new Error('Property path is empty');
  }

  return {
    id: propertyId,
    title: prop,
    value: get(obj, path.join('.')),
    path: fullPath,
  };
};
