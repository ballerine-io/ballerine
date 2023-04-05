import { AnyStateMachine, InterpreterFrom } from 'xstate';
// import { simulationMachine } from './simulationMachine';
import { createInterpreterContext } from './utils';
import { SimulationMode } from './types';

const [SimulationProvider, useSimulation, createSimulationSelector] =
  createInterpreterContext<InterpreterFrom<AnyStateMachine>>('Simulation');
// createInterpreterContext<InterpreterFrom<typeof simulationMachine>>(

export { SimulationProvider, useSimulation };

export const useSimulationMode = createSimulationSelector<SimulationMode>(state =>
  state.hasTag('inspecting') ? 'inspecting' : 'visualizing',
);
