---
title: SDK UI Configuration
description: Learn how to configure the UI of the Ballerine SDK
layout: ../../../layouts/MainLayout.astro
---

## Description

The Ballerine SDK exposes ways of customizing its colors, fonts, UI components, and more. This
section covers some of the available options.

## General

The `uiConfig.general` property allows changing the SDK's font, colors, and padding. - [API reference](/en/api/sdk/flows-init-options/#uiconfig)

```typescript
import {flows} from '@ballerine/web-sdk';

await flows.init({
  // ...
  uiConfig: {
    general: {
      padding: '1rem',
      primary: '#000',
      fonts: {
        name: 'Roboto',
        link: 'https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap',
        weight: [500, 700],
      },
    },
  }
  // ...
})
```

## Components

The `uiConfig.components` property allows changing the styling of specific UI components such as `button` or `title` using kebab-case CSS properties. - [API reference](/en/api/sdk/flows-init-options/#uiconfig)

```typescript
import {flows} from '@ballerine/web-sdk';

await flows.init({
  // ...
  uiConfig: {
    components: {
      button: {
        // Note border-radius and not borderRadius
        'border-radius': '41px',
      },
      layout: {
        background: '#fff',
      },
      title: {
        'font-size': '20px',
        'text-align': 'left',
        color: '#001B39',
        padding: '11px 0px 18px 26px',
      },
    },
  }
  // ...
})
```

## UI Packs

UI packs are a set of complete bundles of styles, assets and translations which can be supplied via a name or a URL. - [API reference](/en/api/sdk/flows-init-options/#uiconfig)

```typescript
import {flows} from '@ballerine/web-sdk';

await flows.init({
  // ...
  uiConfig: {
    uiPack: 'future'
  }
  // ...
})

```
