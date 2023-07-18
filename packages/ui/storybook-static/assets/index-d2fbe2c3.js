import { R as o } from './index-8db94870.js';
import './_commonjsHelpers-042e6b4d.js';
const u = o.createContext({});
function C(t) {
  return e;
  function e(r) {
    const n = i(r.components);
    return o.createElement(t, { ...r, allComponents: n });
  }
}
function i(t) {
  const e = o.useContext(u);
  return o.useMemo(() => (typeof t == 'function' ? t(e) : { ...e, ...t }), [e, t]);
}
const c = {};
function a({ components: t, children: e, disableParentContext: r }) {
  let n;
  return (
    r ? (n = typeof t == 'function' ? t({}) : t || c) : (n = i(t)),
    o.createElement(u.Provider, { value: n }, e)
  );
}
export { u as MDXContext, a as MDXProvider, i as useMDXComponents, C as withMDXComponents };
//# sourceMappingURL=index-d2fbe2c3.js.map
