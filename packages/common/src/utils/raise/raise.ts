export const raise = (error: unknown, cause?: ErrorOptions['cause']): never => {
  throw typeof error === 'string'
    ? new Error(error, {
        cause,
      })
    : error;
};
