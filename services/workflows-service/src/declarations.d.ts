import { Customer } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __rootdir__: string;

  namespace Express {
    interface User {
      user?: Partial<User>;
      customer?: Partial<Customer>;
      type: 'user' | 'customer' | 'admin';
      projectIds: string[] | null;
    }

    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export {};
