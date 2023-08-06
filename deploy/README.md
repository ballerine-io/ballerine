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

3. Run the following command to start the containers:

   ```shell
   docker-compose up
   ```

   Docker Compose will read the `docker-compose.yml` file and initiate the containers accordingly. The container logs will be displayed in the terminal.

   If you prefer to run the containers in the background, use the detached mode with the `-d` flag:

   ```shell
   docker-compose up -d
   ```

4. Once the containers are running, you can access the services as specified in the repository's documentation or the `docker-compose.yml` file.

## Running DEV Containers with Docker Compose

To start the containers in Dev mode for easy debugging do the following.

   ```shell
   cd deploy/
   docker-compose up -f docker-compose-dev.yml
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
- `docker-compose up -d --no-deps <service_name>`: Builds or rebuilds the service specified in <service_name>.
- `docker-compose up --build --force-recreate`: Builds or rebuilds all the services in `docker-compose.yml`

## Conclusion

By utilizing the `docker-compose.yml` file in a repository, you can easily set up and manage the required Docker services for the project. Cloning the repository and running `docker-compose up` allows you to quickly start the defined containers. Be sure to refer to the repository's documentation for any specific instructions or configurations related to the `docker-compose.yml` file.