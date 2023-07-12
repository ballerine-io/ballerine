import z from 'zod';

export const settingsSchema = z.object({
  logo: z.string(),
  theme: z.object({
    primary: z.string(),
  }),
});
