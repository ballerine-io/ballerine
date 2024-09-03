export interface IAlertDefinition {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  rulesetId: string;
  ruleId: string;
  inlineRule: object;
  config: object;
  defaultSeverity: number;
  tags: object;
  additionalInfo: object;
  createdAt: string;
}
