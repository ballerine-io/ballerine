#!/usr/bin/env bash

set -e

# Example:
# ./ballerine_install.sh <domain_name>

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
            sed -i "s/http:\/\/localhost:3000/${WORKFLOW_SERVICE_DOMAIN_NAME}/g" $i
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

if [[ ! -z "${WORKFLOW_SERVICE_DOMAIN_NAME}" ]]; then
  ### Update frontend build variables only if domain_name is given
  update_frontend_build_variables
  update_env_docker_compose
fi

##
