import { CustomRule } from '@/lib/custom-rule-engine/types/custom-rule';
import { DefaultContextPaths } from '@/lib/custom-rule-engine/consts/default-context-paths';

export const uboHasWarning: CustomRule = ({
  context,
  fieldPath = DefaultContextPaths.ubosPath,
}) => {
  return !!context[fieldPath].some((ubo: { warnings: Array<unknown> }) => ubo.warnings.length > 0);
};
