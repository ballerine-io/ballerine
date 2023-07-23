import { _ as s } from './extends-70f3d2a3.js';
import { forwardRef as m, useEffect as n, createElement as p } from 'react';
import { flushSync as d } from 'react-dom';
import { $ } from './index.module-4fc81c69.js';
const l = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'span',
    'svg',
    'ul',
  ],
  b = l.reduce((e, r) => {
    const f = /* @__PURE__ */ m((o, t) => {
      const { asChild: c, ...a } = o,
        i = c ? $ : r;
      return (
        n(() => {
          window[Symbol.for('radix-ui')] = !0;
        }, []),
        /* @__PURE__ */ p(
          i,
          s({}, a, {
            ref: t,
          }),
        )
      );
    });
    return (
      (f.displayName = `Primitive.${r}`),
      {
        ...e,
        [r]: f,
      }
    );
  }, {});
function E(e, r) {
  e && d(() => e.dispatchEvent(r));
}
export { b as $, E as a };
