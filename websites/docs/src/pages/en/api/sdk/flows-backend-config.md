---
title: FlowsBackendConfig
description: FlowsBackendConfig interface documentation
layout: ../../../../layouts/MainLayout.astro
---

## Properties

### auth

• `Optional` **auth**: `Object`

#### Type declaration

| Name                   | Type                               |
| :--------------------- | :--------------------------------- |
| `authorizationHeader?` | `string`                           |
| `method?`              | `"jwt"` \| `"basic"` \| `"cookie"` |

#### Defined in

[BallerineSDK.ts:86](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L86)

---

### baseUrl

• `Optional` **baseUrl**: `string`

#### Defined in

[BallerineSDK.ts:85](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L85)

---

### endpoints

• `Optional` **endpoints**: `Object`

#### Type declaration

| Name                     | Type     |
| :----------------------- | :------- |
| `getConfig?`             | `string` |
| `getVerificationStatus?` | `string` |
| `processStepData?`       | `string` |
| `startVerification?`     | `string` |

#### Defined in

[BallerineSDK.ts:90](https://github.com/ballerine-io/ballerine/blob/ec0b014/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L90)
