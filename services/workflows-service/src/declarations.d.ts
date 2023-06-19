import { UserInfo } from '@/user/user-info';

declare global {
  // eslint-disable-next-line no-var
  var __rootdir__: string;

  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    }

    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export {};
