import { IRule } from '@/components/organisms/Form/hooks';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';

export const replaceTagsWithIndexesInRule = (rules: IRule[], stack?: TDeepthLevelStack) => {
  if (!stack || !stack.length) return rules;

  let jsonRules = JSON.stringify(rules);

  stack.forEach((stack, index) => {
    const tag = `$${index}`;
    jsonRules = jsonRules.replaceAll(tag, stack.toString());
  });

  return JSON.parse(jsonRules);
};
