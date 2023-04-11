import { inspect } from '@xstate/inspect';
import { createMachine, interpret } from 'xstate';
type InspectedMachine = {
  cleanup: () => void;
};

export class StateMachineInspector {
  #inspectedMachine: InspectedMachine = { cleanup: () => {} };

  constructor() {
    console.warn('inzzpegdor');
  }
  public viewMachine(machineConfig: any, workflowContext: any) {
    this.#inspectedMachine.cleanup();
    inspect({})!;
    const machine = createMachine({ ...machineConfig, context: workflowContext });

    const service = interpret(machine, { devTools: true });
    service.start();
    this.#inspectedMachine = {
      cleanup: () => service.stop(),
    };
  }
}
