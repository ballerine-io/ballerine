import {flows} from "@ballerine/web-sdk";
import {defaultInitConfig} from "./configs/default-config";

(async () => {
  await flows.init(defaultInitConfig);
})();
