import {flows} from "@ballerine/web-sdk";
import {defaultInitConfig, defaultMountFlowConfig} from "./configs/default-config";

(async () => {
  await flows.init(defaultInitConfig);
  await flows.openModal('my-kyc-flow',  defaultMountFlowConfig);
})();
