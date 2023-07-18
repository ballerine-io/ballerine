import { j as o } from './ctw-409c05e4.js';
import { H as e, W as n } from './HealthIndicator-4a424b9f.js';
import './index-8db94870.js';
import './_commonjsHelpers-042e6b4d.js';
const k = { component: e },
  t = { render: () => o.jsx(e, { healthStatus: n.healthy }) },
  r = { render: () => o.jsx(e, { healthStatus: n.failed }) },
  a = { render: () => o.jsx(e, { healthStatus: n.pending }) },
  s = { render: () => o.jsx(e, { healthStatus: n['pending-longterm'] }) };
var d, l, c;
t.parameters = {
  ...t.parameters,
  docs: {
    ...((d = t.parameters) == null ? void 0 : d.docs),
    source: {
      originalSource: `{
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus.healthy} />
}`,
      ...((c = (l = t.parameters) == null ? void 0 : l.docs) == null ? void 0 : c.source),
    },
  },
};
var h, i, m;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((h = r.parameters) == null ? void 0 : h.docs),
    source: {
      originalSource: `{
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus.failed} />
}`,
      ...((m = (i = r.parameters) == null ? void 0 : i.docs) == null ? void 0 : m.source),
    },
  },
};
var p, u, S;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((p = a.parameters) == null ? void 0 : p.docs),
    source: {
      originalSource: `{
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus.pending} />
}`,
      ...((S = (u = a.parameters) == null ? void 0 : u.docs) == null ? void 0 : S.source),
    },
  },
};
var g, H, f;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((g = s.parameters) == null ? void 0 : g.docs),
    source: {
      originalSource: `{
  render: () => <HealthIndicator healthStatus={WorkflowHealthStatus['pending-longterm']} />
}`,
      ...((f = (H = s.parameters) == null ? void 0 : H.docs) == null ? void 0 : f.source),
    },
  },
};
const w = ['Healthy', 'Failed', 'Pending', 'PendingLongterm'];
export {
  r as Failed,
  t as Healthy,
  a as Pending,
  s as PendingLongterm,
  w as __namedExportsOrder,
  k as default,
};
//# sourceMappingURL=HealthIndicator.stories-64ade77a.js.map
