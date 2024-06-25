import { ARRAY_MERGE_OPTION } from './consts';

export type UnknownRecord = Record<PropertyKey, unknown>;
export type ArrayOfObjectsWithId = Array<UnknownRecord & { id: unknown }>;
export type MergeMethod = (obj1: UnknownRecord, obj2: UnknownRecord) => UnknownRecord;
export type ArrayMergeOption = (typeof ARRAY_MERGE_OPTION)[keyof typeof ARRAY_MERGE_OPTION];
