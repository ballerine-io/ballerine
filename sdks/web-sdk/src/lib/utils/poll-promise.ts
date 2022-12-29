export const pollPromise = ({
  promise,
  interval = 1000,
  maxAttempts = 3,
  shouldStopPolling,
}: {
  promise: Promise<any>;
  interval?: number;
  maxAttempts?: number;
  shouldStopPolling: (result: any) => boolean;
}) => {
  let attempts = 1;
  const poll = async () => {
    const result = await promise;

    if (shouldStopPolling(result) || attempts === maxAttempts) {
      return result;
    }

    await new Promise(resolve => setTimeout(resolve, interval));

    attempts++;
    return poll();
  };

  return poll();
};
