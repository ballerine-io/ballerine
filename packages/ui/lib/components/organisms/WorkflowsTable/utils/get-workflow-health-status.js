import { calculateHourDifference as f } from './calculate-hour-difference.js';
import { W as e } from '../../../../workflow-health-status-39d1eb5a.js';
import '../../../../_commonjsHelpers-10dfc225.js';
function s(i) {
  const { status: t, createdAt: o } = i;
  if (t === 'failed') return e.failed;
  if (t === 'completed') return e.healthy;
  const r = f(new Date(o), /* @__PURE__ */ new Date()),
    n = 2,
    a = 6;
  return t === 'active' && r < n
    ? e.healthy
    : t === 'active' && r > n && r < a
    ? e.pending
    : t === 'active' && r > a
    ? e['pending-longterm']
    : e.failed;
}
export { s as getWorkflowHealthStatus };
