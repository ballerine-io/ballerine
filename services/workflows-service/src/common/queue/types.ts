import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

export const BULLBOARD_INSTANCE_INJECTION_TOKEN = 'BULLBOARD_INSTANCE';

export interface BullBoardInjectedInstance {
  boardInstance: ReturnType<typeof createBullBoard>;
  serverAdapter: ExpressAdapter;
}

export const bullBoardProvider = {
  provide: BULLBOARD_INSTANCE_INJECTION_TOKEN,
  useFactory: (): BullBoardInjectedInstance => {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/queues');
    const boardInstance = createBullBoard({ queues: [], serverAdapter });

    return { boardInstance, serverAdapter };
  },
};
