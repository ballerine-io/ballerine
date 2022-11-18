import { writable } from 'svelte/store';

export const createToggle = (initialState = false) => {
  const { subscribe, update } = writable(initialState);
  const toggle = (nextState?: boolean) =>
    update(prevState => (typeof nextState === 'boolean' ? nextState : !prevState));
  const toggleOn = () => toggle(true);
  const toggleOff = () => toggle(false);

  return [{ subscribe, update }, toggle, toggleOn, toggleOff] as const;
};
