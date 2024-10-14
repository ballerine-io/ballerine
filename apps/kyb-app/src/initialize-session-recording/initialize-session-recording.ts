import { env } from '@/env/env';
import { init as initSaola } from '@saola.ai/browser';

export const initializeSessionRecording = () => {
  // @TODO: Uncomment when Saola tests are production ready
  // if (window.location.host.includes('127.0.0.1') || window.location.host.includes('localhost')) {
  //   return;
  // }

  const saolaApiKey = env.VITE_SAOLA_API_KEY;

  if (saolaApiKey) {
    initSaola(saolaApiKey);
  }
};
