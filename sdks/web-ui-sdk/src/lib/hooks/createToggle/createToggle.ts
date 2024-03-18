import { writable } from 'svelte/store';


/**
 * Creates a toggle with provided initial state.
 * @param initialState - The initial state of the toggle. Default is `false`.
 * @returns An array containing the toggle store, a function to toggle the state, a function to set the state to `true`, and a function to set the state to `false`.
 */
export const createToggle = (initialState = false) => {
  const { subscribe, update } = writable(initialState);
  const toggle = (nextState?: boolean) =>
    update(prevState => (typeof nextState === 'boolean' ? nextState : !prevState));
  const toggleOn = () => toggle(true);
  const toggleOff = () => toggle(false);

  return [{ subscribe, update }, toggle, toggleOn, toggleOff] as const;
};
