export const getDefaultLocalAccessToken = () => {
  const defaultExampleToken = import.meta.env.VITE_DEFAULT_EXAMPLE_TOKEN;
  const environmentName = import.meta.env.VITE_ENVIRONMENT_NAME;

  if (defaultExampleToken && environmentName === 'local') {
    return defaultExampleToken;
  }

  return null;
};
