import { j as u, c as d } from './ctw-409c05e4.js';
import { r as l } from './index-8db94870.js';
import { $ as c } from './index.module-1a92c487.js';
import { c as m } from './index-bf785725.js';
const f = m(
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
      defaultVariants: { variant: 'default', size: 'default' },
    },
  ),
  e = l.forwardRef(({ className: t, variant: a, size: r, asChild: o = !1, ...n }, s) => {
    const i = o ? c : 'button';
    return u.jsx(i, { className: d(f({ variant: a, size: r, className: t })), ref: s, ...n });
  });
e.displayName = 'Button';
try {
  (e.displayName = 'Button'),
    (e.__docgenInfo = {
      description: '',
      displayName: 'Button',
      props: {
        asChild: {
          defaultValue: { value: 'false' },
          description: '',
          name: 'asChild',
          required: !1,
          type: { name: 'boolean' },
        },
        size: {
          defaultValue: null,
          description: '',
          name: 'size',
          required: !1,
          type: {
            name: 'enum',
            value: [
              { value: '"default"' },
              { value: '"sm"' },
              { value: '"lg"' },
              { value: '"icon"' },
            ],
          },
        },
        variant: {
          defaultValue: null,
          description: '',
          name: 'variant',
          required: !1,
          type: {
            name: 'enum',
            value: [
              { value: '"link"' },
              { value: '"default"' },
              { value: '"destructive"' },
              { value: '"outline"' },
              { value: '"secondary"' },
              { value: '"ghost"' },
            ],
          },
        },
      },
    });
} catch {}
export { e as B };
//# sourceMappingURL=Button-b285b1af.js.map
