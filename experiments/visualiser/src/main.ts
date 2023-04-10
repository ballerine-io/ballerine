import './style.css';
import { createMachine, interpret } from 'xstate';
import { manualReview, onboardingClientCollectData } from './machines/ballerine.sample';
import { inspect } from '@xstate/inspect';
import { fetchMachine } from './machines/fetch.machine';

const stateMachineConfigs = {
  manReview: manualReview,
  onboarding: onboardingClientCollectData,
  fetchMachine: fetchMachine,
};

type InspectedMachine = {
  cleanup: () => void;
};

const loadMachine = (cfg: any): InspectedMachine => {
  inspect({})!;

  const machine = createMachine(cfg as any);

  const service = interpret(machine, { devTools: true });
  service.start();

  return {
    cleanup: () => {
      service.stop();
    },
  };
};
let activeInspectionMachine: InspectedMachine = loadMachine(manualReview);

const allButtons = document.querySelectorAll('[ballerine-machine]');

allButtons.forEach(b => {
  b.addEventListener('click', () => {
    activeInspectionMachine.cleanup();
    const machineId = b.getAttribute('ballerine-machine') as keyof typeof stateMachineConfigs;
    const machineCfg = stateMachineConfigs[machineId];

    activeInspectionMachine = loadMachine(machineCfg);
  });
});
