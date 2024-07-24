---
title: Creating a workflow
description: A guide on how to create a new workflow by copying an existing workflow using the API.
---

To Create a new workflow, you can simply copy an existing workflow.

### Copying a Workflow

To copy a workflow, you can use the API endpoint: `"/api/v1/workflow-definition/{id}/copy"`. This endpoint accepts the ID of an existing workflow or a template and copies it. While copying, you have the option to overwrite the workflow's "name" and "displayName".

### Usage Example

Copying a workflow

<img title="Copy workflow" alt="Copy workflow" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669ed0c2b63b066ba07a185d_ezgif-5-2ab573fa79.gif">
