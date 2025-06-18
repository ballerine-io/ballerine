import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

export const BULLBOARD_INSTANCE_INJECTION_TOKEN = 'BULLBOARD_INSTANCE';
export type BullBoardInjectedInstance = {
  boardInstance: ReturnType<typeof createBullBoard>;
  serverAdapter: ExpressAdapter;
};
