---
title: Ballerine Installation
description: his guide provides a step-by-step process for setting up and running the Ballerine stack on your local environment.
layout: '../../../layouts/MainLayout.astro'
---

## Installation Guide

### Prerequisites
Before you can install and use Ballerine, you will need the following:
## Install prerequisites:
   - Node.js (Minimum version 18) (you can install node via NVM: [Install NVM](https://github.com/nvm-sh/nvm))
   - Latest PNPM version (Minimum version 8.0) ([Install PNPM](https://pnpm.io/installation))
   - Docker and docker compose ([Docker](https://docs.docker.com/desktop), [Docker Compose](https://docs.docker.com/compose/install))

### Installation Steps

1. **Clone the project**: Use Git to clone the Ballerine repository to your local machine:
    ```shell
    git clone https://github.com/ballerine-io/ballerine.git && cd ballerine
    ```

2. **Switch to the dev branch**: After cloning, switch to the development branch:
    ```shell
    git checkout dev
    ```

3. **Install dependencies**: Use pnpm to install all the required dependencies:
    ```shell
    pnpm install
    ```

4. **Initialize the monorepo**: The project is set up as a monorepo. Initialize it using the following command:
    ```shell
    pnpm run monorepo:init
    ```


## Run one of the examples, or follow a guide from the [guide sections](https://docs.ballerine.com/en/learn/simple-kyb-guide/):

**Start the KYC example**: To start the example API, use the following command:
    ```shell
    pnpm run kyc-manual-review-example
    ```

After performing these steps, the backoffice should be running on http://localhost:5137/, and the workflow service will be accepting calls at http://localhost:3000/. 

The default username and password for the backoffice are:

- Username: admin@admin.com
- Password: admin
