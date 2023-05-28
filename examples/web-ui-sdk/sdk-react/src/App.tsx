import { useCallback, useEffect } from 'react';
import { flows } from '@ballerine/web-ui-sdk';
import { defaultInitConfig, defaultModalFlowConfig } from './configs/default-config';

function App() {
  const startFlow = useCallback(
    async () => await flows.openModal('my-kyc-flow', defaultModalFlowConfig),
    [],
  );

  useEffect(() => {
    (async () => {
      await flows.init(defaultInitConfig);
    })();
  }, []);

  return <button onClick={startFlow}>Start Flow</button>;
}

export default App;
