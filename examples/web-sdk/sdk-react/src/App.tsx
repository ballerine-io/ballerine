import { useEffect, useRef } from 'react';
import { flows } from '@ballerine/web-sdk';
import { defaultInitConfig, defaultModalConfig } from './configs/default-config';

function App() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;

    isMounted.current = true;

    (async () => {
      await flows.init(defaultInitConfig);
      await flows.openModal('my-kyc-flow', defaultModalConfig);
    })();
  }, []);

  return null;
}

export default App;
