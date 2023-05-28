---
title: SDK Translations
description: Learn how to add translations to the UI of the Ballerine SDK
layout: ../../../layouts/MainLayout.astro
---

## Description

The Ballerine SDK's UI is available in English by default. However, you can add translations to the UI by
providing a `translations` object to the [init](/en/api/sdk/flows-init-options) config.

## Configuration

- `remoteUrl` - Alternatively to the `overrides` object you can provide a URL to a remote JSON file
  containing the translations.
- `overrides` - Expects a locale as a key and an object containing the translations for each flow
  step such as `welcome`, and for each of the flow step's text fields such as `title` as a value.

## Code Example

The following API can be used to configure the SDK's [translations](#configuration) - [API reference](/en/api/sdk/flows-translations)

```typescript
import {flows} from '@ballerine/web-ui-sdk';

await flows.init({
  // ...
  translations: {
    // remoteUrl: 'https://example.com/translations.json',
    overrides: {
      en: {
        welcome: {
          title: 'Verify your identity',
          button: 'Choose document type',
          description: 'We need some information to help us confirm \nyour identity.',
          tip: 'Verifying usually takes a few seconds.'
        },
      }
    }
  },
  // ...
})
```
