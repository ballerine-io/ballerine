import { jsx as o } from 'react/jsx-runtime';
import * as s from 'react';
import r from 'react';
import { a as l } from './ctw-6a823672.js';
const d = s.forwardRef(({ className: a, ...e }, t) =>
  /* @__PURE__ */ o('table', { ref: t, className: l('caption-bottom w-full text-sm', a), ...e }),
);
d.displayName = 'Table';
const m = r.forwardRef(({ className: a, ...e }, t) =>
  /* @__PURE__ */ o('tbody', { ref: t, className: l('[&_tr:last-child]:border-0', a), ...e }),
);
m.displayName = 'TableBody';
const b = r.forwardRef(({ className: a, ...e }, t) =>
  /* @__PURE__ */ o('tr', {
    ref: t,
    className: l('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', a),
    ...e,
  }),
);
b.displayName = 'TableRow';
const c = r.forwardRef(({ className: a, ...e }, t) =>
  /* @__PURE__ */ o('td', {
    ref: t,
    className: l('font-inter p-4 align-middle [&:has([role=checkbox])]:pr-0', a),
    ...e,
  }),
);
c.displayName = 'TableCell';
const f = r.forwardRef(({ className: a, ...e }, t) =>
  /* @__PURE__ */ o('th', {
    ref: t,
    className: l(
      'font-inter text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
      a,
    ),
    ...e,
  }),
);
f.displayName = 'TableHead';
const i = r.forwardRef(({ className: a, ...e }, t) =>
  /* @__PURE__ */ o('thead', { ref: t, className: l('[&_tr]:border-b', a), ...e }),
);
i.displayName = 'TableHeader';
export { d as T, m as a, b, c, f as d, i as e };
