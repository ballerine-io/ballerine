import produce from 'immer';
import { ActorRefFrom, AnyInterpreter, EventFrom, InterpreterStatus, SCXML } from 'xstate';
import { AnyEventObject, assign, interpret, send, spawn } from 'xstate';
import { createWebSocketReceiver, createWindowReceiver, InspectReceiver } from '@xstate/inspect';

import { createModel } from 'xstate/lib/model';
import { devTools } from './devInterface';
import { notifMachine } from './notificationMachine';
import { AnyState, AnyStateMachine, ServiceData } from './types';

export interface SimEvent extends SCXML.Event<any> {
  timestamp: number;
  sessionId: string;
}

export const simModel = createModel(
  {
    state: undefined as AnyState | undefined,
    notifRef: undefined! as ActorRefFrom<typeof notifMachine>,
    serviceDataMap: {} as Record<string, ServiceData | undefined>,
    currentSessionId: null as string | null,
    events: [] as SimEvent[],
    previewEvent: undefined as string | undefined,
  },
  {
    events: {
      'SERVICE.SEND': (event: SCXML.Event<AnyEventObject>) => ({ event }),
      'MACHINES.REGISTER': (machines: Array<AnyStateMachine>) => ({
        machines,
      }),

      'MACHINES.RESET': () => ({}),
      'EVENT.PREVIEW': (eventType: string) => ({ eventType }),
      'PREVIEW.CLEAR': () => ({}),
      'SERVICE.REGISTER': (serviceData: Omit<ServiceData, 'status'>) => ({
        ...serviceData,
        // machines are always registered from within `.start()` call
        status: InterpreterStatus.Running,
      }),
      'SERVICE.STATE': (sessionId: string, state: AnyState) => ({
        sessionId,
        state,
      }),
      'SERVICES.UNREGISTER_ALL': () => ({}),
      'SERVICE.STOP': (sessionId: string) => ({ sessionId }),
      'SERVICE.FOCUS': (sessionId: string) => ({ sessionId }),
      ERROR: (message: string) => ({ message }),
      'LAYOUT.PENDING': () => ({}),
      'LAYOUT.READY': () => ({}),
    },
  },
);

