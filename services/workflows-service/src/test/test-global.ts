import { StartedPostgreSqlContainer } from 'testcontainers';

export type TestGlobal = typeof globalThis & {
  __DB_CONTAINER__?: StartedPostgreSqlContainer;
};
