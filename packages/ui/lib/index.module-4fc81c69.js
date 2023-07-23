import { _ as $ } from './extends-70f3d2a3.js';
import {
  useCallback as b,
  forwardRef as p,
  Children as f,
  isValidElement as s,
  createElement as a,
  cloneElement as m,
  Fragment as h,
} from 'react';
function x(e, t) {
  typeof e == 'function' ? e(t) : e != null && (e.current = t);
}
function y(...e) {
  return t => e.forEach(n => x(n, t));
}
function P(...e) {
  return b(y(...e), e);
}
const C = /* @__PURE__ */ p((e, t) => {
  const { children: n, ...r } = e,
    o = f.toArray(n),
    c = o.find(v);
  if (c) {
    const l = c.props.children,
      i = o.map(d =>
        d === c
          ? f.count(l) > 1
            ? f.only(null)
            : /* @__PURE__ */ s(l)
            ? l.props.children
            : null
          : d,
      );
    return /* @__PURE__ */ a(
      u,
      $({}, r, {
        ref: t,
      }),
      /* @__PURE__ */ s(l) ? /* @__PURE__ */ m(l, void 0, i) : null,
    );
  }
  return /* @__PURE__ */ a(
    u,
    $({}, r, {
      ref: t,
    }),
    n,
  );
});
C.displayName = 'Slot';
const u = /* @__PURE__ */ p((e, t) => {
  const { children: n, ...r } = e;
  return /* @__PURE__ */ s(n)
    ? /* @__PURE__ */ m(n, {
        ...N(r, n.props),
        ref: y(t, n.ref),
      })
    : f.count(n) > 1
    ? f.only(null)
    : null;
});
u.displayName = 'SlotClone';
const E = ({ children: e }) => /* @__PURE__ */ a(h, null, e);
function v(e) {
  return /* @__PURE__ */ s(e) && e.type === E;
}
function N(e, t) {
  const n = {
    ...t,
  };
  for (const r in t) {
    const o = e[r],
      c = t[r];
    /^on[A-Z]/.test(r)
      ? o && c
        ? (n[r] = (...i) => {
            c(...i), o(...i);
          })
        : o && (n[r] = o)
      : r === 'style'
      ? (n[r] = {
          ...o,
          ...c,
        })
      : r === 'className' && (n[r] = [o, c].filter(Boolean).join(' '));
  }
  return {
    ...e,
    ...n,
  };
}
export { C as $, P as a };
