#!/usr/bin/env sh

if [[ -z "$VITE_DOMAIN" ]]
then
    VITE_DOMAIN="http://localhost:3000"
fi

if [[ -z "$VITE_API_KEY" ]]
then
    VITE_API_KEY="secret"
fi

if [[ -z "$VITE_ENVIRONMENT_NAME" ]]
then
    VITE_ENVIRONMENT_NAME=local
fi


if [[ -z "$VITE_DEFAULT_EXAMPLE_TOKEN" ]]
then
    VITE_DEFAULT_EXAMPLE_TOKEN=12345678-1234-1234-1234-123456789012
fi

if [[ -z "$VITE_SENTRY_AUTH_TOKEN" ]]
then
    VITE_SENTRY_AUTH_TOKEN=""
fi

if [[ -z "$VITE_SENTRY_DSN" ]]
then
    VITE_SENTRY_DSN=""
fi

cat << EOF > /usr/share/nginx/html/config.js
globalThis.env = {
  VITE_API_URL: "$VITE_DOMAIN/api/v1/",
  VITE_API_KEY: "$VITE_API_KEY",
  VITE_ENVIRONMENT_NAME: "$VITE_ENVIRONMENT_NAME",
  VITE_DEFAULT_EXAMPLE_TOKEN: "$VITE_DEFAULT_EXAMPLE_TOKEN",
  VITE_SENTRY_AUTH_TOKEN: "$VITE_SENTRY_AUTH_TOKEN",
  VITE_SENTRY_DSN: "$VITE_SENTRY_DSN",
}
EOF

# Handle CMD command
exec "$@"
