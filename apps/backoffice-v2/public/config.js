globalThis.env = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://google.com',
  VITE_KYB_DEFINITION_ID: import.meta.env.VITE_KYB_DEFINITION_ID || 'kyb_parent_kyc_session_example',
  VITE_API_KEY: import.meta.env.VITE_API_KEY || 'secret',
  VITE_ENVIRONMENT_NAME: import.meta.env.VITE_ENVIRONMENT_NAME || 'local',
  VITE_DEFAULT_EXAMPLE_TOKEN: import.meta.env.VITE_DEFAULT_EXAMPLE_TOKEN || '12345678-1234-1234-1234-123456789012',
  VITE_SENTRY_AUTH_TOKEN: import.meta.env.VITE_SENTRY_AUTH_TOKEN || '',
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
};
