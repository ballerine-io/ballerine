import { AnyObject } from '@/common';
import get from 'lodash/get';

export const formatString = (string: string, metadata: AnyObject = {}) => {
  // Replace patterns like {key} with corresponding metadata values
  return string.replace(/\{([^}]+)\}/g, (match, key) => {
    const result = get(metadata, key) as unknown as string;
    return result === undefined ? match : result;
  });
};
