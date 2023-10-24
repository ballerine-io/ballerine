---
title: FlowsMountOptions
description: FlowsMountOptions interface documentation

---

## Properties

### callbacks

• `Optional` **callbacks**: [`FlowsEventsConfig`](/en/api/sdk/flows_events_config/)

#### Defined in

[BallerineSDK.ts:134](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L134)

---

### elementId

• `Optional` **elementId**: `string`

**`Description`**

Required if useModal is not used or is set to false. The string id attribute of the element to mount the flow in.

#### Defined in

[BallerineSDK.ts:133](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L133)

---

### flowName

• **flowName**: `string`

**`Description`**

The object key of the flow to be rendered.

#### Defined in

[BallerineSDK.ts:123](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L123)

---

### jwt

• `Optional` **jwt**: `string`

**`Description`**

A JWT token to use in the Authorization header. Requires FlowsInitOptions.backendConfig.auth method to be set as 'jwt'

#### Defined in

[BallerineSDK.ts:138](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L138)

---

### useModal

• `Optional` **useModal**: `boolean`

**`Description`**

A boolean to decide where to mount the flow - if true, the flow will be mounted in the body element.

**`Default`**

false

#### Defined in

[BallerineSDK.ts:129](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L129)
