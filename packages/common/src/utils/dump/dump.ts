import { Serializable } from '@/types';

export const dump = (value: Serializable) => JSON.stringify(value, null, 2);
