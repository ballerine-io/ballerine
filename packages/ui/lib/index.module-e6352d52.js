import {
  createContext as b,
  useMemo as N,
  createElement as P,
  useContext as T,
  useLayoutEffect as M,
  useRef as v,
  useEffect as A,
  Children as O,
  cloneElement as C,
  useState as E,
  useCallback as _,
  useReducer as g,
} from 'react';
import { flushSync as U } from 'react-dom';
import { a as I } from './index.module-4fc81c69.js';
function j(e, n, { checkForDefaultPrevented: t = !0 } = {}) {
  return function (r) {
    if ((e == null || e(r), t === !1 || !r.defaultPrevented)) return n == null ? void 0 : n(r);
  };
}
function F(e, n = []) {
  let t = [];
  function o(a, u) {
    const i = /* @__PURE__ */ b(u),
      s = t.length;
    t = [...t, u];
    function c(d) {
      const { scope: f, children: m, ...$ } = d,
        x = (f == null ? void 0 : f[e][s]) || i,
        S = N(() => $, Object.values($));
      return /* @__PURE__ */ P(
        x.Provider,
        {
          value: S,
        },
        m,
      );
    }
    function l(d, f) {
      const m = (f == null ? void 0 : f[e][s]) || i,
        $ = T(m);
      if ($) return $;
      if (u !== void 0) return u;
      throw new Error(`\`${d}\` must be used within \`${a}\``);
    }
    return (c.displayName = a + 'Provider'), [c, l];
  }
  const r = () => {
    const a = t.map(u => /* @__PURE__ */ b(u));
    return function (i) {
      const s = (i == null ? void 0 : i[e]) || a;
      return N(
        () => ({
          [`__scope${e}`]: {
            ...i,
            [e]: s,
          },
        }),
        [i, s],
      );
    };
  };
  return (r.scopeName = e), [o, y(r, ...n)];
}
function y(...e) {
  const n = e[0];
  if (e.length === 1) return n;
  const t = () => {
    const o = e.map(r => ({
      useScope: r(),
      scopeName: r.scopeName,
    }));
    return function (a) {
      const u = o.reduce((i, { useScope: s, scopeName: c }) => {
        const d = s(a)[`__scope${c}`];
        return {
          ...i,
          ...d,
        };
      }, {});
      return N(
        () => ({
          [`__scope${n.scopeName}`]: u,
        }),
        [u],
      );
    };
  };
  return (t.scopeName = n.scopeName), t;
}
const h = globalThis != null && globalThis.document ? M : () => {};
function q(e) {
  const n = v(e);
  return (
    A(() => {
      n.current = e;
    }),
    N(
      () =>
        (...t) => {
          var o;
          return (o = n.current) === null || o === void 0 ? void 0 : o.call(n, ...t);
        },
      [],
    )
  );
}
function L(e, n) {
  return g((t, o) => {
    const r = n[t][o];
    return r ?? t;
  }, e);
}
const R = e => {
  const { present: n, children: t } = e,
    o = k(n),
    r =
      typeof t == 'function'
        ? t({
            present: o.isPresent,
          })
        : O.only(t),
    a = I(o.ref, r.ref);
  return typeof t == 'function' || o.isPresent
    ? /* @__PURE__ */ C(r, {
        ref: a,
      })
    : null;
};
R.displayName = 'Presence';
function k(e) {
  const [n, t] = E(),
    o = v({}),
    r = v(e),
    a = v('none'),
    u = e ? 'mounted' : 'unmounted',
    [i, s] = L(u, {
      mounted: {
        UNMOUNT: 'unmounted',
        ANIMATION_OUT: 'unmountSuspended',
      },
      unmountSuspended: {
        MOUNT: 'mounted',
        ANIMATION_END: 'unmounted',
      },
      unmounted: {
        MOUNT: 'mounted',
      },
    });
  return (
    A(() => {
      const c = p(o.current);
      a.current = i === 'mounted' ? c : 'none';
    }, [i]),
    h(() => {
      const c = o.current,
        l = r.current;
      if (l !== e) {
        const f = a.current,
          m = p(c);
        e
          ? s('MOUNT')
          : m === 'none' || (c == null ? void 0 : c.display) === 'none'
          ? s('UNMOUNT')
          : s(l && f !== m ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (r.current = e);
      }
    }, [e, s]),
    h(() => {
      if (n) {
        const c = d => {
            const m = p(o.current).includes(d.animationName);
            d.target === n && m && U(() => s('ANIMATION_END'));
          },
          l = d => {
            d.target === n && (a.current = p(o.current));
          };
        return (
          n.addEventListener('animationstart', l),
          n.addEventListener('animationcancel', c),
          n.addEventListener('animationend', c),
          () => {
            n.removeEventListener('animationstart', l),
              n.removeEventListener('animationcancel', c),
              n.removeEventListener('animationend', c);
          }
        );
      } else s('ANIMATION_END');
    }, [n, s]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(i),
      ref: _(c => {
        c && (o.current = getComputedStyle(c)), t(c);
      }, []),
    }
  );
}
function p(e) {
  return (e == null ? void 0 : e.animationName) || 'none';
}
export { h as $, q as a, j as b, F as c, R as d };
