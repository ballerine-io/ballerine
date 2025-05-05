#!/usr/bin/env sh

if [[ -n "$VITE_DOMAIN" ]]
then
    VITE_API_URL="$VITE_DOMAIN/api/v1/"
fi


if [[ -n "$VITE_API_KEY" ]]
then
    VITE_API_KEY="$VITE_API_KEY"
fi

if [[ -n "$VITE_ENVIRONMENT_NAME" ]]
then
    VITE_ENVIRONMENT_NAME="$VITE_ENVIRONMENT_NAME"
fi

if [[ -n "$VITE_SENTRY_AUTH_TOKEN" ]]
then
    VITE_SENTRY_AUTH_TOKEN="$VITE_SENTRY_AUTH_TOKEN"
fi

if [[ -n "$VITE_SENTRY_DSN" ]]
then
    VITE_SENTRY_DSN="$VITE_SENTRY_DSN"
fi

cat << EOF > /usr/share/nginx/html/config.js
globalThis.env = {
  VITE_API_URL: "$VITE_API_URL",
  VITE_API_KEY: "$VITE_API_KEY",
  VITE_ENVIRONMENT_NAME: "$VITE_ENVIRONMENT_NAME",
  VITE_SENTRY_AUTH_TOKEN: "$VITE_SENTRY_AUTH_TOKEN",
  VITE_SENTRY_DSN: "$VITE_SENTRY_DSN",
}
EOF

# Handle CMD command
exec "$@"
