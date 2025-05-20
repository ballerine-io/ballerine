import { ProcessStatus } from '@ballerine/common';
import { UnifiedApiReasonsString } from './rules';

export const createPluginAsyncResponseTransform = (action: string, metadata?: string) => [
  {
    transformer: 'jmespath',
    mapping: `merge({ name: '${action}', status: contains(${UnifiedApiReasonsString}, reason) && '${
      ProcessStatus.CANCELED
    }' || error != \`null\` && '${ProcessStatus.ERROR}' || '${ProcessStatus.IN_PROGRESS}' ${
      metadata ? `, ${metadata}` : ''
    } }, @)`, // jmespath
  },
];

export const createPluginSyncResponseTransform = (action: string, metadata?: string) => [
  {
    transformer: 'jmespath',
    mapping: `merge({ name: '${action}', status: contains(${UnifiedApiReasonsString}, reason) && '${
      ProcessStatus.CANCELED
    }' || error != \`null\` && '${ProcessStatus.ERROR}' || '${ProcessStatus.SUCCESS}' ${
      metadata ? `, ${metadata}` : ''
    } }, @)`, // jmespath
  },
];

export const createPluginSyncOrAsyncResponseTransform = (action: string, isAsync: string) => [
  {
    transformer: 'jmespath',
    mapping: `merge({ name: '${action}', status: contains(${UnifiedApiReasonsString}, reason) && '${ProcessStatus.CANCELED}' || error != \`null\` && '${ProcessStatus.ERROR}' || ${isAsync} && '${ProcessStatus.IN_PROGRESS}' || '${ProcessStatus.SUCCESS}' }, @)`,
  },
];
