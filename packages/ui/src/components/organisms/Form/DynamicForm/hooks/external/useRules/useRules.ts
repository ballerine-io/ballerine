import { IRule } from '@/components/organisms/Form/hooks';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useMemo } from 'react';
import { replaceTagsWithIndexesInRule } from './helpers';

export const useRules = (rules?: IRule[], stack?: TDeepthLevelStack) => {
  const rulesWithIndexes = useMemo(() => {
    return rules ? replaceTagsWithIndexesInRule(rules, stack) : [];
  }, [rules, stack]);

  return rulesWithIndexes;
};
