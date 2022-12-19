import {useEffect, useRef} from "react";
import {flows} from "@ballerine/web-sdk";
import {defaultConfig} from "./configs/default-config";

function App() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;

    isMounted.current = true;

    (async () => {
      await flows.init(defaultConfig);
      await flows.mount('my-kyc-flow', 'kyc-host', {
        callbacks: {
          onFlowNavigationUpdate(payload) {
            console.log('onFlowNavigation', payload);
          },
          onFlowExit(payload) {
            console.log('onFlowExit', payload);
          },
          onFlowError: (payload) => {
            console.log('onFlowError', payload);
          },
          onFlowComplete(payload) {
            console.log('onFlowComplete', payload);
          },
        },
      });
    })();
  }, []);


  return (
    <div id="kyc-host"></div>
  )
}

export default App
