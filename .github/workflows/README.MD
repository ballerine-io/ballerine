# CI/CD Information

## Architecture Overview

![alt text](1b06ff8b-222b-4286-b31b-52b8b9612c85.png)

The CI/CD pipeline consists of three main stages:

- Dev Environment
- SB Environments
- Prod Environments

## List of Workflows
| Scenarios | Actions |
|-----------|---------|
| **Deploy to Dev Environment** | [Build and Deploy to Dev](https://github.com/ballerine-io/ballerine/actions/workflows/) |
| **Promote to SB** | [Promote Action](https://github.com/ballerine-io/ballerine/actions/workflows/deploy-wf-service.yml) |
| **Promote to Prod** | [Promote Action](https://github.com/ballerine-io/ballerine/actions/workflows/deploy-wf-service.yml) |
| **Run Migrations** | [Run Migrations Action](https://github.com/ballerine-io/wf-data-migration/actions/workflows/CD-v2.yml) |
| **Perform Hotfix** | [Hotfix Action](https://github.com/ballerine-io/ballerine/actions/workflows/hotfix-wf-service.yml) |
| **Create Preview Environment** | [Preview Environment](https://github.com/ballerine-io/ballerine/actions/workflows/build-preview-environment.yml) |
| **Deploy Backoffice** | [Backoffice action](https://github.com/ballerine-io/ballerine/actions/workflows/deploy-backoffice.yml) |
| **Deploy KYB** | [KYB action](https://github.com/ballerine-io/ballerine/blob/dev/.github/workflows/deploy-kyb.yml) |
| **Deploy Dashboard** | [Dashboard action](https://github.com/ballerine-io/ballerine/blob/dev/.github/workflows/) |

## Workflow Scenarios

1. **Deploy to Dev Environment**: [Build and Deploy to Dev](https://github.com/ballerine-io/ballerine/actions/workflows/push-workflows-service-image.yml)
    - Push code to dev branch
        OR
      Manually trigger workflow_dispatch with `dev` branch

2. **Promote to SB**: [Promote Action](https://github.com/ballerine-io/ballerine/actions/workflows/deploy-wf-service.yml)
    - Pass the environment input value as `SB`.
    - this will deploy the latest present version in `dev` to `SB`.

3. **Promote to Prod**: [Promote Action](https://github.com/ballerine-io/ballerine/actions/workflows/deploy-wf-service.yml)
    - Pass the environment input value as `prod`.
    - this will deploy the latest present version in `sb` to `prod`.

4. **Run Migrations** from a specific branch in `wf-data-migration` repo in a specific environment: [Run Migrations Action](https://github.com/ballerine-io/wf-data-migration/actions/workflows/CD-v2.yml)
    - Pass the branch from which you want to run the migration code and the environment name on which you want to run the action.

5. **Perform Hotfix** on any environment: [Hotfix Action](https://github.com/ballerine-io/ballerine/actions/workflows/hotfix-wf-service.yml)
    - Pass the branch and the environment on which you want to perform the hotfix and run the workflow.

6. **Create Preview Environment** from specific branch: [Preview Environment](https://github.com/ballerine-io/ballerine/actions/workflows/build-preview-environment.yml)
    - Add a label `deploy-pr` in your Pull request. (runs the workflow automatically)
    - Run the workflow manually with the provided branch name and the preview environment build and deployment will start.

7. **Deploy Front-end Apps**: 
    - Deploy **Backoffice** Manually: [Backoffice action](https://github.com/ballerine-io/ballerine/actions/workflows/deploy-backoffice.yml)
    - Deploy **KYB** Manually: [KYB action](https://github.com/ballerine-io/ballerine/blob/dev/.github/workflows/deploy-kyb.yml)
    - Deploy **Dashboard** Manually: [Dashboard action](https://github.com/ballerine-io/ballerine/blob/dev/.github/workflows/deploy-dashboard.yml)

    - Note: Provide the environment name on which you want to trigger the deployment.


## Prerequisites

- Github Actions access
- Repository permissions