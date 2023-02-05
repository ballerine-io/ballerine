export const createWorkflowCore = ({ states, context }) => {
  const subscribers = [];

  return {
    subscribe: callback => {
      subscribers.push(callback);
    },
    sendEvent: ({ type, payload }) => {
      const [[key, value], ...nextStates] = Object.entries(states);
      const state = {
        [key]: value,
      };

      states = nextStates.reduce((acc, [key, value]) => {
        acc[key] = value;

        return acc;
      }, {});

      return subscribers.forEach(cb =>
        cb({
          type,
          payload,
          state,
        }),
      );
    },
    getSnapshot: () => ({
      context,
    }),
    setContext: next => {
      context = next;
    },
  };
};
