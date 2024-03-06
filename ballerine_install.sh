#!/usr/bin/env bash

set -e

# Example Usage:
# ./ballerine_install.sh <VITE_API_URL_DOMAIN_NAME>

echo "Running as: $(id)"

WORKFLOW_SERVICE_DOMAIN_NAME=$1

function update_frontend_build_variables() {
    ## Get frontend application env files
    echo "Updating frontend Build Variables"
    env_files=$(find ./apps -name "*.env.example")
    echo $env_files
    for i in $env_files;
        do
            echo "Updating env variables of $i"
            sed -i "s/localhost/${WORKFLOW_SERVICE_DOMAIN_NAME}/g" $i
        done

}

function update_env_docker_compose(){
    ## update env variables for docker-compose yaml
    echo "Updating docker-compose env variables"
    env_files=$(find ./deploy -name "*.env")
    for i in $env_files;
        do
            echo "Updating env variables of $i"
            sed -i "s/DOMAIN_NAME=\"\"/DOMAIN_NAME=\"${WORKFLOW_SERVICE_DOMAIN_NAME}\"/g" $i;
        done
}

function install_docker(){
  sudo apt update;
  sudo apt install -y docker.io
  mkdir -p ~/.docker/cli-plugins/
  curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  chmod +x ~/.docker/cli-plugins/docker-compose
  sudo mv ~/.docker/cli-plugins/docker-compose /usr/bin/docker-compose
}


install_docker

if [[ ! -z "${WORKFLOW_SERVICE_DOMAIN_NAME}" ]]; then
  ### Update frontend build variables only if domain_name is given
  update_frontend_build_variables
  update_env_docker_compose
fi

## Bring docker-container up
cd deploy; sudo docker-compose -f docker-compose-build.yml up -d
