# Contributing to Ballerine

Thank you for investing your time in contributing to our project!

Before moving forward please read our [code of conduct](CODE_OF_CONDUCT.md), and our [style guide](STYLE_GUIDE.md).

## What to contribute

We accept contributions in different sizes and varied difficulty, from documentation and typos, to features and bug fixes. To see what you could help with, report an issue, or suggest a feature see [issues](https://github.com/ballerine-io/ballerine/issues) and [discussions](https://github.com/ballerine-io/ballerine/discussions).

## Need help?

- Join our [Discord](https://discord.gg/e2rQE4YygA) or [Slack](https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw)
- Head to our [documentation](README.md)
- Contact us at [oss@ballerine.com](mailto:oss@ballerine.com)

## Prerequisites

```bash
node: ">=16.15.1"
pnpm: ">=7.11.0"
```

## Setup
1. Clone Ballerine's repository
```bash
git clone git@github.com:ballerine-io/ballerine.git
```
2. Navigate to the directory and install dependencies
```bash
cd ballerine && pnpm install
```
3. Start the dev server
```bash
pnpm dev
```
4. Open the page in your [browser](http://localhost:3000/)

## Project structure

```
├── apps # end user facing, interacts with packages and services
├── community # ui packs, ui components, and vendor integrations made by the community
├── packages # shared logic between apps, community, sdks, and services
├── sdks # dev kits for developers to create experiences and applications, interacts with apps
 (can load an app into a certain platform such as web or native)
└── services # backend microservices, services communicate through a communication layer
(i.e REST/HTTP requests), and may communicate with a database
```

## First commit

### Branch name
This project makes use of [branchlint](https://github.com/Omri-Levy/branchlint) to ensure that all branch names follow a consistent format with a CLI to help with the process of creating a new branch, setting upstream, and checking out to the new branch.

### Commit message
This project makes use of tools like [commitizen](https://github.com/commitizen/cz-cli) and [commitlint](https://github.com/conventional-changelog/commitlint) to ensure that all commits follow a consistent commit message format with a CLI to help with the process of pushing a commit.

1. Create a new branch, set upstream, and checkout to the new branch

Make sure to run this NPM script in the root of the monorepo and follow the CLI prompts.

```bash
pnpm branchlint
```

2. Make your changes

3. Push a formatted commit

Make sure to run this NPM script in the root of the monorepo and follow the CLI prompts.

```bash
pnpm commit
```

4. Push the commit
```bash
git push
```


Ensure that the following workflows have passed before creating a pull request:
- Building
- Testing
- Linting
- Formatting
Ensure that the following workflows have passed before creating a pull request:
- Building
- Testing
- Linting
- Formatting

Now that the changes are pushed to the remote branch, GitHub Actions will run workflows for building, testing, linting, and formatting. Before creating a pull request, make sure that all workflows have passed.

6. Create a pull request

When creating a pull request, make sure to follow the pull request template.

## Contributing using a fork

If any of the workflows fail, please check the specific error messages or logs to identify the issue.

1. Head to the [repository](https://www.github.com/ballerine-io/ballerine).
2. Click on the "Fork" button on the top right corner of the GitHub page.
3. Create the fork.
4. Follow the instructions from [prerequisites](#prerequisites) up to creating a pull request.
4. On the compare page, click **compare across forks**.
6. In the "base branch" drop-down menu, select the branch of the upstream repository you'd like to merge changes into.
7. In the "head fork" drop-down menu, select your fork, then in the "compare branch" drop-down menu to select the branch you made your changes in.
8. Create the pull request.
