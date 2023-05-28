---
title: SDK Events
description: Learn how to use the Ballerine SDK events callbacks
layout: ../../../layouts/MainLayout.astro
---

## Description

An SDK flow has a number of events that may occur such as flow error, or flow step navigation. This section shows how you can listen to these events and execute logic when they occur.

## Events

- `onFlowComplete` - Fires at the last step of the flow.
- `onFlowError` - Fires when an error occurs in the flow.
- `onFlowExit` - Fires when the flow is exited (i.e via close button).
- `onFlowNavigationUpdate` - Fires when moving to the next or previous flow step.

## Code Example

The following API can be used to listen to the flow [events](#events) - [API reference](/en/api/sdk/flows-events-config)

```typescript
import { flows } from '@ballerine/web-ui-sdk';

await flows.mount({
  // ...
  elementId: 'my-kyc-flow',
  callbacks: {
      onFlowComplete: (data) => {
        console.log('Flow complete', data);
      },
      onFlowExit: (data) => {
        console.log('Flow exit', data);
      },
      onFlowError: (data) => {
        console.log('Flow error', data);
      },
      onFlowNavigationUpdate: (data) => {
        console.log('Flow navigation update', data);
      },
  },
  // ...
})
```
