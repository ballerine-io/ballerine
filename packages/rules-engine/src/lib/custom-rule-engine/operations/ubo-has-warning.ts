import { CustomRule } from '@/lib/custom-rule-engine/types/custom-rule';
import { DefaultContextPath } from '@/lib/custom-rule-engine/consts/default-context-paths';
import get from 'lodash.get';

export const uboHasWarning: CustomRule = ({ context, fieldPath = DefaultContextPath.ubosPath }) => {
  return !!get(context, fieldPath).some(
    (ubo: { warnings: Array<unknown> }) => ubo.warnings.length > 0,
  );
};
