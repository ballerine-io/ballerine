---
title: Getting started
description: How to get started with Ballerine
layout: ../../../layouts/MainLayout.astro
---

## Package Manager

### Installation

```bash

# PNPM
pnpm add @ballerine/web-ui-sdk

# Yarn
yarn add @ballerine/web-ui-sdk

# NPM
npm install @ballerine/web-ui-sdk

```

### Initialization

```typescript
import { flows as ballerineFlows } from '@ballerine/web-ui-sdk';

// 1. Initialize SDK
await ballerineFlows
  .init({
    flows: {
      // 2. Add flows
      'my-kyc-flow': {
        steps: [
          {
            name: 'welcome',
            id: 'welcome',
          },
          {
            name: 'document-selection',
            id: 'document-selection',
            documentOptions: ['id_card', 'drivers_license', 'passport'],
          },
          {
            name: 'document-photo',
            id: 'identity-document-shot',
          },
          {
            name: 'check-document',
            id: 'identity-document-user-check',
          },
          {
            name: 'document-photo-back-start',
            id: 'document-photo-back-start',
          },
          {
            name: 'selfie',
            id: 'selfie',
          },
          {
            name: 'check-selfie',
            id: 'check-selfie',
          },
          {
            name: 'loading',
            id: 'custom-loader',
          },
        ],
      },
    },
  })
  .then(() => console.log('flows ready'));

// 3. Mount selected flow on an element
ballerineFlows.mount('my-kyc-flow', 'flow-host-element', {
  // 4. Listen to the flow completed event (see events)
  callbacks: {
    onFlowComplete: data => {
      console.log('Flow completed', data);
    },
  },
});
```

## CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ballerine</title>

    <script
      src="https://cdn.ballerine.io/js/1.1.38/ballerine-sdk.umd.js"
      crossorigin="anonymous"
    ></script>
  </head>

  <body>
    <!-- Same id as passed into mount below -->
    <div id="kyc-host"></div>

    <script>
      // 1. Initialize SDK
      BallerineSDK.flows
        .init({
          endUserInfo: {
            id: 'test-id',
          },
          uiConfig: {
            general: {
              colors: {
                primary: '#1F9F31',
              },
              fonts: {
                name: 'Inter',
                link: 'https://fonts.googleapis.com/css2?family=Inter:wght@500',
                weight: [500, 700],
              },
            },
            flows: {
              // 2. Add flows
              'my-kyc-flow': {
                steps: [
                  {
                    name: 'welcome',
                    id: 'welcome',
                  },
                  {
                    name: 'document-selection',
                    id: 'document-selection',
                    documentOptions: ['id_card', 'drivers_license', 'passport'],
                  },
                  {
                    name: 'document-photo',
                    id: 'document-photo',
                  },
                  {
                    name: 'check-document',
                    id: 'check-document',
                  },
                  {
                    name: 'document-photo-back-start',
                    id: 'document-photo-back-start',
                  },
                  {
                    name: 'document-photo-back',
                    id: 'document-photo-back',
                  },
                  {
                    name: 'check-document-photo-back',
                    id: 'check-document-photo-back',
                  },
                  {
                    name: 'selfie-start',
                    id: 'selfie-start',
                  },
                  {
                    name: 'selfie',
                    id: 'selfie',
                  },
                  {
                    name: 'check-selfie',
                    id: 'check-selfie',
                  },
                  {
                    name: 'loading',
                    id: 'loading',
                  },
                  {
                    name: 'final',
                    id: 'final',
                  },
                ],
              },
            },
          },
        })
        .then(() => {
          // 3. Mount selected flow on an element
          BallerineSDK.flows.mount('my-kyc-flow', 'kyc-host', {
            // 4. Listen to the flow completed event (see events)
            callbacks: {
              onFlowComplete: data => {
                console.log('Flow completed', data);
              },
            },
          });
        });
    </script>
  </body>
</html>
```

## Try in CodeSandbox

<iframe 
	src="https://codesandbox.io/embed/withered-cherry-x2odl1?fontsize=14&hidenavigation=1&theme=dark"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="withered-cherry-x2odl1"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
