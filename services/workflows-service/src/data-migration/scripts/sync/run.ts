import { sync } from './sync';

sync()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during sync process:', err);
    process.exit(1);
  });
