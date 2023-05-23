---
title: FlowsEventsConfig
description: FlowsEventsConfig interface documentation
layout: ../../../../layouts/MainLayout.astro
---

## Properties

### onFlowComplete

• `Optional` **onFlowComplete**: (`payload`: `IFlowCompletePayload`) => `void`

#### Type declaration

▸ (`payload`): `void`

##### Parameters

| Name      | Type                   |
| :-------- | :--------------------- |
| `payload` | `IFlowCompletePayload` |

##### Returns

`void`

#### Defined in

[BallerineSDK.ts:66](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L66)

---

### onFlowError

• `Optional` **onFlowError**: (`payload`: `IFlowErrorPayload`) => `void`

#### Type declaration

▸ (`payload`): `void`

##### Parameters

| Name      | Type                |
| :-------- | :------------------ |
| `payload` | `IFlowErrorPayload` |

##### Returns

`void`

#### Defined in

[BallerineSDK.ts:68](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L68)

---

### onFlowExit

• `Optional` **onFlowExit**: (`payload`: `IFlowExitPayload`) => `void`

#### Type declaration

▸ (`payload`): `void`

##### Parameters

| Name      | Type               |
| :-------- | :----------------- |
| `payload` | `IFlowExitPayload` |

##### Returns

`void`

#### Defined in

[BallerineSDK.ts:67](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L67)

---

### onFlowNavigationUpdate

• `Optional` **onFlowNavigationUpdate**: (`payload`: `IFlowNavigationUpdatePayload`) => `void`

#### Type declaration

▸ (`payload`): `void`

##### Parameters

| Name      | Type                           |
| :-------- | :----------------------------- |
| `payload` | `IFlowNavigationUpdatePayload` |

##### Returns

`void`

#### Defined in

[BallerineSDK.ts:69](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L69)
