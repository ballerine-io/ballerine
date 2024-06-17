import { CustomRule } from '@/lib/custom-rule-engine/types/custom-rule';
import { DefaultContextPaths } from '@/lib/custom-rule-engine/consts/default-context-paths';

export const uboHasWarning: CustomRule = ({
  context,
  fieldPath = DefaultContextPaths.ubos_default_path,
}) => {
  return !!context[fieldPath].any((ubo: { warnings: Array<unknown> }) => ubo.warnings.length > 0);
};
