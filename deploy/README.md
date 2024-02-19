# How to Use docker-compose.yml to kickstart Ballerine

## Introduction

This Markdown file provides guidance on how to utilize the `docker-compose.yml` file in a repository effectively.

## Prerequisites

Before proceeding, make sure you have the following installed:

- Docker: Ensure that Docker is installed on your system. If you haven't installed it yet, please refer to the official Docker documentation for instructions on how to install it for your specific operating system.

## Cloning the Repository

To start using the `docker-compose.yml` file in a repository, you need to clone the repository to your local machine. Follow these steps:

1. Open a terminal or command prompt on your machine.
2. Navigate to the directory where you want to clone the repository.
3. Use the `git clone` command followed by the repository URL to clone the repository. For example:

    ```shell
    git clone https://github.com/ballerine-io/ballerine.git
    ```

4. Once the cloning process is complete, navigate to the cloned repository directory:

    ```shell
    cd deploy
    ```

## Understanding the docker-compose.yml File

The `docker-compose.yml` file in the cloned repository defines the services and configurations required for the project. Take some time to understand the structure and content of the file. It typically contains service definitions, volumes, networks, and other configurations specific to the project.

## Running Containers with Docker Compose

To start the Docker services defined in the `docker-compose.yml` file, follow these steps:

1. Open a terminal or command prompt.
2. Navigate to the root directory of the cloned repository (where the `docker-compose.yml` file is located).

    ```shell
    cd deploy
    ```

3. Update env file with all the required values

    ``` shell
    BACKOFFICE_PORT=5137
    HEADLESS_SVC_PORT=5173
    WORKFLOW_SVC_PORT=3000
    BCRYPT_SALT=10
    API_KEY="secret"
    NODE_ENV="development"
    COMPOSE_PROJECT_NAME=ballerine-x
    DB_PORT=5432
    DB_USER=admin
    DB_PASSWORD=admin
    SESSION_SECRET=secret
    SESSION_EXPIRATION_IN_MINUTES=60
    BACKOFFICE_CORS_ORIGIN=
    HEADLESS_EXAMPLE_CORS_ORIGIN=
    WORKFLOW_DASHBOARD_CORS_ORIGIN=
    WORKFLOW_DASHBOARD_PORT=5200
    WEBSOCKET_SVC_PORT=3500
    KYB_APP_PORT=5201
    DOMAIN_NAME="<domain on which Ballerine should be up>"
    ```

4. Bring up the containers

    ```shell
    docker-compose -f docker-compose-build.yml up -d
    ```

## Additional Docker Compose Commands

Here are some additional Docker Compose commands that might be useful when working with the repository:

- `docker-compose ps`: Lists the status of the containers defined in `docker-compose.yml`.
- `docker-compose logs`: Displays the logs of the running containers.
- `docker-compose logs -f`: Displays the stream of logs of the running containers.
- `docker-compose logs <service_name>`: Displays the logs of the specific service containers.
- `docker-compose logs -f <service_name>`: Displays the stream of logs of the specific service.
- `docker-compose exec <service_name> <command>`: Runs a command inside a specific service container.
- `docker-compose restart <service_name>`: Restarts a specific service.
- `docker-compose build`: Builds or rebuilds the images defined in the `docker-compose.yml` file.
- `docker-compose up -d --no-deps <service_name>`: Builds or rebuilds the service specified in `<service_name>`.
- `docker-compose up --build --force-recreate`: Builds or rebuilds all the services in `docker-compose.yml`

## Conclusion

By utilizing the `docker-compose.yml` file in a repository, you can easily set up and manage the required Docker services for the project. Cloning the repository and running `docker-compose up` allows you to quickly start the defined containers. Be sure to refer to the repository's documentation for any specific instructions or configurations related to the `docker-compose.yml` file.
