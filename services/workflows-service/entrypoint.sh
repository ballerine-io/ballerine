#!/usr/bin/env bash

infra_file="/tmp/infra.json"

## Get cloudProvider details
function get_cloud_provider() {
  release_details=$(uname -r || echo "")
  if [[ $release_details == *"amzn"* ]]; then
    cloud_provider="amazon"
  elif [[ $release_details == *"azure"* ]]; then
    cloud_provider="azure"
  elif [[ $release_details == *"cloud"* ]]; then
    cloud_provider="gcp"
  elif [[ $release_details == *"generic"* ]]; then
    cloud_provider="digitalocean"
  elif [[ $release_details == *"ecs"* ]]; then
    cloud_provider="alibaba"
  elif [[ -n "${DYNO:-}" ]]; then
    cloud_provider="heroku"
  else
    cloud_provider="others(including local)"
  fi
}

## Get deployment tool details
function get_tool() {
  if [[ -z "${KUBERNETES_SERVICE_HOST:-}" ]]; then
    dep_tool="likely docker"
  else
    dep_tool="kubernetes"
  fi
}

## Check hostname
function get_hostname() {
  if [[ -f /etc/hostname ]]; then
    hostname="$(cat /etc/hostname)"
  else
    hostname="$(hostname || echo "unknown")"
  fi
}

## Get current Time
function get_current_time() {
  currentTime="$(date -u -Iseconds || echo "unknown")"
}

## Check if it's an ECS Fargate deployment
function check_for_fargate() {
  if [[ $cloud_provider == "amazon" && $dep_tool == "likely docker" ]]; then
    dep_tool="ecs-fargate"
  fi
}

## Main Block
get_cloud_provider || true
get_tool || true
get_hostname || true
check_for_fargate || true
get_current_time || true

infra_json='{"cloudProvider":"'"${cloud_provider}"'","tool":"'"${dep_tool}"'","hostname":"'"${hostname}"'","currentTime":"'"${currentTime}"'"}'
echo "${infra_json}"

echo "${infra_json}" > "${infra_file}"

exec dumb-init npm run prod

