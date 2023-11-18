---
title: Interacting with Workflows
description: Interacting with Workflows

---

Once a workflow is defined, you can create instances of it and interact with them in various ways. Each instance of a workflow is unique, with its own ID and context. 

## Workflow Instances

A workflow instance represents an actual execution of a workflow with real data. The instance has its own state context, which is updated as it transitions through different states. This context includes any data that needs to be used or modified throughout the execution of the workflow.

## Sending Events to Workflow Instances

Workflow instances are event-driven. You interact with a workflow instance by sending events to it. These events could be user actions, system notifications, API responses, etc.

When an event is sent to a workflow instance,

---
