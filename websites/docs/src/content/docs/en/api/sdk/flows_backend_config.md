---
title: FlowsBackendConfig
description: FlowsBackendConfig interface documentation

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

[BallerineSDK.ts:103](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L103)

---

### baseUrl

• `Optional` **baseUrl**: `string`

#### Defined in

[BallerineSDK.ts:102](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L102)

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

[BallerineSDK.ts:107](https://github.com/ballerine-io/ballerine/blob/dev/sdks/web-ui-sdk/src/types/BallerineSDK.ts#L107)
