---
title: BallerineSDKFlows
description: SDK API documentation
layout: ../../../../layouts/MainLayout.astro
---

## Properties

### init

• **init**: (`config`: [`FlowsInitOptions`](../flows-init-options)) => `Promise`<`void`\>

#### Type declaration

▸ (`config`): `Promise`<`void`\>

**`Description`**

Initializes the SDK

##### Parameters

| Name     | Type                                        | Description                             |
| :------- | :------------------------------------------ | :-------------------------------------- |
| `config` | [`FlowsInitOptions`](../flows-init-options) | The initialization configuration object |

##### Returns

`Promise`<`void`\>

Promise<void>

#### Defined in

[BallerineSDK.ts:138](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-sdk/src/types/BallerineSDK.ts#L138)

---

### mount

• **mount**: (`flowName`: `string`, `elementId`: `string`, `config`: [`FlowsMountOptions`](../flows-mount-options)) => `Promise`<`void`\>

#### Type declaration

▸ (`flowName`, `elementId`, `config`): `Promise`<`void`\>

**`Description`**

Mounts the flow in the specified element

##### Parameters

| Name        | Type                                          | Description                                 |
| :---------- | :-------------------------------------------- | :------------------------------------------ |
| `flowName`  | `string`                                      | The object key of the flow to be rendered   |
| `elementId` | `string`                                      | The id of the element to render the flow in |
| `config`    | [`FlowsMountOptions`](../flows-mount-options) | The mount configuration object              |

##### Returns

`Promise`<`void`\>

Promise<void>

#### Defined in

[BallerineSDK.ts:146](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-sdk/src/types/BallerineSDK.ts#L146)

---

### openModal

• **openModal**: (`flowName`: `string`, `config`: [`FlowsMountOptions`](../flows-mount-options)) => `void`

#### Type declaration

▸ (`flowName`, `config`): `void`

**`Description`**

Opens the flow in a modal

##### Parameters

| Name       | Type                                          | Description                               |
| :--------- | :-------------------------------------------- | :---------------------------------------- |
| `flowName` | `string`                                      | The object key of the flow to be rendered |
| `config`   | [`FlowsMountOptions`](../flows-mount-options) | The mount configuration object            |

##### Returns

`void`

Promise<void>

#### Defined in

[BallerineSDK.ts:153](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-sdk/src/types/BallerineSDK.ts#L153)

---

### setConfig

• **setConfig**: (`config`: [`FlowsInitOptions`](../flows-init-options)) => `Promise`<`void`\>

#### Type declaration

▸ (`config`): `Promise`<`void`\>

**`Description`**

Initializes the SDK

##### Parameters

| Name     | Type                                        | Description                             |
| :------- | :------------------------------------------ | :-------------------------------------- |
| `config` | [`FlowsInitOptions`](../flows-init-options) | The initialization configuration object |

##### Returns

`Promise`<`void`\>

Promise<void>

#### Defined in

[BallerineSDK.ts:159](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-sdk/src/types/BallerineSDK.ts#L159)
