import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { TRule } from '@ballerine/common';

export const replaceTagsWithIndexesInRule = (rules: TRule[], stack?: TDeepthLevelStack) => {
  if (!stack || !stack.length) return rules;

  let jsonRules = JSON.stringify(rules);

  stack.forEach((stack, index) => {
    const tag = `$${index}`;
    jsonRules = jsonRules.replaceAll(tag, stack.toString());
  });

  return JSON.parse(jsonRules);
};
