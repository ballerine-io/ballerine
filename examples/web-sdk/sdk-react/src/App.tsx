import { useCallback, useEffect } from 'react';
import { flows } from '@ballerine/web-sdk';
import { rioInitConfig, rioModalConfig } from './configs/rio-config';

function App() {
  const startFlow = useCallback(
    async () => await flows.openModal('my-kyc-flow', rioModalConfig),
    [],
  );

  useEffect(() => {
    (async () => {
      await flows.init(rioInitConfig);
    })();
  }, []);

  return <button onClick={startFlow}>Start Flow</button>;
}

export default App;
