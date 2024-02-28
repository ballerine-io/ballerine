#!/bin/bash

set -o errexit

DOMAIN_NAME=$1

if [[ -z "$DOMAIN_NAME" ]]; then
  echo "please provide domain_name if you want to host ballerine."
fi

source_env_variables(){
  cat <<<"
  DOMAIN_NAME="${DOMAIN_NAME}"
  VITE_API_URL="http://${DOMAIN_NAME:-localhost}:3000/api/v1/"
  VITE_KYB_DEFINITION_ID="kyb_parent_kyc_session_example"
  BACKOFFICE_PORT=5137
  HEADLESS_SVC_PORT=5173
  WORKFLOW_SVC_PORT=3000
  BCRYPT_SALT=10
  API_KEY="secret"
  NODE_ENV="development"
  COMPOSE_PROJECT_NAME=ballerine-x
  DB_PORT=5432
  DB_USER=admin
  DB_PASSWORD=admin
  SESSION_SECRET=secret
  SESSION_EXPIRATION_IN_MINUTES=60
  BACKOFFICE_CORS_ORIGIN="http://${DOMAIN_NAME:-localhost}:${BACKOFFICE_PORT}"
  WORKFLOW_DASHBOARD_CORS_ORIGIN="http://${DOMAIN_NAME:-localhost}:${WORKFLOW_DASHBOARD_PORT}"
  KYB_EXAMPLE_CORS_ORIGIN="http://${DOMAIN_NAME:-localhost}:${KYB_APP_PORT}"
  WORKFLOW_DASHBOARD_PORT=5200
  WEBSOCKET_SVC_PORT=3500
  KYB_APP_PORT=5201
  WEBHOOK_SECRET=webhook_secret
  APP_API_URL="https://alon.ballerine.dev"
  EMAIL_API_URL="https://api.sendgrid.com/v3/mail/send"
  UNIFIED_API_URL="https://unified-api-test.eu.ballerine.app"
  ENVIRONMENT_NAME="development"
  "> /home/ubuntu/ballerine/deploy/.env
}

install_docker(){

  sudo apt update;
  sudo apt install -y docker.io
  mkdir -p ~/.docker/cli-plugins/
  curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  chmod +x ~/.docker/cli-plugins/docker-compose
  sudo mv ~/.docker/cli-plugins/docker-compose /usr/bin/docker-compose
}

deploy_ballerine(){
  git clone https://github.com/ballerine-io/ballerine.git;
  rm /home/ubuntu/ballerine/deploy/.env
  source_env_variables
  cd ballerine/deploy ; sudo docker-compose -f docker-compose-build.yml up -d --force-recreate
}

install_docker
deploy_ballerine
