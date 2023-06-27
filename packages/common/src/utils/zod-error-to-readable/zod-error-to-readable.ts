import { ZodError } from 'zod'

export const ZodErrorToReadable = (error: ZodError) => {
  return error.issues.map((err) => {
    return `${err.path?.join(`.`)}: ${err.message}`
  }).join('\n');
}
