declare module '@prisma/client' {
  import type { User as PrismaUser } from '@prisma/client/index';
  export * from '@prisma/client/index';

  namespace Prisma {
    type JsonValue = unknown;
  }
}

type Unpacked<T> = T extends (infer U)[] ? U : T;
