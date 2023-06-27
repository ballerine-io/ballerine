import { ApiPluginSchema } from "./api-plugin.validator";
import { AnyRecord } from "@/types";

export const WebhookPluginSchema = ApiPluginSchema.pick({
  name: true,
  url: true,
  method: true,
  headers: true,
  stateNames: true,
  request: true,
}).strict()

export const validate = (webhookPlugin: AnyRecord) => {
  return WebhookPluginSchema.parse(webhookPlugin);
}
