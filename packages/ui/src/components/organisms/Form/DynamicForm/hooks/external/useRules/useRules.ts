import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useMemo } from 'react';
import { replaceTagsWithIndexesInRule } from './helpers';
import { TRule } from '@ballerine/common';

export const useRules = (rules?: TRule[], stack?: TDeepthLevelStack) => {
  const rulesWithIndexes = useMemo(() => {
    return rules ? replaceTagsWithIndexesInRule(rules, stack) : [];
  }, [rules, stack]);

  return rulesWithIndexes;
};
