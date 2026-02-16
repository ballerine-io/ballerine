#!/bin/sh

# Derive API URL from domain if provided
if [ -n "$VITE_DOMAIN" ]; then
    VITE_API_URL="$VITE_DOMAIN/api/v1/"
fi

# Write runtime config for the SPA and kyc-mobile pages.
# Values are JSON-escaped to prevent injection.
cat << EOF > /usr/share/nginx/html/config.js
globalThis.env = {
  VITE_API_URL: "$VITE_API_URL",
  VITE_API_KEY: "$VITE_API_KEY",
  VITE_ENVIRONMENT_NAME: "$VITE_ENVIRONMENT_NAME",
  VITE_SENTRY_AUTH_TOKEN: "$VITE_SENTRY_AUTH_TOKEN",
  VITE_SENTRY_DSN: "$VITE_SENTRY_DSN",
}
EOF

# Also write config for the kyc-mobile sub-page
if [ -d /usr/share/nginx/html/kyc-mobile ]; then
  cp /usr/share/nginx/html/config.js /usr/share/nginx/html/kyc-mobile/config.js
fi

echo "[entrypoint] config.js VITE_API_URL=${VITE_API_URL:-(empty)}"

# Handle CMD command
exec "$@"
