import { createMachine, interpret } from 'xstate';
import { sampleMachine } from './sample.machine';
import { inspect } from '@xstate/inspect';

const machine = createMachine(sampleMachine as any);

inspect({
  iframe: document.querySelector('iframe'),
});

const service = interpret(machine, { devTools: true }).onTransition(state => {
  console.log(state.value);
});

service.start();
