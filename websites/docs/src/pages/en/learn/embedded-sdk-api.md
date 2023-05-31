---
title: Embedded Flows
description: Embedded flows documentation
layout: ../../../layouts/MainLayout.astro
---

CDN:
Add this code to your index.html header

```javascript
// 1. Add script (see installtion)
// 2. Initialize SDK & flows (see configuration)
BallerineSDK.flows.init({...}).then(() => {
	console.log('flows ready');
	// 3. Mount selected flow on an element
	BallerineSDK.flows.mount('my-kyc-flow', 'flow-host-element', {});
});
// 4. Listen to finish event (see events)
BallerineSDK.flows.on('finish', doSomethingFn)
```

Package Manager:

```javascript
import { flows as ballerineFlows } from '@ballerine/web-ui-sdk';

await ballerineFlows.init({...}).then(() => console.log('flows ready'));
// 3. Mount selected flow on an element
ballerineFlows.mount('my-kyc-flow', 'flow-host-element', {});
// 4. Listen to finish event (see events)
ballerineFlows.on('finish', doSomethingFn)
```
