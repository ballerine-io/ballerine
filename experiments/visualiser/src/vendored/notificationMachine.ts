import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';
import { createModel } from 'xstate/lib/model';

const toast = createStandaloneToast() as any;

export const notifModel = createModel(
  {},
  {
    events: {
      BROADCAST: (message: string, status: UseToastOptions['status'], title?: string) => ({
        message,
        status,
        title,
      }),
    },
  },
);
export const notifMachine = notifModel.createMachine({
  initial: 'running',
  context: {},
  on: {
    BROADCAST: {
      actions: [
        (_, e) => {
          const id = e.message;
          if (!toast.isActive(id)) {
            toast({
              id,
              status: e.status,
              title: e.title || e.status?.toUpperCase(),
              description: id,
              isClosable: true,
              position: 'bottom-left',
            });
          }
        },
      ],
    },
  },
  states: {
    running: {},
  },
});
