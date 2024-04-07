#!/usr/bin/env bash

set -e

echo "Running as: $(id)"

## Check for the cloud provider
function get_cloud_provider() {
    release_details=$(uname -r)
    if [[ $release_details == *"amzn"* ]];then 
       cloud_provider="amazon";
    elif [[ $release_details == *"azure"* ]];then
       cloud_provider="azure";
    elif [[ $release_details == *"cloud"* ]];then
       cloud_provider="gcp";
    else
       cloud_provider="local";
    fi
}

## Get if it is deployed on docker or kubernetes
function get_tool() {

    if [ -z "${KUBERNETES_SERVICE_HOST}" ]; then
        dep_tool="docker";
    else
        dep_tool="kubernetes";
    fi
}

## Check the hostname and IP
function get_username_ip() {
    hostname=$(cat /etc/hostname)
}

get_cloud_provider
get_tool
get_username_ip

# one line
info_Json='{"cloudProvider":"'"$cloud_provider"'","Tool":"'"$dep_tool"'","Hostname":"'"$hostname"'"}'

echo $info_Json > /app/info.json

# Handle CMD command
exec "$@"
