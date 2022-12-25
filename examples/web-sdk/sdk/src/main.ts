import {flows} from "@ballerine/web-sdk";
import {defaultMountFlowConfig} from "./configs/default-config";

const startFlow = async () => {
  await flows.mount('my-kyc-flow', 'my-kyc-host', defaultMountFlowConfig);
}

document.getElementById('app')!.innerHTML = `
   <div id="my-kyc-host">
    <button id="start-flow">Start Flow</button>
   </div>
`

document.getElementById('start-flow')!.addEventListener('click', startFlow);
