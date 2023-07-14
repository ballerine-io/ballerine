import { jsx as n } from 'react/jsx-runtime';
import { W as r } from '../../../workflow-health-status-39d1eb5a.js';
import { a as g } from '../../../ctw-6a823672.js';
const i = ({ healthStatus: o, size: e = 20 }) =>
  /* @__PURE__ */ n('span', {
    style: { width: `${e}px`, height: `${e}px` },
    className: g('block', 'rounded-full', {
      'bg-green-400': o === r.healthy,
      'bg-red-400': o === r.failed,
      'bg-yellow-400': o === r.pending,
      'bg-orange-400': o === r['pending-longterm'],
    }),
  });
export { i as HealthIndicator };
