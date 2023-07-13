import forEach from 'lodash/forEach';

function removeKeyAndValue<T extends object>(
  object: T,
  keyToSearch: string,
  valueToSearch: unknown,
): void {
  if (typeof object !== 'object' || object === null) {
    return;
  }

  if (Array.isArray(object)) {
    forEach(object, item => removeKeyAndValue(item, keyToSearch, valueToSearch));
    return;
  }

  forEach(object, (value, key) => {
    if (key === keyToSearch && value === valueToSearch) {
      delete object[key as keyof T];
    } else {
      removeKeyAndValue(value as T, keyToSearch, valueToSearch);
    }
  });
}

// type: final breaks X-state visualizer
// to avoid this for now we have to remove those values from state defintiion
export const deserializeStateDefinition = (state: Record<string, any>) => {
  state = JSON.parse(JSON.stringify(state));

  removeKeyAndValue(state, 'type', 'final');

  return state;
};
