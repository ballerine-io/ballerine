---
title: FlowsMountOptions
description: FlowsMountOptions interface documentation
layout: ../../../../layouts/MainLayout.astro
---

## Properties

### callbacks

• `Optional` **callbacks**: [`FlowsEventsConfig`](./flows-events-config)

#### Defined in

[BallerineSDK.ts:120](https://github.com/ballerine-io/ballerine/blob/aacaaa6/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L120)

---

### elementId

• `Optional` **elementId**: `string`

**`Description`**

Required if useModal is not used or is set to false. The string id attribute of the element to mount the flow in.

#### Defined in

[BallerineSDK.ts:119](https://github.com/ballerine-io/ballerine/blob/aacaaa6/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L119)

---

### flowName

• **flowName**: `string`

**`Description`**

The object key of the flow to be rendered.

#### Defined in

[BallerineSDK.ts:109](https://github.com/ballerine-io/ballerine/blob/aacaaa6/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L109)

---

### jwt

• `Optional` **jwt**: `string`

**`Description`**

A JWT token to use in the Authorization header. Requires FlowsInitOptions.backendConfig.auth method to be set as 'jwt'

#### Defined in

[BallerineSDK.ts:124](https://github.com/ballerine-io/ballerine/blob/aacaaa6/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L124)

---

### useModal

• `Optional` **useModal**: `boolean`

**`Description`**

A boolean to decide where to mount the flow - if true, the flow will be mounted in the body element.

**`Default`**

false

#### Defined in

[BallerineSDK.ts:115](https://github.com/ballerine-io/ballerine/blob/aacaaa6/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L115)
