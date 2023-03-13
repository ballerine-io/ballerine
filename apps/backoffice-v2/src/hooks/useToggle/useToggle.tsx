import { useCallback, useState } from 'react';

/**
 * @description A hook which handles working with boolean state - returns the current value (true|false), and functions to toggle, toggle on, or toggle off the value.
 *
 * @param [initialState=false] - An optional boolean value to set the initial state to.
 *
 * @returns [boolean, toggle, toggleOn, toggleOff]
 */
export const useToggle = (
  initialState = false,
): [
  isToggled: boolean,
  toggle: (next?: boolean) => void,
  toggleOn: () => void,
  toggleOff: () => void,
] => {
  const [isToggled, setIsToggled] = useState(initialState);
  const toggle = useCallback(
    (next?: boolean) => setIsToggled(prevState => (typeof next === `boolean` ? next : !prevState)),
    [],
  );
  const toggleOn = useCallback(() => toggle(true), [toggle]);
  const toggleOff = useCallback(() => toggle(false), [toggle]);

  return [isToggled, toggle, toggleOn, toggleOff];
};
