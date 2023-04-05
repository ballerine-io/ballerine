import './style.css';
import { createMachine, interpret } from 'xstate';
import { manualReview, onboardingClientCollectData } from './machines/ballerine.sample';
import { inspect } from '@xstate/inspect';
import { fetchMachine } from './machines/fetch.machine';

const xstates = {
  manReview: manualReview,
  onboarding: onboardingClientCollectData,
  fetchMachine: fetchMachine,
};

type InspectedMachine = {
  cleanup: () => void;
};
let activeInspectionMachine: InspectedMachine = { cleanup: () => {} };

const loadMachine = (cfg: any): InspectedMachine => {
  inspect({
    // iframe: () => document.querySelector('iframe[data-xstate]') as HTMLIFrameElement,
    url: 'https://stately.ai/viz?inspect',
  })!;

  const machine = createMachine(cfg as any);

  const service = interpret(machine, { devTools: true });
  service.start();

  return {
    cleanup: () => {
      service.stop();
    },
  };
};

loadMachine(manualReview);

const allButtons = document.querySelectorAll('[ballerine-machine]');

allButtons.forEach(b => {
  b.addEventListener('click', () => {
    activeInspectionMachine.cleanup();
    const machineId = b.getAttribute('ballerine-machine') as keyof typeof xstates;
    const machineCfg = xstates[machineId];

    activeInspectionMachine = loadMachine(machineCfg);
  });
});
