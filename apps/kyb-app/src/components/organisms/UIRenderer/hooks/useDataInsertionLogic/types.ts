import { DisablableListElementDefinition } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/useElementsDisablerLogic';
import { Rule } from '@/domains/collection-flow';

export type InsertionSchema = Record<string, string>;

export interface InsertionParams {
  schema: InsertionSchema;
  insertWhen: Rule[];
  removeWhen: Rule[];
  insertionStrategy: 'array' | 'object';
  destination: string;
  disableElements?: DisablableListElementDefinition[];
  bindingAnchorDestination: string;
}

export interface DefinitionInsertionParams {
  insertionParams: InsertionParams;
}
