import { j as a, c } from './ctw-409c05e4.js';
import { r as l } from './index-8db94870.js';
import './_commonjsHelpers-042e6b4d.js';
const e = l.forwardRef(({ className: o, type: i, ...d }, p) =>
  a.jsx('input', {
    type: i,
    className: c(
      'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
      o,
    ),
    ref: p,
    ...d,
  }),
);
e.displayName = 'Input';
try {
  (e.displayName = 'Input'),
    (e.__docgenInfo = { description: '', displayName: 'Input', props: {} });
} catch {}
const x = { component: e },
  r = { render: () => a.jsx(e, {}) };
var t, s, n;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((t = r.parameters) == null ? void 0 : t.docs),
    source: {
      originalSource: `{
  render: () => <Input />
}`,
      ...((n = (s = r.parameters) == null ? void 0 : s.docs) == null ? void 0 : n.source),
    },
  },
};
const b = ['Default'];
export { r as Default, b as __namedExportsOrder, x as default };
//# sourceMappingURL=Input.stories-066951a2.js.map
