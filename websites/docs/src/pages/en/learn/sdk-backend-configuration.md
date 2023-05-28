---
title: SDK Backend Configuration
description: Learn how to configure a backend for the Ballerine SDK
layout: ../../../layouts/MainLayout.astro
---

## Description

While we offer our own backend for the Ballerine SDK as a default, you can also configure your own backend in case you already have one or you're just interested in using our UI. This section shows how to configure your own backend.

## Configuration

- `baseUrl` - The URL of the backend to use. Set to `https://api-dev.ballerine.io` by default.
- `auth` - Used to configure the method of authentication such as `jwt` or `cookie`, and the `Authorization` header.
- `endpoints` - Used to configure which endpoints to use for different requests such as starting a verification.

## Code Example

The following API can be used to configure the backend [configuration](#configuration) - [API reference](/en/api/sdk/flows-backend-config)

```typescript
import { flows } from '@ballerine/web-ui-sdk';

await flows.init({
  // ...
  // Default configuration - every property is optional.
  backendConfig: {
    // Prepended to the endpoints below
    baseUrl: 'https://api-dev.ballerine.io',
    auth: {
      method: 'jwt',
      authorizationHeader: 'Bearer [JWT]',
    },
    // Appended to the baseUrl above
    endpoints: {
      getConfig: '/v2/clients/{clientId}/config',
      getVerificationStatus: '/v2/enduser/verify/status/{verificationId}',
      processStepData: '/v2/enduser/verify/partial',
      startVerification: '/v2/enduser/verify',
    },
  },
  // ...
});
```
