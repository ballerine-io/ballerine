---
title: Ballerine Installation
description: his guide provides a step-by-step process for setting up and running the Ballerine stack on your local environment.
layout: '../../../layouts/MainLayout.astro'
---

## Installation Guide

### Prerequisites
Before you can install and use Ballerine, you will need the following:

1. **Node.js**: Ballerine requires Node.js. If not installed, download and install it from [here](https://nodejs.org/).

2. **pnpm**: This is a fast, disk space efficient package manager for JavaScript. You can install it globally with the following command:
    ```
    npm install -g pnpm
    ```

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

5. **Start the API example**: To start the example API, use the following command:
    ```shell
    pnpm run api-manual-review-example
    ```

After performing these steps, the backoffice should be running on http://localhost:5137/, and the workflow service will be accepting calls at http://localhost:3000/. 

The default username and password for the backoffice are:

- Username: admin@admin.com
- Password: admin




v2

To set up a local environment, follow these steps:

1. #### Install prerequisites:
   - Node.js (Minimum version 18) (you can install node via NVM: [Install NVM](https://github.com/nvm-sh/nvm))
   - Latest PNPM version (Minimum version 8.0) ([Install PNPM](https://pnpm.io/installation))
   - Docker and docker compose ([Docker](https://docs.docker.com/desktop), [Docker Compose](https://docs.docker.com/compose/install))

2. #### Clone and install the project:
   1. Clone the project:
   ```sh
   git clone https://github.com/ballerine-io/ballerine.git
   ```
   2. Install npm depenencies:
   ```sh
   pnpm install
   ```
   3. Initialize monorepo:
   ```sh
   pnpm monorepo:init
   ```

3. #### Run the example
   ```sh
   pnpm kyc-manual-review-example
   ```

Once the process is complete,  _2 tabs_   will open in your browser:

1. http://localhost:5173/ - for the _document collection flow_
2. http://localhost:5137/ - for the  _backffice_
(It's recommended to have them positioned side-by-side).