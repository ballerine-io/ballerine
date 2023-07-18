import { _ as d } from './extends-98964cd2.js';
import { r as n } from './index-8db94870.js';
function $(e, l) {
  typeof e == 'function' ? e(l) : e != null && (e.current = l);
}
function u(...e) {
  return l => e.forEach(r => $(r, l));
}
function b(...e) {
  return n.useCallback(u(...e), e);
}
const p = n.forwardRef((e, l) => {
  const { children: r, ...t } = e,
    c = n.Children.toArray(r),
    o = c.find(h);
  if (o) {
    const i = o.props.children,
      s = c.map(a =>
        a === o
          ? n.Children.count(i) > 1
            ? n.Children.only(null)
            : n.isValidElement(i)
            ? i.props.children
            : null
          : a,
      );
    return n.createElement(
      f,
      d({}, t, { ref: l }),
      n.isValidElement(i) ? n.cloneElement(i, void 0, s) : null,
    );
  }
  return n.createElement(f, d({}, t, { ref: l }), r);
});
p.displayName = 'Slot';
const f = n.forwardRef((e, l) => {
  const { children: r, ...t } = e;
  return n.isValidElement(r)
    ? n.cloneElement(r, { ...E(t, r.props), ref: u(l, r.ref) })
    : n.Children.count(r) > 1
    ? n.Children.only(null)
    : null;
});
f.displayName = 'SlotClone';
const m = ({ children: e }) => n.createElement(n.Fragment, null, e);
function h(e) {
  return n.isValidElement(e) && e.type === m;
}
function E(e, l) {
  const r = { ...l };
  for (const t in l) {
    const c = e[t],
      o = l[t];
    /^on[A-Z]/.test(t)
      ? c && o
        ? (r[t] = (...s) => {
            o(...s), c(...s);
          })
        : c && (r[t] = c)
      : t === 'style'
      ? (r[t] = { ...c, ...o })
      : t === 'className' && (r[t] = [c, o].filter(Boolean).join(' '));
  }
  return { ...e, ...r };
}
export { p as $, b as a };
//# sourceMappingURL=index.module-1a92c487.js.map
