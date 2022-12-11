---
title: UI Flows
description: UI Flows documentation
layout: ../../../layouts/MainLayout.astro
---

## Package manager

```bash
# pnpm
pnpm add @ballerine/web-sdk

# yarn
yarn add @ballerine/web-sdk

# npm
npm install @ballerine/web-sdk
```

```typescript
import { flows } from '@ballerine/web-sdk';

await flows.init({
  uiConfig: {
    flows: {
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
});

await flows.openModal('my-kyc-flow', {});
```

## CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ballerine SDK</title>

    <script>
      async function onLoad() {
        // BallerineSDK is available as a global variable
        await BallerineSDK.flows.init({
          uiConfig: {
            flows: {
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
        });

        await BallerineSDK.flows.openModal('my-kyc-flow', {});
      }
    </script>
    <script
      defer
      src="https://cdn.ballerine.io/js/1.1.38/ballerine-sdk.umd.js"
      crossorigin="anonymous"
      onload="onLoad()"
    ></script>
  </head>

  <body></body>
</html>
```

## Try in CodeSandbox

<iframe src="https://codesandbox.io/embed/withered-cherry-x2odl1?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="withered-cherry-x2odl1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
