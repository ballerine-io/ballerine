import { Rule } from '@app/domains/collection-flow';

export type InsertionSchema = Record<string, string>;

export interface InsertionParams {
  schema: InsertionSchema;
  insertWhen: Rule[];
  removeWhen: Rule[];
  insertionStrategy: 'array' | 'object';
  destination: string;
}

export interface DefinitionInsertionParams {
  insertionParams: InsertionParams;
}
