export const createWorkflowCore = ({ states, context }) => {
  const subscribers = [];

  return {
    subscribe: callback => {
      subscribers.push(callback);
    },
    sendEvent: ({ type, payload }) => {
      return subscribers.forEach(cb =>
        cb({
          type,
          payload,
          state: states.pop(),
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
