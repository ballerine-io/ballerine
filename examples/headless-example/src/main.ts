import './index.css';
import Providers from './components/Providers.svelte';

const app = new Providers({
  target: document.getElementById('app')!,
});

export default app;
