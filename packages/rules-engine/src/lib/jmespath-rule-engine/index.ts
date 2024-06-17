import jmespath from 'jmespath';

export const JMESPathRuleEngine = ({
  context,
  rule,
}: {
  context: Record<string, unknown>;
  rule: string;
}) => {
  return !!jmespath.search(context, rule);
};
