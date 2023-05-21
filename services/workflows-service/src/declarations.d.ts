import { UserInfo } from '@/user/user-info';
import { TEntityType } from '@/workflow/types';

declare global {
  // eslint-disable-next-line no-var
  var __rootdir__: string;

  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserInfo {}
  }
}

export {};