export const simulationMachine = simModel.createMachine(
  {
    preserveActionOrder: true,
    context: simModel.initialContext,
    initial: 'inspecting',
    entry: assign({ notifRef: () => spawn(notifMachine) }),
    invoke: {
      src: 'captureEventsFromChildServices',
    },
    states: {
      inspecting: {
        tags: 'inspecting',
        invoke: {
          id: 'proxy',
          src: () => (sendBack, onReceive) => {
            const serverUrl = new URLSearchParams(window.location.search).get('server');

            let receiver: InspectReceiver;
            if (serverUrl) {
              const [protocol, ...server] = serverUrl.split('://');
              receiver = createWebSocketReceiver({
                protocol: protocol as 'ws' | 'wss',
                server: server.join('://'),
              } as any);
            } else {
              receiver = createWindowReceiver({
                // for some random reason the `window.top` is being rewritten to `window.self`
                // looks like maybe some webpack replacement plugin (or similar) plays tricks on us
                // this breaks the auto-detection of the correct `targetWindow` in the `createWindowReceiver`
                // so we pass it explicitly here
                targetWindow: window.opener || window.parent,
              });
            }

            onReceive(event => {
              if (event.type === 'xstate.event') {
                receiver.send({
                  ...event,
                  type: 'xstate.event',
                  event: JSON.stringify(event.event),
                });
              }
            });

            return receiver.subscribe(event => {
              switch (event.type) {
                case 'service.register':
                  let state = event.machine.resolveState(event.state);
                  sendBack(
                    simModel.events['SERVICE.REGISTER']({
                      sessionId: event.sessionId,
                      machine: event.machine,
                      state,
                      parent: event.parent,
                      source: 'inspector',
                    }),
                  );
                  break;
                case 'service.state':
                  sendBack(simModel.events['SERVICE.STATE'](event.sessionId, event.state));
                  break;
                case 'service.stop':
                  sendBack(simModel.events['SERVICE.STOP'](event.sessionId));
                  break;
                default:
                  break;
              }
            }).unsubscribe;
          },
        },
      },
      visualizing: {
        tags: 'visualizing',
        invoke: {
          id: 'proxy',
          src: () => (sendBack, onReceive) => {
            const serviceMap: Map<string, AnyInterpreter> = new Map();
            const machines = new Set<AnyStateMachine>();
            const rootServices = new Set<AnyInterpreter>();

            function locallyInterpret(machine: AnyStateMachine) {
              machines.add(machine);

              const service = interpret(machine, { devTools: true });
              rootServices.add(service);
              serviceMap.set(service.sessionId, service);

              sendBack(
                simModel.events['SERVICE.REGISTER']({
                  sessionId: service.sessionId,
                  machine: service.machine,
                  state: service.machine.initialState as any,
                  parent: service.parent?.sessionId,
                  source: 'visualizer',
                }),
              );

              service.subscribe(state => {
                sendBack(simModel.events['SERVICE.STATE'](service.sessionId, state as any));
              });
              service.start();
            }

            function stopRootServices() {
              rootServices.forEach(service => {
                sendBack(simModel.events['SERVICES.UNREGISTER_ALL']());
                service.stop();
              });
              rootServices.clear();
              serviceMap.clear();
            }

            onReceive(event => {
              if (event.type === 'INTERPRET') {
                event.machines.forEach((machine: AnyStateMachine) => {
                  try {
                    locallyInterpret(machine);
                  } catch (e) {
                    sendBack(simModel.events.ERROR((e as Error).message));
                  }
                });
              } else if (event.type === 'xstate.event') {
                const service = serviceMap.get(event.sessionId);
                if (service) {
                  try {
                    service.send(event.event);
                  } catch (err) {
                    console.error(err);
                    sendBack(simModel.events.ERROR((err as Error).message));
                  }
                }
              } else if (event.type === 'RESET') {
                stopRootServices();
                machines.forEach(machine => {
                  locallyInterpret(machine);
                });
              } else if (event.type === 'STOP') {
                stopRootServices();
                machines.clear();
              }
            });
          },
        },
        initial: 'idle',
        states: {
          idle: {
            tags: 'empty',
          },
          pending: {
            tags: 'layoutPending',
            on: {
              'LAYOUT.READY': 'ready',
            },
          },
          ready: {},
        },
        on: {
          'LAYOUT.PENDING': '.pending',
          'MACHINES.REGISTER': {
            actions: [
              'resetVisualizationState',
              send('STOP', { to: 'proxy' }),
              send(
                (_, e) => ({
                  type: 'INTERPRET',
                  machines: e.machines,
                }),
                { to: 'proxy' },
              ),
            ],
          },
          'MACHINES.RESET': {
            actions: ['resetVisualizationState', send('RESET', { to: 'proxy' })],
          },
        },
      },
    },
    on: {
      'SERVICE.STATE': {
        actions: [
          simModel.assign({
            serviceDataMap: (ctx, e) =>
              produce(ctx.serviceDataMap, draft => {
                const service = draft[e.sessionId];

                if (!service) {
                  return;
                }

                (draft[e.sessionId]!.state as any) = service.machine.resolveState(e.state);
              }),
            events: (ctx, e) => {
              return produce(ctx.events, draft => {
                draft.push({
                  ...e.state._event,
                  timestamp: Date.now(),
                  sessionId: e.sessionId,
                });
              });
            },
          }),
        ],
      },
      'SERVICE.SEND': {
        actions: [
          send(
            (ctx, e) => {
              return {
                type: 'xstate.event',
                event: e.event,
                sessionId: ctx.currentSessionId,
              };
            },
            { to: 'proxy' },
          ),
        ],
      },
      'SERVICE.REGISTER': {
        actions: simModel.assign({
          serviceDataMap: (ctx, { type, ...data }) => {
            return produce(ctx.serviceDataMap, draft => {
              draft[data.sessionId] = data;
            });
          },
          currentSessionId: (ctx, e) => {
            return ctx.currentSessionId ?? e.sessionId;
          },
        }),
      },
      'SERVICES.UNREGISTER_ALL': {
        actions: simModel.assign({
          serviceDataMap: {},
          currentSessionId: null,
        }),
      },
      'SERVICE.STOP': {
        actions: simModel.assign({
          serviceDataMap: (ctx, e) =>
            produce(ctx.serviceDataMap, draft => {
              const serviceData = draft[e.sessionId];
              if (!serviceData) {
                return;
              }

              serviceData.status = InterpreterStatus.Stopped;
            }),
        }),
      },
      'SERVICE.FOCUS': {
        actions: simModel.assign({
          currentSessionId: (_, e) => e.sessionId,
        }),
      },
      'EVENT.PREVIEW': {
        actions: simModel.assign({
          previewEvent: (_, event) => event.eventType,
        }),
      },
      'PREVIEW.CLEAR': {
        actions: simModel.assign({ previewEvent: undefined }),
      },
      ERROR: {
        actions: send(
          (_, e) => ({
            type: 'BROADCAST',
            status: 'error',
            message: e.message,
          }),
          { to: ctx => ctx.notifRef! },
        ),
      },
    },
  },
  {
    services: {
      captureEventsFromChildServices: () => sendBack => {
        devTools.onRegister(service => {
          // Only capture machines that are spawned or invoked
          if (service.parent) {
            sendBack(
              simModel.events['SERVICE.REGISTER']({
                sessionId: service.sessionId,
                machine: service.machine,
                state: service.state || service.initialState,
                parent: service.parent?.sessionId,
                source: 'child',
              }),
            );
            service.subscribe(state => {
              // `onRegister`'s callback gets called from within `.start()`
              // `subscribe` calls the callback immediately with the current state
              // but the `service.state` state has not yet been set when this gets called for the first time from within `.start()`
              if (!state) {
                return;
              }

              sendBack(simModel.events['SERVICE.STATE'](service.sessionId, state));
            });

            service.onStop(() => {
              sendBack(simModel.events['SERVICE.STOP'](service.sessionId));
            });
          }
        });
      },
    },
    actions: {
      resetVisualizationState: simModel.assign<EventFrom<typeof simModel>['type']>({
        events: [],
        previewEvent: undefined,
        currentSessionId: null,
      }),
    },
  },
);
