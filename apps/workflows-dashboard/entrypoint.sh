#!/usr/bin/env sh

if [[ -z "$VITE_DOMAIN" ]]
then
    VITE_DOMAIN="http://localhost:3000"
fi

if [[ -z "$MODE" ]]
then
    MODE="development"
fi

if [[ -z "$VITE_IMAGE_LOGO_URL" ]]
then
    VITE_IMAGE_LOGO_URL=
fi


if [[ -z "$VITE_ENVIRONMENT_NAME" ]]
then
    VITE_ENVIRONMENT_NAME=local
fi


cat << EOF > /usr/share/nginx/html/config.js
globalThis.env = {
  VITE_API_URL: "$VITE_DOMAIN/api/v1/",
  VITE_ENVIRONMENT_NAME: "$VITE_ENVIRONMENT_NAME",
  MODE: "$MODE",
  VITE_IMAGE_LOGO_URL: "$VITE_IMAGE_LOGO_URL",
}
EOF

# Handle CMD command
exec "$@"
