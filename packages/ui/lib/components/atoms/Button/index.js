import { jsx as s } from 'react/jsx-runtime';
import * as i from 'react';
import { $ as d } from '../../../index.module-4fc81c69.js';
import { c } from '../../../index-177aa058.js';
import { a as u } from '../../../ctw-6a823672.js';
import '../../../extends-70f3d2a3.js';
const m = c(
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
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  ),
  f = i.forwardRef(({ className: e, variant: t, size: r, asChild: o = !1, ...n }, a) =>
    /* @__PURE__ */ s(o ? d : 'button', {
      className: u(m({ variant: t, size: r, className: e })),
      ref: a,
      ...n,
    }),
  );
f.displayName = 'Button';
export { f as Button, m as buttonVariants };
