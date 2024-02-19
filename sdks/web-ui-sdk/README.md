# Web SDK Flows

### Description

Web SDK Flows can generate custom made, branded flows to collect KYC/KYB documents and user information.
The SDK UI is embeddable inside existing apps or deployed as an webapp.

<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/phones.png">

**Why you should use Ballerine's flows:**

- Pre-made KYC/KYB templates.
- Customizable UI and flow to fit your desired experience and brand.
- Ability to use different vendors in the backend over the same flow with.
- Multi platform support (Desktop, mobile web, mobile native).
- All camera and different devices edge cases covered and tested.
- Small and fast, built with Svelte (less than 50kb gzipped).

Live examples:
[KYC 1](https://simple-kyc-demo.ballerine.app/), [KYC 2](https://simple-kyc-demo.ballerine.app/), [KYB](https://simple-kyc-demo.ballerine.app/)

Demo project:
[View in jsfiddle](https://jsfiddle.net/ballerine/7d0g53xn)

---

<details><summary>Some examples of what you can do with it</summary>
-  Create a custom flow you can use with any identity verification vendor.
-  Create a custom flow that your customers can receive in an SMS.
-  Create different types of flows for different types of customers.
- And more...
</details>

---

### Getting Started

#### Installation

<ins>CDN:</ins>

Add this code to your index.html header

```html
<script
  async
  src="https://cdn.ballerine.io/1.1.22/ballerine-sdk.umd.min.js"
  integrity="sha384-cHxaE8mk7COVrdyKoDw4cdPC6PLoMItItHZ+LwA18bDaiWJLxV2f2zyVf6Q9Vtww"
  crossorigin="anonymous"
  type="module"
></script>
```

<ins>Package Managers:</ins>

```javascript
# NPM
npm install --save @ballerine/web-ui-sdk
# Yarn
yarn add @ballerine/web-ui-sdk
# PNPM
pnpm add @ballerine/web-ui-sdk
```

#### Flows API

| Config Parameter | Type                                         | Description                                               |
| ---------------- | -------------------------------------------- | --------------------------------------------------------- |
| `uiConfig`       | [FlowsUIConfig](#ui-configuration)           | Initializing flows, preloading needed assets and ui packs |
| `endUserInfo`    | [EndUserInfo]()                              | Use data like ID, name etc..                              |
| `backendConfig`  | [FlowsBackendConfig](#backend-configuration) | Backend endpoint the flows should interact with           |
| `translations`   | [FlowsTranslations](#translations)           | Change the config after init function                     |

#### Embedded Flows

CDN:
Add this code to your index.html header

```javascript
// 1. Add script (see installation)
// 2. Initialize SDK & flows (see configuration)
BallerineSDK.flows.init({...}).then(() => {
	console.log('flows ready');
	// 3. Mount selected flow on an element
	BallerineSDK.flows.mount('my-kyc-flow', 'flow-host-element', {});
});
// 4. Listen to finish event (see events)
BallerineSDK.flows.on('finish', doSomethingFn)
```

[example folder]()

Package Manager:

```javascript
import { flows as ballerineFlows } from '@ballerine/web-ui-sdk';

await ballerineFlows.init({...}).then(() => console.log('flows ready'));
// 3. Mount selected flow on an element
ballerineFlows.mount('my-kyc-flow', 'flow-host-element', {});
// 4. Listen to finish event (see events)
ballerineFlows.on('finish', doSomethingFn)
```

[example folder]()

#### Standalone/Iframe Flows

Code example:

```html
<script
  src="https://cdn.ballerine.io/1.1.22/ballerine-sdk.umd.min.js"
  integrity="sha384-cHxaE8mk7COVrdyKoDw4cdPC6PLoMItItHZ+LwA18bDaiWJLxV2f2zyVf6Q9Vtww"
  crossorigin="anonymous"
  type="module"
></script>
<script>
  	const initConfig = {
  		"flows": { "my-kyc-flow": {
  		    "steps": [
  			{"name": "welcome", "id": "welcome" },
  			{ "name": "document-selection", "id": "document-selection",
  			    "documentOptions": ["id_card", "drivers_license", "passport"]},
  			{ "name": "document-photo", "id": "identity-document-shot" },
  			{ "name": "check-document", "id": "identity-document-user-check" },
  			{ "name": "document-photo-back-start", "id": "document-photo-back-start"},
  			{ "name": "selfie", "id": "selfie"},
  			{ "name": "check-selfie", "id": "check-selfie" },
  			{ "name": "loading", "id": "custom-loader" }
  		    ]}
  		}
  	}
  	BallerineSDK.flows.init(initConfig).then(() => {
  		BallerineSDK.flows.mount('my-kyc-flow', 'flow-host-element', {});
  	});
  }
</script>
```

#### Native Mobile apps

The approach to native apps are all the native functionalities happens inside Ballerine native sdks (Android, iOS) while and the representation layer is still an web app (inside a native webview).

This way we can enjoy both worlds:

- Web UI: Flexible UI that can be changes instantly from the server (no app deployments or store submissions).
- Native API's: Native camera, deep behavioral analysis, ekyc and more..

See Android and iOS repositories for guidance:

[Android SDK](https://github.com/ballerine-io/ballerine-android-sdk) | [iOS SDK](https://github.com/ballerine-io/ballerine-ios-sdk)

---

### Customization

Customize the UI, the flow's steps and the backend.

<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/flow.png">

#### Flows Configuration

Flow Initialization:

```
BallerineSDK.flows.init([CONFIG])
```

| Config Parameter | Type                                         | Description                                               |
| ---------------- | -------------------------------------------- | --------------------------------------------------------- |
| `uiConfig`       | [FlowsUIConfig](#ui-configuration)           | Initializing flows, preloading needed assets and ui packs |
| `endUserInfo`    | [EndUserInfo]()                              | Use data like ID, name etc..                              |
| `backendConfig`  | [FlowsBackendConfig](#backend-configuration) | Backend endpoint the flows should interact with           |
| `translations`   | [FlowsTranslations](#translations)           | Change the config after init function                     |

Running a flow:

```
BallerineSDK.flows.mount('my-flow', elementId, [CONFIG]);
// or
BallerineSDK.flows.openModal('my-flow', [CONFIG]);
```

| Config Parameter | Type                                          | Description                                       |
| ---------------- | --------------------------------------------- | ------------------------------------------------- |
| `callbacks`      | [FlowsCallbacksConfig](#flowscallbacksconfig) | An object containing callback methods (see below) |

##### FlowsCallbacksConfig:

| Config Parameter         | Type                         | Description                                                                  |
| ------------------------ | ---------------------------- | ---------------------------------------------------------------------------- |
| `onFlowComplete`         | IFlowCompletePayload         | User completed the flow                                                      |
| `onFlowExit`             | IFlowExitPayload             | User quits the flow (back button on the first page or pressed close buttons) |
| `onFlowError`            | IFlowErrorPayload            | Unexpected errors                                                            |
| `onFlowNavigationUpdate` | IFlowNavigationUpdatePayload | User moved between steps                                                     |

---

#### UI Configuration

**Flows UI can be configured in three levels:**

1. Theme and theme styles

| Config Parameter | Type                   | Description                                                      |
| ---------------- | ---------------------- | ---------------------------------------------------------------- |
| `uiPack`         | `string` - Name or URL | Ui Pack is a complete bundles of styles, assets and translations |
| `theme.general`  | FlowsGeneralTheme      | General colors, paddings, fonts..                                |

2. General components styles (**overrides theme**)

| Config Parameter  | Type              | Description          |
| ----------------- | ----------------- | -------------------- |
| `theme.layout`    | FlowsGeneralTheme | Global layout css    |
| `theme.paragraph` | FlowsGeneralTheme | Global paragraph css |
| `theme.button`    | FlowsGeneralTheme | Global button css    |

... See more

3. Specific step component style (**overrides theme & general component style**)

| Config Parameter               | Type           | Description                                            |
| ------------------------------ | -------------- | ------------------------------------------------------ |
| `theme.flows['FlowName'].step` | ICSSProperties | Step includes style object and styles for each element |

... See more

As the level is lower it will override the upper ones

---

#### Translations

| Config Parameter | Type                     | Description                                          |
| ---------------- | ------------------------ | ---------------------------------------------------- |
| `remoteUrl`      | `string (URL)`           | Get a full translation json from remote url          |
| `overrides`      | `Record<string, string>` | Override default translations or remote translations |

---

#### Backend Configuration

| Config Parameter | Type           | Description                          |
| ---------------- | -------------- | ------------------------------------ |
| `baseUrl`        | `string (URL)` | Backend base URL                     |
| `auth`           | BEAuthConfig   | Auth method and Authorization header |
| `endpoints`      | BEEndpoints    | List of endpoints for each action    |

---
