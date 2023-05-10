import { inspect } from '@xstate/inspect';
import { createMachine, interpret } from 'xstate';
type InspectedMachine = {
  cleanup: () => void;
};

export class StateMachineInspector {
  #inspectedMachine: InspectedMachine = { cleanup: () => {} };

  public viewMachine(machineConfig: any) {
    this.#inspectedMachine.cleanup();
    inspect({})!;
    const machine = createMachine({ ...machineConfig });

    const service = interpret(machine, { devTools: true });
    service.start();
    this.#inspectedMachine = {
      cleanup: () => service.stop(),
    };
  }
}
