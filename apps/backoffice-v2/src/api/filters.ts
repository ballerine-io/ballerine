import { sleep } from '../utils/sleep/sleep';

export const filters = {
  list: async () => {
    await sleep(500);

    return Promise.resolve([
      {
        id: '1',
        kind: 'individuals',
      },
      {
        id: '2',
        kind: 'companies',
      },
    ]);
  },
};
