import { _ as p } from './extends-98964cd2.js';
import { r as e } from './index-8db94870.js';
import { r as m } from './index-8ce4a492.js';
import { $ as n } from './index.module-1a92c487.js';
const d = [
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
  v = d.reduce((t, r) => {
    const o = e.forwardRef((a, c) => {
      const { asChild: f, ...i } = a,
        s = f ? n : r;
      return (
        e.useEffect(() => {
          window[Symbol.for('radix-ui')] = !0;
        }, []),
        e.createElement(s, p({}, i, { ref: c }))
      );
    });
    return (o.displayName = `Primitive.${r}`), { ...t, [r]: o };
  }, {});
function h(t, r) {
  t && m.flushSync(() => t.dispatchEvent(r));
}
export { v as $, h as a };
//# sourceMappingURL=index.module-1078e6dd.js.map
