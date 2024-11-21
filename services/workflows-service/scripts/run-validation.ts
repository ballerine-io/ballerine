import { z } from 'zod';

// 1. Define data to validate
const data = {};
// 2. Import a validation schema
const result = z.object({}).parse(data);

console.dir(
  {
    status: 'Validation passed',
    // 3. Log data post transforms
    data: result,
  },
  {
    depth: Infinity,
  },
);
