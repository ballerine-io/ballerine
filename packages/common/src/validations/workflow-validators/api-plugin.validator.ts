import { z } from 'zod';
import { AnyRecord } from "@/types";

const RequestSchema = z.object({
  transform: z.object({
    transformer: z.string(),
    mapping: z.string(),
  }),
  schema: z.object({
    $schema: z.string(),
    type: z.string(),
    properties: z.object({}),
    required: z.array(z.string()).optional(),
  }).optional(),
});

const ResponseSchema = z.object({
  transform: z.object({
    transformer: z.string(),
    mapping: z.string(),
  }),
  schema: z.object({
    $schema: z.string(),
    type: z.string(),
    properties: z.object({}),
    required: z.array(z.string()).optional(),
  }).optional(),
}).optional();

export const ApiPluginSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logo: z.string().optional(),
  method: z.string(),
  headers: z.record(z.string()).optional(),
  stateNames: z.array(z.string()),
  successAction: z.string(),
  errorAction: z.string(),
  request: RequestSchema,
  response: ResponseSchema,
}).strict();

export const validate = (apiPlugin: AnyRecord) => {
  return ApiPluginSchema.parse(apiPlugin);
}
