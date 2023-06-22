---
title: Deployment
description: 
layout: '../../../layouts/MainLayout.astro'
---
## Deployment Guide

### Docker Compose Deployment

1. **Clone the project**: Use Git to clone the Ballerine repository to your local machine:
    ```shell
    git clone https://github.com/ballerine-io/ballerine.git && cd ballerine
    ```

2. **Switch to the main branch**: After cloning, switch to the main branch (or the branch you wish to deploy):
    ```shell
    git checkout main
    ```

3. **Run Docker Compose**: Now, you can start all services using Docker Compose:
    ```shell
    docker-compose up -d
    ```

The application should now be running at the ports defined in your Docker Compose configuration. 

### Kubernetes Deployment (Helm)

1. **Add the Ballerine Chart Repo**: Add the Helm chart repository that contains the Ballerine charts:
    ```shell
    helm repo add ballerine https://helm.ballerine.io
    ```

2. **Update your Helm Repo**: Fetch the latest version of the Helm chart from the repo:
    ```shell
    helm repo update
    ```

3. **Install the Ballerine Chart**: Now you can install the Ballerine Helm chart onto your Kubernetes cluster:
    ```shell
    helm install ballerine ballerine/ballerine
    ```

By default, the application will be deployed on your default namespace. You can specify a different namespace by adding `-n <namespace>` at the end of the `helm install` command. 

Always refer to the official documentation of Ballerine for more specific configuration and deployment details.

