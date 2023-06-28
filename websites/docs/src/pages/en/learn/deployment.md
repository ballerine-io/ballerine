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
# Install ballerine using helm chart

Ballerine is a collection of services like workflow-service, backendoffice.
In values.yaml we have sections to enable/disable them based on the necessity like below

``` bash
workflowService:
  enabled: true
```

## Prerequisites

- kubernetes cluster
- [helm](https://helm.sh/docs/intro/install/)
- [kubectl](https://storage.googleapis.com/kubernetes-release/release/v1.23.6/bin/linux/amd64/kubectl) preferably 1.24 or less upto 1.23

### How to install

Move to deploy directory

```bash
cd deploy/helm
```

### Setup Postgresql

#### Install postgresql along with ballerine

- edit values.yaml

```bash
## Postgres params
postgresql:
  enabled: true
  auth:
    username: admin
    password: admin
    postgresPassword: admin
    database: postgres
#   Local dev purpose
#   persistence:
#     existingClaim: postgresql-pv-claim
#   volumePermissions:
#     enabled: true
```

#### How to use managed postgresql along with ballerine

- edit values.yaml

```bash
## Postgres params
postgresql:
  enabled: false
.
.
.
.
  applicationConfig:
    BCRYPT_SALT: "10"
    JWT_SECRET_KEY: "secret"
    JWT_EXPIRATION: "10d"
    DB_URL: "<Managed DB_URL with databasename>"
    DB_USER: "<Managed DB_USER>"
    DB_PASSWORD: "<Managed DB_PASSWORD>"
    DB_PORT: "5432"
```

### Installing Ballerine helm chart

``` bash
helm install ballerine . -n ballerine --create-namespace -f values.yaml
```

### Troubleshooting

```bash
kubectl get pods -n ballerine
```

- Note the pod name of service you wish to trouble shoot

```bash
kubectl logs <pod> -n ballerine
```

- Accessing the application

```bash
kubectl port-forward svc/<service> -n ballerine 3000:3000
```


Always refer to the official documentation of Ballerine for more specific configuration and deployment details.

