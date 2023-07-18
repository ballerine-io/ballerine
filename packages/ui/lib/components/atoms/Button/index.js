import { jsx as a } from 'react/jsx-runtime';
import * as d from 'react';
import { $ as c } from '../../../index.module-4fc81c69.js';
import { c as u } from '../../../index-177aa058.js';
import { a as m } from '../../../ctw-6a823672.js';
import '../../../extends-70f3d2a3.js';
const f = u(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
          destructive:
            'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
          outline:
            'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
          secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
          default: 'h-9 px-4 py-2',
          sm: 'h-8 rounded-md px-3 text-xs',
          lg: 'h-10 rounded-md px-8',
          icon: 'h-9 w-9',
        },
        isCircle: {
          true: 'rounded-full',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
        isCircle: !1,
      },
    },
  ),
  l = d.forwardRef(({ className: e, variant: r, size: t, isCircle: o, asChild: n = !1, ...i }, s) =>
    /* @__PURE__ */ a(n ? c : 'button', {
      className: m(f({ variant: r, size: t, isCircle: o, className: e })),
      ref: s,
      ...i,
    }),
  );
l.displayName = 'Button';
export { l as Button, f as buttonVariants };
