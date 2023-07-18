import { jsx as e, jsxs as r } from 'react/jsx-runtime';
import { Button as c } from '../../../../atoms/Button/index.js';
import {
  DropdownMenu as p,
  DropdownMenuTrigger as m,
  DropdownMenuContent as l,
  DropdownMenuItem as o,
  DropdownMenuSeparator as y,
} from '../../../../atoms/Dropdown/index.js';
import { a as d } from '../../../../../ctw-6a823672.js';
import { c as a } from '../../../../../createLucideIcon-6839730e.js';
import 'react';
import '../../../../../index.module-4fc81c69.js';
import '../../../../../extends-70f3d2a3.js';
import '../../../../../index-177aa058.js';
import 'react-dom';
import '../../../../../index-cbc375f1.js';
const g = a('ChevronsUpDown', [
    ['path', { d: 'm7 15 5 5 5-5', key: '1hf1tw' }],
    ['path', { d: 'm7 9 5-5 5 5', key: 'sgt6xg' }],
  ]),
  k = a('EyeOff', [
    ['path', { d: 'M9.88 9.88a3 3 0 1 0 4.24 4.24', key: '1jxqfv' }],
    [
      'path',
      {
        d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68',
        key: '9wicm4',
      },
    ],
    [
      'path',
      {
        d: 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61',
        key: '1jreej',
      },
    ],
    ['line', { x1: '2', x2: '22', y1: '2', y2: '22', key: 'a6p6uj' }],
  ]),
  i = a('SortAsc', [
    ['path', { d: 'M11 11h4', key: '1iu023' }],
    ['path', { d: 'M11 15h7', key: '23lz64' }],
    ['path', { d: 'M11 19h10', key: '11t30w' }],
    ['path', { d: 'M9 7 6 4 3 7', key: '1s6vko' }],
    ['path', { d: 'M6 6v14', key: '1s15cj' }],
  ]),
  h = a('SortDesc', [
    ['path', { d: 'M11 5h10', key: '1cz7ny' }],
    ['path', { d: 'M11 9h7', key: '13ra05' }],
    ['path', { d: 'M11 13h4', key: '1p7l4v' }],
    ['path', { d: 'm3 17 3 3 3-3', key: 'd2bl7z' }],
    ['path', { d: 'M6 18V4', key: '20vmay' }],
  ]);
function A({ column: t, title: s, className: n }) {
  return t.getCanSort()
    ? /* @__PURE__ */ e('div', {
        className: d('flex items-center space-x-2 whitespace-nowrap', n),
        children: /* @__PURE__ */ r(p, {
          children: [
            /* @__PURE__ */ e(m, {
              asChild: !0,
              children: /* @__PURE__ */ r(c, {
                variant: 'ghost',
                size: 'sm',
                className: 'data-[state=open]:bg-accent -ml-3 h-8',
                children: [
                  /* @__PURE__ */ e('span', { children: s }),
                  t.getIsSorted() === 'desc'
                    ? /* @__PURE__ */ e(h, { className: 'ml-2 h-4 w-4' })
                    : t.getIsSorted() === 'asc'
                    ? /* @__PURE__ */ e(i, { className: 'ml-2 h-4 w-4' })
                    : /* @__PURE__ */ e(g, { className: 'ml-2 h-4 w-4' }),
                ],
              }),
            }),
            /* @__PURE__ */ r(l, {
              align: 'start',
              children: [
                /* @__PURE__ */ r(o, {
                  onClick: () => t.toggleSorting(!1),
                  children: [
                    /* @__PURE__ */ e(i, {
                      className: 'text-muted-foreground/70 mr-2 h-3.5 w-3.5',
                    }),
                    'Asc',
                  ],
                }),
                /* @__PURE__ */ r(o, {
                  onClick: () => t.toggleSorting(!0),
                  children: [
                    /* @__PURE__ */ e(h, {
                      className: 'text-muted-foreground/70 mr-2 h-3.5 w-3.5',
                    }),
                    'Desc',
                  ],
                }),
                /* @__PURE__ */ e(y, {}),
                /* @__PURE__ */ r(o, {
                  onClick: () => t.toggleVisibility(!1),
                  children: [
                    /* @__PURE__ */ e(k, {
                      className: 'text-muted-foreground/70 mr-2 h-3.5 w-3.5',
                    }),
                    'Hide',
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    : /* @__PURE__ */ e('div', { className: d(n), children: s });
}
export { A as DataTableColumnHeader };
