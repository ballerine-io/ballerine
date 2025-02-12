#!/usr/bin/env sh

if [[ -n "$VITE_DOMAIN" ]]
then
    VITE_API_URL="$VITE_DOMAIN/api/v1/"
fi

if [[ -n "$MODE" ]]
then
	MODE="$MODE"
fi

if [[ -n "$VITE_IMAGE_LOGO_URL" ]]
then
    VITE_IMAGE_LOGO_URL="$VITE_IMAGE_LOGO_URL"
fi


if [[ -n "$VITE_ENVIRONMENT_NAME" ]]
then
    VITE_ENVIRONMENT_NAME="$VITE_ENVIRONMENT_NAME"
fi


cat << EOF > /usr/share/nginx/html/config.js
globalThis.env = {
  VITE_API_URL: "$VITE_API_URL",
  VITE_ENVIRONMENT_NAME: "$VITE_ENVIRONMENT_NAME",
  MODE: "$MODE",
  VITE_IMAGE_LOGO_URL: "$VITE_IMAGE_LOGO_URL",
}
EOF

# Handle CMD command
exec "$@"