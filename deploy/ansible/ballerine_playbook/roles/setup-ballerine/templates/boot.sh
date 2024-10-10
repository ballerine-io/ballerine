#!/bin/bash

cd /home/ballerine/ballerine

git checkout dev ; git pull

cd /home/ballerine/ballerine/deploy

sudo docker-compose -f docker-compose-build.yml pull

sudo docker-compose -f docker-compose-build.yml up -d
