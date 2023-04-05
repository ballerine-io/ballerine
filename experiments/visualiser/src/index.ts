import { createMachine } from 'xstate';
import { sampleMachine } from './sample.machine';

import { toDirectedGraph } from './vendored/directedGraph';

// const app = document.querySelector<HTMLDivElement>('#app')!;
const machine = createMachine(sampleMachine as any);
const digraph = toDirectedGraph(machine as any);
console.warn(digraph);
