import { T, a as c, c as n, d as x, e as u, b as y } from '../../../TableHeader-fa2a2a43.js';
import { jsx as t } from 'react/jsx-runtime';
import r from 'react';
import { a as m } from '../../../ctw-6a823672.js';
const l = r.forwardRef(({ className: a, ...e }, o) =>
  /* @__PURE__ */ t('tfoot', {
    ref: o,
    className: m('bg-primary text-primary-foreground font-medium', a),
    ...e,
  }),
);
l.displayName = 'TableFooter';
const s = r.forwardRef(({ className: a, ...e }, o) =>
  /* @__PURE__ */ t('caption', {
    ref: o,
    className: m('text-muted-foreground mt-4 text-sm', a),
    ...e,
  }),
);
s.displayName = 'TableCaption';
export {
  T as Table,
  c as TableBody,
  s as TableCaption,
  n as TableCell,
  l as TableFooter,
  x as TableHead,
  u as TableHeader,
  y as TableRow,
};
