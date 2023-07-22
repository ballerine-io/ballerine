import { jsx as i } from 'react/jsx-runtime';
import { a as s } from '../../../ctw-6a823672.js';
import * as n from 'react';
const l = n.forwardRef(({ className: e, type: o, ...r }, t) =>
  /* @__PURE__ */ i('input', {
    type: o,
    className: s(
      'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
      e,
    ),
    ref: t,
    ...r,
  }),
);
l.displayName = 'Input';
export { l as Input };
