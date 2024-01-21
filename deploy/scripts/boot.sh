#!/bin/bash

set -o errexit

install_docker(){

  sudo apt update;
  sudo apt install -y docker.io
  mkdir -p ~/.docker/cli-plugins/
  curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  chmod +x ~/.docker/cli-plugins/docker-compose
  sudo mv ~/.docker/cli-plugins/docker-compose /usr/bin/docker-compose
}

deploy_ballerine(){
	mkdir -p /home/ubuntu/ballerine; cd /home/ubuntu/ballerine
  curl https://raw.githubusercontent.com/ballerine-io/ballerine/dev/deploy/docker-compose.yml -o /home/ubuntu/ballerine/docker-compose.yml 
}

install_docker
deploy_ballerine
