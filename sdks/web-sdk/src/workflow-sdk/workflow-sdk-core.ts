export const createWorkflowCore = ({ states = {}, context = {} }) => {
  const subscribers = [];

  return {
    subscribe: callback => {
      subscribers.push(callback);
    },
    sendEvent: ({ type, payload }) => {
      const entries = Object.entries(states);
      let next = [];

      if (entries.length === 1) {
        next = entries[0];
      }

      if (entries.length > 1) {
        next = entries[1];
      }

      const [key, value] = next;
      const nextStates = entries.slice(1);
      const state =
        key && value
          ? {
              [key]: value,
            }
          : undefined;

      states = nextStates?.reduce((acc, [key, value]) => {
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
