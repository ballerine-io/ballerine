import { jsx as t } from 'react/jsx-runtime';
import * as f from 'react';
import { forwardRef as m, createElement as c } from 'react';
import { _ as s } from '../../../extends-70f3d2a3.js';
import { $ as l } from '../../../index.module-06df6ed9.js';
import { c as n } from '../../../index-177aa058.js';
import { a as i } from '../../../ctw-6a823672.js';
import 'react-dom';
import '../../../index.module-4fc81c69.js';
const d = /* @__PURE__ */ m((e, r) =>
    /* @__PURE__ */ c(
      l.label,
      s({}, e, {
        ref: r,
        onMouseDown: o => {
          var a;
          (a = e.onMouseDown) === null || a === void 0 || a.call(e, o),
            !o.defaultPrevented && o.detail > 1 && o.preventDefault();
        },
      }),
    ),
  ),
  p = d,
  b = n(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  ),
  v = f.forwardRef(({ className: e, ...r }, o) =>
    /* @__PURE__ */ t(p, { ref: o, className: i(b(), e), ...r }),
  );
export { v as Label };
