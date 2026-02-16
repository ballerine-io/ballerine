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

# Template VITE_API_URL into the nginx config for the /api/v1/ reverse proxy.
# Only substitute $VITE_API_URL (via explicit list) to avoid corrupting nginx's
# own variables like $proxy_host, $remote_addr, etc.
if [ -n "$VITE_API_URL" ]; then
  envsubst '${VITE_API_URL}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
  mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf
  echo "[entrypoint] nginx proxy configured → ${VITE_API_URL}"
else
  echo "[entrypoint] WARNING: VITE_API_URL empty, nginx API proxy will not work"
fi

# Handle CMD command
exec "$@"
