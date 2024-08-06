/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENVIRONMENT_NAME?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_AUTH_TOKEN?: string;
  readonly VITE_I18N_DEBUG?: string;
  readonly VITE_DEFAULT_EXAMPLE_TOKEN?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
