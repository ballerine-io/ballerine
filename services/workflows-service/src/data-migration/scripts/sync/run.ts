import path from 'path';
import { SyncedObject, sync } from './sync';

(async () => {
  const filePath = path.join(
    __dirname,
    '../../../../prisma/data-migrations/synced-objects/index.js',
  );
  const syncService = await import(filePath);

  if (!syncService.getSyncedObjects) {
    console.warn('No getSyncedObjects function found in', {
      filePath,
    });

    return;
  }

  const objectsToSync: SyncedObject[] = syncService.getSyncedObjects();

  sync(objectsToSync)
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      console.error('Error during sync process:', err);
      process.exit(1);
    });
})();
