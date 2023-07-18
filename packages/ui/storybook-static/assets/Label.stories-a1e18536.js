import { j as i, c as p } from './ctw-409c05e4.js';
import { r as l } from './index-8db94870.js';
import { _ as f } from './extends-98964cd2.js';
import { $ as m } from './index.module-1078e6dd.js';
import { c as u } from './index-bf785725.js';
import './_commonjsHelpers-042e6b4d.js';
import './index-8ce4a492.js';
import './index.module-1a92c487.js';
const b = l.forwardRef((e, t) =>
    l.createElement(
      m.label,
      f({}, e, {
        ref: t,
        onMouseDown: r => {
          var s;
          (s = e.onMouseDown) === null || s === void 0 || s.call(e, r),
            !r.defaultPrevented && r.detail > 1 && r.preventDefault();
        },
      }),
    ),
  ),
  _ = b,
  x = u(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  ),
  o = l.forwardRef(({ className: e, ...t }, r) => i.jsx(_, { ref: r, className: p(x(), e), ...t }));
try {
  (o.displayName = 'Label'),
    (o.__docgenInfo = {
      description: '',
      displayName: 'Label',
      props: {
        asChild: {
          defaultValue: null,
          description: '',
          name: 'asChild',
          required: !1,
          type: { name: 'boolean' },
        },
      },
    });
} catch {}
const E = { component: o },
  a = { render: () => i.jsx(o, { children: 'Hello World' }) };
var n, c, d;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((n = a.parameters) == null ? void 0 : n.docs),
    source: {
      originalSource: `{
  render: () => <Label>Hello World</Label>
}`,
      ...((d = (c = a.parameters) == null ? void 0 : c.docs) == null ? void 0 : d.source),
    },
  },
};
const M = ['Default'];
export { a as Default, M as __namedExportsOrder, E as default };
//# sourceMappingURL=Label.stories-a1e18536.js.map
