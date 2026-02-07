import { Customer, User as PrismaUser } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __rootdir__: string;

  namespace Express {
    interface User {
      user?: Partial<PrismaUser>;
      customer?: Partial<Customer>;
      type: 'user' | 'customer' | 'admin';
      projectIds: string[] | null;
    }

    interface Request {
      id: string;
      startTime: number;
    }
  }

  interface BigInt {
    toJSON(): string;
  }
}

export {};
