
<div align="center">

<a href="https://ballerine.io" title="Ballerine - Open-source Infrastructure for Identity and Risk management.">
    <img src="https://blrn-imgs.s3.eu-central-1.amazonaws.com/github/ballerine-logo.png" alt="Ballerine's website">
</a>

# Ballerine is an Open-source Infrastructure for User Identity and Risk Management

<h5>This project's mission is to help any company verify its customers’ identity while providing an amazing user experience.</h5>
</div>


## Description
Ballerine is an open-source infrastructure for user identity and risk management.
Compose verification processes for any vertical and geography using modular building blocks, components, and 3rd party integrations.

_____
	
### Why Open Source KYC/KYB & Risk stack?

Our mission is to allow any company to manage user identity and risk in a way that suits them and their unique changing needs, and be a part of a community which builds solutions together.
Main Open Source benefits:
*  **Future proof** - modular and extendable building blocks.
*  **Global** - Multiple vendors accessible in one UI and case management dashboard.
*  **White label** - Customizable UX and UI.
*  **Community** - Use what others have built, contribute yourself, leverage community maintainance.
___


### What can you find in this project?
 * KYC/KYB flows and UI in Mobile and web SDKs for user data and document collection - :white_check_mark: Available & Open Source! - [view details](https://github.com/ballerine-io/ballerine-web-ui/blob/staging/README.md#web-sdk)
 * Case management dashboard for users approval/rejection - 🎉 Final stages of Open Sourcing!
 * Identity & risk vendors orchestration - :hourglass_flowing_sand: Almost done
 * No-code rule engine to control Frontend and backend flows - :construction: WIP
 
[See Detailed Roadmap](#roadmap)

Join our mailing list to you know whenever we release something (like liveliness or the case management back office).

<a href="https://www.ballerine.io/mailing-list" title="Ballerine - Request Access">
    <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>

___

<details><summary>See some examples of what you can do with it</summary>


-  Use different vendors for different audiences - all modules are 100% vendor agnostic.
-  Create your own low-cost KYC with AWS Rekognize, Googel vision and other ML tools.
-  Collect documents in a KYB flow.
-  Implement and modify a case management for user approval/rejection.

And more.
</details>

___

## Table of Contents

- [Description](#description)
  * [Table of Contents](#table-of-contents)
    + [Roadmap](#roadmap)
      - [General](#general)
      - [Onboarding Suite (KYC/KYB/General Document Collection)](#onboarding-suite--kyc-kyb-general-document-collection-)
      - [Risk Suite](#risk-suite)
  * [Web SDK](#web-sdk)
    + [Getting Started](#getting-started)
      - [Installation](#installation)
      - [Embedded](#embedded)
      - [Selfhost](#selfhost)
      - [Mobile Webview](#mobile-webview)
      - [Customization options](#customization)
      - [Example project](#example-project)
      - [Online Demo](#online-demo)
      - [Customization](#customization-1)
      - [This Project is Still in Beta](#this-project-is-still-in-beta)
    + [What you can find here?](#what-you-can-find-here-)
    + [Why Open Source KYC?](#why-open-source-kyc-)
  * [Preview](#preview)
    + [Modular UI](#modular-ui)
    + [Case management](#case-management)
    + [Workflow builder & Rule engine](#workflow-builder---rule-engine)
    + [High-Level Architecture](#high-level-architecture)
      - [We are still in Beta](#we-are-still-in-beta)


# Web SDK Flows

### Description
Web SDK Flows can generate custom made, branded flows to collect KYC/KYB documents and user information.
The SDK UI is embeddable inside exsiting apps or deployed as an webapp.

<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/phones.png">

**Why you should use Ballerine's flows:**
* Pre-made KYC/KYB templates.
* Customizable UI and flow to fit your desired experience and brand.
* Ability to use different vendors in the backend over the same flow with.
* Multi platform support (Desktop, mobile web, mobile native).
* All camera and different devices edge cases covered and tested.
* Small and fast, built with Svelte (less than 50kb gzipped).

Live examples:
[KYC 1](https://simple-kyc-demo.ballerine.app/), [KYC 2](https://simple-kyc-demo.ballerine.app/), [KYB](https://simple-kyc-demo.ballerine.app/)

Demo project:
[View in jsfiddle](https://jsfiddle.net/ballerine/7d0g53xn)

___

<details><summary>Some examples of what you can do with it</summary>
-  Create a custom flow you can use with any identity verification vendor.
-  Create a custom flow that your customers can receive in an SMS.
-  Create different types of flows for different types of customers.
- And more...
</details>

___

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
npm install --save @ballerine/web-sdk
# Yarn
yarn add @ballerine/web-sdk
# PNPM
pnpm add @ballerine/web-sdk
```

#### Flows API
| Config Parameter | Type | Description|
| - | - | - |
| `uiConfig` | [FlowsUIConfig](#ui-configuration) |Initilazing flows, preloading needed assets and ui packs|
| `endUserInfo` | [EndUserInfo]()| Use data like ID, name etc.. |
| `backendConfig`  | [FlowsBackendConfig](#backend-configuration) |Backend endpoint the flows should interact with|
| `translations` | [FlowsTranslations](#translations) | Change the config after init function|


#### Embedded Flows
CDN:
Add this code to your index.html header
```javascript
// 1. Add script (see installtion)
// 2. Initialize SDK & flows (see configuration)
BallerineSDK.flows.init({...}).then(() => {
	console.log('flows ready');
	// 3. Mount selected flow on an element
	BallerineSDK.flows.mount('flow-host-element', 'my-kyc-flow', {});
});
// 4. Listen to finish event (see events)
BallerineSDK.flows.on('finish', doSomethingFn)
```
[example folder]()

Package Manager:
```javascript
import { flows as ballerineFlows } from '@ballerine/web-sdk';

await ballerineFlows.init({...}).then(() => console.log('flows ready'));
// 3. Mount selected flow on an element
ballerineFlows.mount('flow-host-element', 'my-kyc-flow', {});
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
		BallerineSDK.flows.mount('flow-host-element', 'my-kyc-flow', {});
	});	
}
</script>
```

#### Native Mobile apps

The approch to native apps are all the native funcationalties happens inside Ballerine native sdks (Android, iOS) while and the represenation layer is still an web app (inside a native webview).

This way we can enjoy both worlds:
* Web UI: Flexable UI that can be changes instantly from the server (no app deployments or store submissions). 
* Native API's: Native camera, deep behavioral analysis, ekyc and more..

See Android and iOS repositories for guidance:

[Android SDK](https://github.com/ballerine-io/ballerine-android-sdk) | [iOS SDK](https://github.com/ballerine-io/ballerine-ios-sdk)

___
### Customization

Customize the UI, the flow's steps and the backend.

<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/flow.png">

#### Flows Configuration
Flow Initilzation:
 ```
 BallerineSDK.flows.init([CONFIG])
 ```

| Config Parameter | Type | Description|
| - | - | - |
| `uiConfig` | [FlowsUIConfig](#ui-configuration) |Initilazing flows, preloading needed assets and ui packs|
| `endUserInfo` | [EndUserInfo]()| Use data like ID, name etc.. |
| `backendConfig`  | [FlowsBackendConfig](#backend-configuration) |Backend endpoint the flows should interact with|
| `translations` | [FlowsTranslations](#translations) | Change the config after init function|

Running a flow:
 ```
BallerineSDK.flows.mount(elementId, 'my-flow', [CONFIG]);
// or
BallerineSDK.flows.openModal('my-flow', [CONFIG]);
 ```
	
| Config Parameter | Type | Description|
| - | - | - |
| `callbacks` | [FlowsCallbacksConfig](#flowscallbacksconfig) |An object contaning callback methods (see below)|

##### FlowsCallbacksConfig:
| Config Parameter | Type | Description|
| - | - | - |
| `onFlowComplete` | IFlowCompletePayload |User completed the flow|
| `onFlowExit` | IFlowExitPayload |User quits the flow (back button on the first page or pressed close buttons)|
| `onFlowError` | IFlowErrorPayload |Unexpected errors|
| `onFlowNavigationUpdate` | IFlowNavigationUpdatePayload |User moved between steps|
___
#### UI Configuration
**Flows UI can be configured in three levels:**
1. Theme and theme styles

| Config Parameter | Type | Description|
| - | - | - |
| `uiPack` | `string` - Name or URL |Ui Pack is a complete bundles of styles, assets and translations|
| `theme.general` | FlowsGeneralTheme |General colors, paddings, fonts..|

2. General components styles (**overrides theme**)

| Config Parameter | Type | Description|
| - | - | - |
| `theme.layout` | FlowsGeneralTheme |Global layout css
| `theme.paragraph` | FlowsGeneralTheme |Global paragraph  css
| `theme.button` | FlowsGeneralTheme |Global button  css
... See more

3. Speceifc step component style (**overrides theme & general component style**)

| Config Parameter | Type | Description|
| - | - | - |
| `theme.flows['FlowName'].step` | ICSSProperties | Step inculdes style object and styles for each element
... See more

As the level is lower it will overide the upper ones
___
#### Translations

| Config Parameter | Type | Description|
| - | - | - |
| `remoteUrl` | `string (URL)` | Get a full translation json from remote url
| `overrides` | `Record<string, string>` |Overide default translations or remote translations

___
#### Backend Configuration

| Config Parameter | Type | Description|
| - | - | - |
| `baseUrl` | `string (URL)` | Backend base URL
| `auth` | BEAuthConfig | Auth method and Autorization header
| `endpoints` | BEEndpoints | List of endpoints for each action
-----



# Case management (soon Open Source)


### Description
Give your operating team Ballerine’s case management dashboard so they can approve or reject users, initiate workflows for document re-upload or escalate cases to others in the company. 

* A case management dashboard to approve, reject or classify users manually.
* Create workflows operators can trigger from the interface.
* Optimize manual work by customizing the layouts and information presented.
* Use as standalone tool or embed in your existing dashboard.

<br/>

> *We are working on releasing our case management dashboard as Open-Source. Join our mailing list in the button below to get an update once it's out.*	
> <a href="https://www.ballerine.io/mailing-list" title="Ballerine - Request Access">
> <br/>
> <br/>
 >   <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>


<br/>

<img src="https://blrn-imgs.s3.eu-central-1.amazonaws.com/github/dashboard.png">

___

# Workflow builder & Rule engine (WIP)


### Description
Customize your identity and risk workflows in code or with a low-code platform non-tchnical staff can play with.

* Test out different vendor to optmize convertion and costs.
* Utilize data sources and tools contributed by Ballerine or the community.
* Visualize complex flows to provide observability of how things work to the rest of the company.

<br/>

> *Our rule engine is still in development. Join our mailing list in the button below to get an update once it's out.*	
> <a href="https://www.ballerine.io/mailing-list" title="Ballerine - Request Access">
> <br/>
> <br/>
 >   <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>


<br/>


<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/rule%20engine.png">

 
# High-Level Architecture

Ballerine's architecture is flexible and composable.

**Components**

Components are independent and reusable frontend or backend pieces of configuration, code, or connectors.
Each component can be plugged into the infrastructure and used by the underlying building blocks.

**Apps** 

Apps bundle are a set of components and connectors that serve a specific use case (like KYC/KYB).
	
**Connectors** 

Connectors are integrations to 3rd party vendors. They can be generated with an OpenAPI spec automatically or be built following a predefined interface.
<br/>
<br/>

<img src="https://blrn-imgs.s3.eu-central-1.amazonaws.com/github/diagram.png">

<br/>


### Roadmap

You can create feature requests and upvote existing ones to tell us what we should work on next in [here](https://ballerine.canny.io/)

#### General
- [ ] Documentation Portal
- [ ] Roadmap Community Voting System

#### Onboarding Suite (KYC/KYB/General Document Collection)
*Please use the voting system if you think we should prioritize higher a specific chunk*

* [ ] SDKs *(WIP)*
	- [x] ~~Open sourcing Web SDK~~
		- [x] ~~UI Customization~~
		- [x] ~~Flow Customization~~		 
		- [x] ~~Document collection~~
		- [x] ~~Selfie~~
		- [x] ~~KYC/B Templates~~
		- [x] ~~Vendor/Backend Agnostic~~
        - [ ] Web liveliness step 
	- [x] Open sourcing Android SDK 
		- [x] ~~Webview Integration~~
		- [x] ~~Native Camera Option~~
		- [ ] Native liveliness *(WIP)*
	- [ ] Open sourcing  iOS SDK *(WIP)*
		- [x] ~~Webview Integration~~
		- [x] ~~Native Camera Option~~
* [ ] Backoffice
	- [ ] Open Sourcing Case Managment 
		- [x] User Approval Queues
		- [ ] Operator Collaborations 
		- [x] Backend Agnostic
		- [x] Vendor Agnostic
		- [ ] Transaction Approval Queues 
* [ ] Dashboard
	- [ ] Data pipelines (Orchestrator) *(WIP)* 
		- [ ] Plugin System
		- Integrations
			- [x] Veriff
			- [x] AWS Rekognize
				- [x] Face Match API
				- [x] Document Classfication
			- [ ] Google Vision
				- [ ] Document Classification
				- [x] Vision OCR
	- [ ] No-Code Flow Builder - [Upvote](https://www.example.com)

#### Risk Suite
*Please use the voting system if you think we should prioritize higher a specific chunk*
* [ ] SDKs *(WIP)*
	- [x] ~~Open sourcing Web SDK~~
		- [ ] Behavior data for fraud detection *(WIP)* - [Upvote](https://www.example.com)
		- [ ] Risk Based KYC/Step up KYC Templates *(WIP)* - [Upvote](https://www.example.com)
	- [x] Open sourcing Android SDK 
		- [ ] Behavior data for fraud detection *(WIP)* - [Upvote](https://www.example.com)
	- [ ] Open sourcing  iOS SDK *(WIP)* - [Upvote](https://www.example.com)
		- [x] ~~Webview Integration~~
		- [x] ~~Native Camera Option~~
* [ ] Backoffice - [Upvote](https://www.example.com)
	- [ ] Open Sourcing Case Managment - [Upvote](https://www.example.com)
		- [ ] Operator Collaborations - [Upvote](https://www.example.com)
		- [ ] Transaction Approval Queues - [Upvote](https://www.example.com)
* [ ] Dashboard
	- [ ] Data pipelines (Orchestrator) *(WIP)* - [Upvote](https://www.example.com)
		- Integrations
			- [ ] AWS
				- Fraud Detection
					- [ ] Account Take Over
	- [ ] Rule/Risk Engine *(WIP)* - [Upvote](https://www.example.com)


#### Get to know when we release more parts


Leave us your email on our mailing list and we'll let you know whenever we release a feature or improvement (like liveliness on the camera or the case management back office).

<a href="https://www.ballerine.io/mailing-list" title="Ballerine - Request Access">
    <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>

___
<i>As you can see, most apps and packages are still private git submodules. We are working on migrating them to this monorepo.</i>\
<i>If you already want to start using them or want to get involved - reach out to us at [oss@ballerine.io](mailto:oss@ballerine.io).</i>
