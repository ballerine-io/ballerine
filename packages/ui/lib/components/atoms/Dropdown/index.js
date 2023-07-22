import { jsxs as gt, jsx as Y } from 'react/jsx-runtime';
import * as U from 'react';
import re, {
  useCallback as V,
  createContext as Ve,
  useMemo as je,
  createElement as v,
  useContext as wt,
  useRef as F,
  useEffect as G,
  useState as W,
  forwardRef as D,
  Children as Ce,
  isValidElement as Ye,
  cloneElement as xt,
  Fragment as Jt,
  useLayoutEffect as Qt,
  useReducer as so,
} from 'react';
import { _ } from '../../../extends-70f3d2a3.js';
import * as ao from 'react-dom';
import lo, { flushSync as en } from 'react-dom';
import { c as yt, h as uo, $ as fo } from '../../../createLucideIcon-5772c6f2.js';
import { a as ue } from '../../../ctw-6a823672.js';
const po = yt('Check', [['polyline', { points: '20 6 9 17 4 12', key: '10jjfj' }]]),
  mo = yt('ChevronRight', [['polyline', { points: '9 18 15 12 9 6', key: '1rtp27' }]]),
  $o = yt('Circle', [['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }]]);
function R(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (r) {
    if ((e == null || e(r), n === !1 || !r.defaultPrevented)) return t == null ? void 0 : t(r);
  };
}
function ho(e, t) {
  typeof e == 'function' ? e(t) : e != null && (e.current = t);
}
function tt(...e) {
  return t => e.forEach(n => ho(n, t));
}
function X(...e) {
  return V(tt(...e), e);
}
function Le(e, t = []) {
  let n = [];
  function o(c, s) {
    const i = /* @__PURE__ */ Ve(s),
      d = n.length;
    n = [...n, s];
    function l(a) {
      const { scope: $, children: f, ...p } = a,
        m = ($ == null ? void 0 : $[e][d]) || i,
        h = je(() => p, Object.values(p));
      return /* @__PURE__ */ v(
        m.Provider,
        {
          value: h,
        },
        f,
      );
    }
    function u(a, $) {
      const f = ($ == null ? void 0 : $[e][d]) || i,
        p = wt(f);
      if (p) return p;
      if (s !== void 0) return s;
      throw new Error(`\`${a}\` must be used within \`${c}\``);
    }
    return (l.displayName = c + 'Provider'), [l, u];
  }
  const r = () => {
    const c = n.map(s => /* @__PURE__ */ Ve(s));
    return function (i) {
      const d = (i == null ? void 0 : i[e]) || c;
      return je(
        () => ({
          [`__scope${e}`]: {
            ...i,
            [e]: d,
          },
        }),
        [i, d],
      );
    };
  };
  return (r.scopeName = e), [o, bo(r, ...t)];
}
function bo(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const o = e.map(r => ({
      useScope: r(),
      scopeName: r.scopeName,
    }));
    return function (c) {
      const s = o.reduce((i, { useScope: d, scopeName: l }) => {
        const a = d(c)[`__scope${l}`];
        return {
          ...i,
          ...a,
        };
      }, {});
      return je(
        () => ({
          [`__scope${t.scopeName}`]: s,
        }),
        [s],
      );
    };
  };
  return (n.scopeName = t.scopeName), n;
}
function Q(e) {
  const t = F(e);
  return (
    G(() => {
      t.current = e;
    }),
    je(
      () =>
        (...n) => {
          var o;
          return (o = t.current) === null || o === void 0 ? void 0 : o.call(t, ...n);
        },
      [],
    )
  );
}
function _t({ prop: e, defaultProp: t, onChange: n = () => {} }) {
  const [o, r] = vo({
      defaultProp: t,
      onChange: n,
    }),
    c = e !== void 0,
    s = c ? e : o,
    i = Q(n),
    d = V(
      l => {
        if (c) {
          const a = typeof l == 'function' ? l(e) : l;
          a !== e && i(a);
        } else r(l);
      },
      [c, e, r, i],
    );
  return [s, d];
}
function vo({ defaultProp: e, onChange: t }) {
  const n = W(e),
    [o] = n,
    r = F(o),
    c = Q(t);
  return (
    G(() => {
      r.current !== o && (c(o), (r.current = o));
    }, [o, r, c]),
    n
  );
}
const Te = /* @__PURE__ */ D((e, t) => {
  const { children: n, ...o } = e,
    r = Ce.toArray(n),
    c = r.find(wo);
  if (c) {
    const s = c.props.children,
      i = r.map(d =>
        d === c
          ? Ce.count(s) > 1
            ? Ce.only(null)
            : /* @__PURE__ */ Ye(s)
            ? s.props.children
            : null
          : d,
      );
    return /* @__PURE__ */ v(
      ft,
      _({}, o, {
        ref: t,
      }),
      /* @__PURE__ */ Ye(s) ? /* @__PURE__ */ xt(s, void 0, i) : null,
    );
  }
  return /* @__PURE__ */ v(
    ft,
    _({}, o, {
      ref: t,
    }),
    n,
  );
});
Te.displayName = 'Slot';
const ft = /* @__PURE__ */ D((e, t) => {
  const { children: n, ...o } = e;
  return /* @__PURE__ */ Ye(n)
    ? /* @__PURE__ */ xt(n, {
        ...xo(o, n.props),
        ref: t ? tt(t, n.ref) : n.ref,
      })
    : Ce.count(n) > 1
    ? Ce.only(null)
    : null;
});
ft.displayName = 'SlotClone';
const go = ({ children: e }) => /* @__PURE__ */ v(Jt, null, e);
function wo(e) {
  return /* @__PURE__ */ Ye(e) && e.type === go;
}
function xo(e, t) {
  const n = {
    ...t,
  };
  for (const o in t) {
    const r = e[o],
      c = t[o];
    /^on[A-Z]/.test(o)
      ? r && c
        ? (n[o] = (...i) => {
            c(...i), r(...i);
          })
        : r && (n[o] = r)
      : o === 'style'
      ? (n[o] = {
          ...r,
          ...c,
        })
      : o === 'className' && (n[o] = [r, c].filter(Boolean).join(' '));
  }
  return {
    ...e,
    ...n,
  };
}
const yo = [
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
  q = yo.reduce((e, t) => {
    const n = /* @__PURE__ */ D((o, r) => {
      const { asChild: c, ...s } = o,
        i = c ? Te : t;
      return (
        G(() => {
          window[Symbol.for('radix-ui')] = !0;
        }, []),
        /* @__PURE__ */ v(
          i,
          _({}, s, {
            ref: r,
          }),
        )
      );
    });
    return (
      (n.displayName = `Primitive.${t}`),
      {
        ...e,
        [t]: n,
      }
    );
  }, {});
function tn(e, t) {
  e && en(() => e.dispatchEvent(t));
}
function nn(e) {
  const t = e + 'CollectionProvider',
    [n, o] = Le(t),
    [r, c] = n(t, {
      collectionRef: {
        current: null,
      },
      itemMap: /* @__PURE__ */ new Map(),
    }),
    s = f => {
      const { scope: p, children: m } = f,
        h = re.useRef(null),
        b = re.useRef(/* @__PURE__ */ new Map()).current;
      return /* @__PURE__ */ re.createElement(
        r,
        {
          scope: p,
          itemMap: b,
          collectionRef: h,
        },
        m,
      );
    },
    i = e + 'CollectionSlot',
    d = /* @__PURE__ */ re.forwardRef((f, p) => {
      const { scope: m, children: h } = f,
        b = c(i, m),
        g = X(p, b.collectionRef);
      return /* @__PURE__ */ re.createElement(
        Te,
        {
          ref: g,
        },
        h,
      );
    }),
    l = e + 'CollectionItemSlot',
    u = 'data-radix-collection-item',
    a = /* @__PURE__ */ re.forwardRef((f, p) => {
      const { scope: m, children: h, ...b } = f,
        g = re.useRef(null),
        x = X(p, g),
        w = c(l, m);
      return (
        re.useEffect(
          () => (
            w.itemMap.set(g, {
              ref: g,
              ...b,
            }),
            () => void w.itemMap.delete(g)
          ),
        ),
        /* @__PURE__ */ re.createElement(
          Te,
          {
            [u]: '',
            ref: x,
          },
          h,
        )
      );
    });
  function $(f) {
    const p = c(e + 'CollectionConsumer', f);
    return re.useCallback(() => {
      const h = p.collectionRef.current;
      if (!h) return [];
      const b = Array.from(h.querySelectorAll(`[${u}]`));
      return Array.from(p.itemMap.values()).sort(
        (w, y) => b.indexOf(w.ref.current) - b.indexOf(y.ref.current),
      );
    }, [p.collectionRef, p.itemMap]);
  }
  return [
    {
      Provider: s,
      Slot: d,
      ItemSlot: a,
    },
    $,
    o,
  ];
}
const _o = /* @__PURE__ */ Ve(void 0);
function on(e) {
  const t = wt(_o);
  return e || t || 'ltr';
}
function Co(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Q(e);
  G(() => {
    const o = r => {
      r.key === 'Escape' && n(r);
    };
    return t.addEventListener('keydown', o), () => t.removeEventListener('keydown', o);
  }, [n, t]);
}
const pt = 'dismissableLayer.update',
  Eo = 'dismissableLayer.pointerDownOutside',
  Po = 'dismissableLayer.focusOutside';
let Ot;
const Mo = /* @__PURE__ */ Ve({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set(),
  }),
  Do = /* @__PURE__ */ D((e, t) => {
    var n;
    const {
        disableOutsidePointerEvents: o = !1,
        onEscapeKeyDown: r,
        onPointerDownOutside: c,
        onFocusOutside: s,
        onInteractOutside: i,
        onDismiss: d,
        ...l
      } = e,
      u = wt(Mo),
      [a, $] = W(null),
      f =
        (n = a == null ? void 0 : a.ownerDocument) !== null && n !== void 0
          ? n
          : globalThis == null
          ? void 0
          : globalThis.document,
      [, p] = W({}),
      m = X(t, M => $(M)),
      h = Array.from(u.layers),
      [b] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1),
      g = h.indexOf(b),
      x = a ? h.indexOf(a) : -1,
      w = u.layersWithOutsidePointerEventsDisabled.size > 0,
      y = x >= g,
      E = So(M => {
        const I = M.target,
          L = [...u.branches].some(S => S.contains(I));
        !y || L || (c == null || c(M), i == null || i(M), M.defaultPrevented || d == null || d());
      }, f),
      C = To(M => {
        const I = M.target;
        [...u.branches].some(S => S.contains(I)) ||
          (s == null || s(M), i == null || i(M), M.defaultPrevented || d == null || d());
      }, f);
    return (
      Co(M => {
        x === u.layers.size - 1 &&
          (r == null || r(M), !M.defaultPrevented && d && (M.preventDefault(), d()));
      }, f),
      G(() => {
        if (a)
          return (
            o &&
              (u.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Ot = f.body.style.pointerEvents), (f.body.style.pointerEvents = 'none')),
              u.layersWithOutsidePointerEventsDisabled.add(a)),
            u.layers.add(a),
            It(),
            () => {
              o &&
                u.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (f.body.style.pointerEvents = Ot);
            }
          );
      }, [a, f, o, u]),
      G(
        () => () => {
          a && (u.layers.delete(a), u.layersWithOutsidePointerEventsDisabled.delete(a), It());
        },
        [a, u],
      ),
      G(() => {
        const M = () => p({});
        return document.addEventListener(pt, M), () => document.removeEventListener(pt, M);
      }, []),
      /* @__PURE__ */ v(
        q.div,
        _({}, l, {
          ref: m,
          style: {
            pointerEvents: w ? (y ? 'auto' : 'none') : void 0,
            ...e.style,
          },
          onFocusCapture: R(e.onFocusCapture, C.onFocusCapture),
          onBlurCapture: R(e.onBlurCapture, C.onBlurCapture),
          onPointerDownCapture: R(e.onPointerDownCapture, E.onPointerDownCapture),
        }),
      )
    );
  });
function So(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Q(e),
    o = F(!1),
    r = F(() => {});
  return (
    G(() => {
      const c = i => {
          if (i.target && !o.current) {
            let l = function () {
              rn(Eo, n, d, {
                discrete: !0,
              });
            };
            const d = {
              originalEvent: i,
            };
            i.pointerType === 'touch'
              ? (t.removeEventListener('click', r.current),
                (r.current = l),
                t.addEventListener('click', r.current, {
                  once: !0,
                }))
              : l();
          }
          o.current = !1;
        },
        s = window.setTimeout(() => {
          t.addEventListener('pointerdown', c);
        }, 0);
      return () => {
        window.clearTimeout(s),
          t.removeEventListener('pointerdown', c),
          t.removeEventListener('click', r.current);
      };
    }, [t, n]),
    {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => (o.current = !0),
    }
  );
}
function To(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Q(e),
    o = F(!1);
  return (
    G(() => {
      const r = c => {
        c.target &&
          !o.current &&
          rn(
            Po,
            n,
            {
              originalEvent: c,
            },
            {
              discrete: !1,
            },
          );
      };
      return t.addEventListener('focusin', r), () => t.removeEventListener('focusin', r);
    }, [t, n]),
    {
      onFocusCapture: () => (o.current = !0),
      onBlurCapture: () => (o.current = !1),
    }
  );
}
function It() {
  const e = new CustomEvent(pt);
  document.dispatchEvent(e);
}
function rn(e, t, n, { discrete: o }) {
  const r = n.originalEvent.target,
    c = new CustomEvent(e, {
      bubbles: !1,
      cancelable: !0,
      detail: n,
    });
  t &&
    r.addEventListener(e, t, {
      once: !0,
    }),
    o ? tn(r, c) : r.dispatchEvent(c);
}
let st = 0;
function Ro() {
  G(() => {
    var e, t;
    const n = document.querySelectorAll('[data-radix-focus-guard]');
    return (
      document.body.insertAdjacentElement(
        'afterbegin',
        (e = n[0]) !== null && e !== void 0 ? e : At(),
      ),
      document.body.insertAdjacentElement(
        'beforeend',
        (t = n[1]) !== null && t !== void 0 ? t : At(),
      ),
      st++,
      () => {
        st === 1 && document.querySelectorAll('[data-radix-focus-guard]').forEach(o => o.remove()),
          st--;
      }
    );
  }, []);
}
function At() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none'),
    e
  );
}
const at = 'focusScope.autoFocusOnMount',
  dt = 'focusScope.autoFocusOnUnmount',
  Nt = {
    bubbles: !1,
    cancelable: !0,
  },
  Oo = /* @__PURE__ */ D((e, t) => {
    const { loop: n = !1, trapped: o = !1, onMountAutoFocus: r, onUnmountAutoFocus: c, ...s } = e,
      [i, d] = W(null),
      l = Q(r),
      u = Q(c),
      a = F(null),
      $ = X(t, m => d(m)),
      f = F({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    G(() => {
      if (o) {
        let m = function (x) {
            if (f.paused || !i) return;
            const w = x.target;
            i.contains(w)
              ? (a.current = w)
              : pe(a.current, {
                  select: !0,
                });
          },
          h = function (x) {
            if (f.paused || !i) return;
            const w = x.relatedTarget;
            w !== null &&
              (i.contains(w) ||
                pe(a.current, {
                  select: !0,
                }));
          },
          b = function (x) {
            const w = document.activeElement;
            for (const y of x) y.removedNodes.length > 0 && ((i != null && i.contains(w)) || pe(i));
          };
        document.addEventListener('focusin', m), document.addEventListener('focusout', h);
        const g = new MutationObserver(b);
        return (
          i &&
            g.observe(i, {
              childList: !0,
              subtree: !0,
            }),
          () => {
            document.removeEventListener('focusin', m),
              document.removeEventListener('focusout', h),
              g.disconnect();
          }
        );
      }
    }, [o, i, f.paused]),
      G(() => {
        if (i) {
          Lt.add(f);
          const m = document.activeElement;
          if (!i.contains(m)) {
            const b = new CustomEvent(at, Nt);
            i.addEventListener(at, l),
              i.dispatchEvent(b),
              b.defaultPrevented ||
                (Io(ko(cn(i)), {
                  select: !0,
                }),
                document.activeElement === m && pe(i));
          }
          return () => {
            i.removeEventListener(at, l),
              setTimeout(() => {
                const b = new CustomEvent(dt, Nt);
                i.addEventListener(dt, u),
                  i.dispatchEvent(b),
                  b.defaultPrevented ||
                    pe(m ?? document.body, {
                      select: !0,
                    }),
                  i.removeEventListener(dt, u),
                  Lt.remove(f);
              }, 0);
          };
        }
      }, [i, l, u, f]);
    const p = V(
      m => {
        if ((!n && !o) || f.paused) return;
        const h = m.key === 'Tab' && !m.altKey && !m.ctrlKey && !m.metaKey,
          b = document.activeElement;
        if (h && b) {
          const g = m.currentTarget,
            [x, w] = Ao(g);
          x && w
            ? !m.shiftKey && b === w
              ? (m.preventDefault(),
                n &&
                  pe(x, {
                    select: !0,
                  }))
              : m.shiftKey &&
                b === x &&
                (m.preventDefault(),
                n &&
                  pe(w, {
                    select: !0,
                  }))
            : b === g && m.preventDefault();
        }
      },
      [n, o, f.paused],
    );
    return /* @__PURE__ */ v(
      q.div,
      _(
        {
          tabIndex: -1,
        },
        s,
        {
          ref: $,
          onKeyDown: p,
        },
      ),
    );
  });
function Io(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const o of e)
    if (
      (pe(o, {
        select: t,
      }),
      document.activeElement !== n)
    )
      return;
}
function Ao(e) {
  const t = cn(e),
    n = Ft(t, e),
    o = Ft(t.reverse(), e);
  return [n, o];
}
function cn(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: o => {
        const r = o.tagName === 'INPUT' && o.type === 'hidden';
        return o.disabled || o.hidden || r
          ? NodeFilter.FILTER_SKIP
          : o.tabIndex >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Ft(e, t) {
  for (const n of e)
    if (
      !No(n, {
        upTo: t,
      })
    )
      return n;
}
function No(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === 'hidden') return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === 'none') return !0;
    e = e.parentElement;
  }
  return !1;
}
function Fo(e) {
  return e instanceof HTMLInputElement && 'select' in e;
}
function pe(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({
      preventScroll: !0,
    }),
      e !== n && Fo(e) && t && e.select();
  }
}
const Lt = Lo();
function Lo() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), (e = kt(e, t)), e.unshift(t);
    },
    remove(t) {
      var n;
      (e = kt(e, t)), (n = e[0]) === null || n === void 0 || n.resume();
    },
  };
}
function kt(e, t) {
  const n = [...e],
    o = n.indexOf(t);
  return o !== -1 && n.splice(o, 1), n;
}
function ko(e) {
  return e.filter(t => t.tagName !== 'A');
}
const Pe = globalThis != null && globalThis.document ? Qt : () => {},
  Uo = U['useId'.toString()] || (() => {});
let Ko = 0;
function Re(e) {
  const [t, n] = U.useState(Uo());
  return (
    Pe(() => {
      e || n(o => o ?? String(Ko++));
    }, [e]),
    e || (t ? `radix-${t}` : '')
  );
}
function De(e) {
  return e.split('-')[1];
}
function Ct(e) {
  return e === 'y' ? 'height' : 'width';
}
function se(e) {
  return e.split('-')[0];
}
function ye(e) {
  return ['top', 'bottom'].includes(se(e)) ? 'x' : 'y';
}
function Ut(e, t, n) {
  let { reference: o, floating: r } = e;
  const c = o.x + o.width / 2 - r.width / 2,
    s = o.y + o.height / 2 - r.height / 2,
    i = ye(t),
    d = Ct(i),
    l = o[d] / 2 - r[d] / 2,
    u = i === 'x';
  let a;
  switch (se(t)) {
    case 'top':
      a = { x: c, y: o.y - r.height };
      break;
    case 'bottom':
      a = { x: c, y: o.y + o.height };
      break;
    case 'right':
      a = { x: o.x + o.width, y: s };
      break;
    case 'left':
      a = { x: o.x - r.width, y: s };
      break;
    default:
      a = { x: o.x, y: o.y };
  }
  switch (De(t)) {
    case 'start':
      a[i] -= l * (n && u ? -1 : 1);
      break;
    case 'end':
      a[i] += l * (n && u ? -1 : 1);
  }
  return a;
}
const Bo = async (e, t, n) => {
  const { placement: o = 'bottom', strategy: r = 'absolute', middleware: c = [], platform: s } = n,
    i = c.filter(Boolean),
    d = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let l = await s.getElementRects({ reference: e, floating: t, strategy: r }),
    { x: u, y: a } = Ut(l, o, d),
    $ = o,
    f = {},
    p = 0;
  for (let m = 0; m < i.length; m++) {
    const { name: h, fn: b } = i[m],
      {
        x: g,
        y: x,
        data: w,
        reset: y,
      } = await b({
        x: u,
        y: a,
        initialPlacement: o,
        placement: $,
        strategy: r,
        middlewareData: f,
        rects: l,
        platform: s,
        elements: { reference: e, floating: t },
      });
    (u = g ?? u),
      (a = x ?? a),
      (f = { ...f, [h]: { ...f[h], ...w } }),
      y &&
        p <= 50 &&
        (p++,
        typeof y == 'object' &&
          (y.placement && ($ = y.placement),
          y.rects &&
            (l =
              y.rects === !0
                ? await s.getElementRects({ reference: e, floating: t, strategy: r })
                : y.rects),
          ({ x: u, y: a } = Ut(l, $, d))),
        (m = -1));
  }
  return { x: u, y: a, placement: $, strategy: r, middlewareData: f };
};
function le(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function sn(e) {
  return typeof e != 'number'
    ? (function (t) {
        return { top: 0, right: 0, bottom: 0, left: 0, ...t };
      })(e)
    : { top: e, right: e, bottom: e, left: e };
}
function Xe(e) {
  return { ...e, top: e.y, left: e.x, right: e.x + e.width, bottom: e.y + e.height };
}
async function Oe(e, t) {
  var n;
  t === void 0 && (t = {});
  const { x: o, y: r, platform: c, rects: s, elements: i, strategy: d } = e,
    {
      boundary: l = 'clippingAncestors',
      rootBoundary: u = 'viewport',
      elementContext: a = 'floating',
      altBoundary: $ = !1,
      padding: f = 0,
    } = le(t, e),
    p = sn(f),
    m = i[$ ? (a === 'floating' ? 'reference' : 'floating') : a],
    h = Xe(
      await c.getClippingRect({
        element:
          (n = await (c.isElement == null ? void 0 : c.isElement(m))) == null || n
            ? m
            : m.contextElement ||
              (await (c.getDocumentElement == null ? void 0 : c.getDocumentElement(i.floating))),
        boundary: l,
        rootBoundary: u,
        strategy: d,
      }),
    ),
    b = a === 'floating' ? { ...s.floating, x: o, y: r } : s.reference,
    g = await (c.getOffsetParent == null ? void 0 : c.getOffsetParent(i.floating)),
    x = ((await (c.isElement == null ? void 0 : c.isElement(g))) &&
      (await (c.getScale == null ? void 0 : c.getScale(g)))) || { x: 1, y: 1 },
    w = Xe(
      c.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await c.convertOffsetParentRelativeRectToViewportRelativeRect({
            rect: b,
            offsetParent: g,
            strategy: d,
          })
        : b,
    );
  return {
    top: (h.top - w.top + p.top) / x.y,
    bottom: (w.bottom - h.bottom + p.bottom) / x.y,
    left: (h.left - w.left + p.left) / x.x,
    right: (w.right - h.right + p.right) / x.x,
  };
}
const Ie = Math.min,
  ge = Math.max;
function mt(e, t, n) {
  return ge(e, Ie(t, n));
}
const Kt = e => ({
    name: 'arrow',
    options: e,
    async fn(t) {
      const { x: n, y: o, placement: r, rects: c, platform: s, elements: i } = t,
        { element: d, padding: l = 0 } = le(e, t) || {};
      if (d == null) return {};
      const u = sn(l),
        a = { x: n, y: o },
        $ = ye(r),
        f = Ct($),
        p = await s.getDimensions(d),
        m = $ === 'y',
        h = m ? 'top' : 'left',
        b = m ? 'bottom' : 'right',
        g = m ? 'clientHeight' : 'clientWidth',
        x = c.reference[f] + c.reference[$] - a[$] - c.floating[f],
        w = a[$] - c.reference[$],
        y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(d));
      let E = y ? y[g] : 0;
      (E && (await (s.isElement == null ? void 0 : s.isElement(y)))) ||
        (E = i.floating[g] || c.floating[f]);
      const C = x / 2 - w / 2,
        M = E / 2 - p[f] / 2 - 1,
        I = Ie(u[h], M),
        L = Ie(u[b], M),
        S = I,
        k = E - p[f] - L,
        O = E / 2 - p[f] / 2 + C,
        A = mt(S, O, k),
        N =
          De(r) != null && O != A && c.reference[f] / 2 - (O < S ? I : L) - p[f] / 2 < 0
            ? O < S
              ? S - O
              : k - O
            : 0;
      return { [$]: a[$] - N, data: { [$]: A, centerOffset: O - A + N } };
    },
  }),
  an = ['top', 'right', 'bottom', 'left'];
an.reduce((e, t) => e.concat(t, t + '-start', t + '-end'), []);
const Go = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
function qe(e) {
  return e.replace(/left|right|bottom|top/g, t => Go[t]);
}
function Wo(e, t, n) {
  n === void 0 && (n = !1);
  const o = De(e),
    r = ye(e),
    c = Ct(r);
  let s =
    r === 'x' ? (o === (n ? 'end' : 'start') ? 'right' : 'left') : o === 'start' ? 'bottom' : 'top';
  return t.reference[c] > t.floating[c] && (s = qe(s)), { main: s, cross: qe(s) };
}
const Ho = { start: 'end', end: 'start' };
function lt(e) {
  return e.replace(/start|end/g, t => Ho[t]);
}
const zo = function (e) {
  return (
    e === void 0 && (e = {}),
    {
      name: 'flip',
      options: e,
      async fn(t) {
        var n;
        const {
            placement: o,
            middlewareData: r,
            rects: c,
            initialPlacement: s,
            platform: i,
            elements: d,
          } = t,
          {
            mainAxis: l = !0,
            crossAxis: u = !0,
            fallbackPlacements: a,
            fallbackStrategy: $ = 'bestFit',
            fallbackAxisSideDirection: f = 'none',
            flipAlignment: p = !0,
            ...m
          } = le(e, t),
          h = se(o),
          b = se(s) === s,
          g = await (i.isRTL == null ? void 0 : i.isRTL(d.floating)),
          x =
            a ||
            (b || !p
              ? [qe(s)]
              : (function (S) {
                  const k = qe(S);
                  return [lt(S), k, lt(k)];
                })(s));
        a ||
          f === 'none' ||
          x.push(
            ...(function (S, k, O, A) {
              const N = De(S);
              let T = (function (H, B, P) {
                const K = ['left', 'right'],
                  z = ['right', 'left'],
                  Z = ['top', 'bottom'],
                  ce = ['bottom', 'top'];
                switch (H) {
                  case 'top':
                  case 'bottom':
                    return P ? (B ? z : K) : B ? K : z;
                  case 'left':
                  case 'right':
                    return B ? Z : ce;
                  default:
                    return [];
                }
              })(se(S), O === 'start', A);
              return N && ((T = T.map(H => H + '-' + N)), k && (T = T.concat(T.map(lt)))), T;
            })(s, p, f, g),
          );
        const w = [s, ...x],
          y = await Oe(t, m),
          E = [];
        let C = ((n = r.flip) == null ? void 0 : n.overflows) || [];
        if ((l && E.push(y[h]), u)) {
          const { main: S, cross: k } = Wo(o, c, g);
          E.push(y[S], y[k]);
        }
        if (((C = [...C, { placement: o, overflows: E }]), !E.every(S => S <= 0))) {
          var M, I;
          const S = (((M = r.flip) == null ? void 0 : M.index) || 0) + 1,
            k = w[S];
          if (k) return { data: { index: S, overflows: C }, reset: { placement: k } };
          let O =
            (I = C.filter(A => A.overflows[0] <= 0).sort(
              (A, N) => A.overflows[1] - N.overflows[1],
            )[0]) == null
              ? void 0
              : I.placement;
          if (!O)
            switch ($) {
              case 'bestFit': {
                var L;
                const A =
                  (L = C.map(N => [
                    N.placement,
                    N.overflows.filter(T => T > 0).reduce((T, H) => T + H, 0),
                  ]).sort((N, T) => N[1] - T[1])[0]) == null
                    ? void 0
                    : L[0];
                A && (O = A);
                break;
              }
              case 'initialPlacement':
                O = s;
            }
          if (o !== O) return { reset: { placement: O } };
        }
        return {};
      },
    }
  );
};
function Bt(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width,
  };
}
function Gt(e) {
  return an.some(t => e[t] >= 0);
}
const Vo = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: 'hide',
        options: e,
        async fn(t) {
          const { rects: n } = t,
            { strategy: o = 'referenceHidden', ...r } = le(e, t);
          switch (o) {
            case 'referenceHidden': {
              const c = Bt(await Oe(t, { ...r, elementContext: 'reference' }), n.reference);
              return { data: { referenceHiddenOffsets: c, referenceHidden: Gt(c) } };
            }
            case 'escaped': {
              const c = Bt(await Oe(t, { ...r, altBoundary: !0 }), n.floating);
              return { data: { escapedOffsets: c, escaped: Gt(c) } };
            }
            default:
              return {};
          }
        },
      }
    );
  },
  jo = function (e) {
    return (
      e === void 0 && (e = 0),
      {
        name: 'offset',
        options: e,
        async fn(t) {
          const { x: n, y: o } = t,
            r = await (async function (c, s) {
              const { placement: i, platform: d, elements: l } = c,
                u = await (d.isRTL == null ? void 0 : d.isRTL(l.floating)),
                a = se(i),
                $ = De(i),
                f = ye(i) === 'x',
                p = ['left', 'top'].includes(a) ? -1 : 1,
                m = u && f ? -1 : 1,
                h = le(s, c);
              let {
                mainAxis: b,
                crossAxis: g,
                alignmentAxis: x,
              } = typeof h == 'number'
                ? { mainAxis: h, crossAxis: 0, alignmentAxis: null }
                : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...h };
              return (
                $ && typeof x == 'number' && (g = $ === 'end' ? -1 * x : x),
                f ? { x: g * m, y: b * p } : { x: b * p, y: g * m }
              );
            })(t, e);
          return { x: n + r.x, y: o + r.y, data: r };
        },
      }
    );
  };
function dn(e) {
  return e === 'x' ? 'y' : 'x';
}
const Yo = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: 'shift',
        options: e,
        async fn(t) {
          const { x: n, y: o, placement: r } = t,
            {
              mainAxis: c = !0,
              crossAxis: s = !1,
              limiter: i = {
                fn: h => {
                  let { x: b, y: g } = h;
                  return { x: b, y: g };
                },
              },
              ...d
            } = le(e, t),
            l = { x: n, y: o },
            u = await Oe(t, d),
            a = ye(se(r)),
            $ = dn(a);
          let f = l[a],
            p = l[$];
          if (c) {
            const h = a === 'y' ? 'bottom' : 'right';
            f = mt(f + u[a === 'y' ? 'top' : 'left'], f, f - u[h]);
          }
          if (s) {
            const h = $ === 'y' ? 'bottom' : 'right';
            p = mt(p + u[$ === 'y' ? 'top' : 'left'], p, p - u[h]);
          }
          const m = i.fn({ ...t, [a]: f, [$]: p });
          return { ...m, data: { x: m.x - n, y: m.y - o } };
        },
      }
    );
  },
  Xo = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        options: e,
        fn(t) {
          const { x: n, y: o, placement: r, rects: c, middlewareData: s } = t,
            { offset: i = 0, mainAxis: d = !0, crossAxis: l = !0 } = le(e, t),
            u = { x: n, y: o },
            a = ye(r),
            $ = dn(a);
          let f = u[a],
            p = u[$];
          const m = le(i, t),
            h =
              typeof m == 'number'
                ? { mainAxis: m, crossAxis: 0 }
                : { mainAxis: 0, crossAxis: 0, ...m };
          if (d) {
            const x = a === 'y' ? 'height' : 'width',
              w = c.reference[a] - c.floating[x] + h.mainAxis,
              y = c.reference[a] + c.reference[x] - h.mainAxis;
            f < w ? (f = w) : f > y && (f = y);
          }
          if (l) {
            var b, g;
            const x = a === 'y' ? 'width' : 'height',
              w = ['top', 'left'].includes(se(r)),
              y =
                c.reference[$] -
                c.floating[x] +
                ((w && ((b = s.offset) == null ? void 0 : b[$])) || 0) +
                (w ? 0 : h.crossAxis),
              E =
                c.reference[$] +
                c.reference[x] +
                (w ? 0 : ((g = s.offset) == null ? void 0 : g[$]) || 0) -
                (w ? h.crossAxis : 0);
            p < y ? (p = y) : p > E && (p = E);
          }
          return { [a]: f, [$]: p };
        },
      }
    );
  },
  qo = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: 'size',
        options: e,
        async fn(t) {
          const { placement: n, rects: o, platform: r, elements: c } = t,
            { apply: s = () => {}, ...i } = le(e, t),
            d = await Oe(t, i),
            l = se(n),
            u = De(n),
            a = ye(n) === 'x',
            { width: $, height: f } = o.floating;
          let p, m;
          l === 'top' || l === 'bottom'
            ? ((p = l),
              (m =
                u === ((await (r.isRTL == null ? void 0 : r.isRTL(c.floating))) ? 'start' : 'end')
                  ? 'left'
                  : 'right'))
            : ((m = l), (p = u === 'end' ? 'top' : 'bottom'));
          const h = f - d[p],
            b = $ - d[m],
            g = !t.middlewareData.shift;
          let x = h,
            w = b;
          if (a) {
            const E = $ - d.left - d.right;
            w = u || g ? Ie(b, E) : E;
          } else {
            const E = f - d.top - d.bottom;
            x = u || g ? Ie(h, E) : E;
          }
          if (g && !u) {
            const E = ge(d.left, 0),
              C = ge(d.right, 0),
              M = ge(d.top, 0),
              I = ge(d.bottom, 0);
            a
              ? (w = $ - 2 * (E !== 0 || C !== 0 ? E + C : ge(d.left, d.right)))
              : (x = f - 2 * (M !== 0 || I !== 0 ? M + I : ge(d.top, d.bottom)));
          }
          await s({ ...t, availableWidth: w, availableHeight: x });
          const y = await r.getDimensions(c.floating);
          return $ !== y.width || f !== y.height ? { reset: { rects: !0 } } : {};
        },
      }
    );
  };
function J(e) {
  var t;
  return ((t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function te(e) {
  return J(e).getComputedStyle(e);
}
function ln(e) {
  return e instanceof J(e).Node;
}
function me(e) {
  return ln(e) ? (e.nodeName || '').toLowerCase() : '#document';
}
function oe(e) {
  return e instanceof J(e).HTMLElement;
}
function ae(e) {
  return e instanceof J(e).Element;
}
function Wt(e) {
  return typeof ShadowRoot < 'u' && (e instanceof J(e).ShadowRoot || e instanceof ShadowRoot);
}
function Ae(e) {
  const { overflow: t, overflowX: n, overflowY: o, display: r } = te(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && !['inline', 'contents'].includes(r);
}
function Zo(e) {
  return ['table', 'td', 'th'].includes(me(e));
}
function $t(e) {
  const t = Et(),
    n = te(e);
  return (
    n.transform !== 'none' ||
    n.perspective !== 'none' ||
    (!t && !!n.backdropFilter && n.backdropFilter !== 'none') ||
    (!t && !!n.filter && n.filter !== 'none') ||
    ['transform', 'perspective', 'filter'].some(o => (n.willChange || '').includes(o)) ||
    ['paint', 'layout', 'strict', 'content'].some(o => (n.contain || '').includes(o))
  );
}
function Et() {
  return !(typeof CSS > 'u' || !CSS.supports) && CSS.supports('-webkit-backdrop-filter', 'none');
}
function nt(e) {
  return ['html', 'body', '#document'].includes(me(e));
}
const Ht = Math.min,
  Se = Math.max,
  Ze = Math.round,
  Ge = Math.floor,
  we = e => ({ x: e, y: e });
function un(e) {
  const t = te(e);
  let n = parseFloat(t.width) || 0,
    o = parseFloat(t.height) || 0;
  const r = oe(e),
    c = r ? e.offsetWidth : n,
    s = r ? e.offsetHeight : o,
    i = Ze(n) !== c || Ze(o) !== s;
  return i && ((n = c), (o = s)), { width: n, height: o, $: i };
}
function Pt(e) {
  return ae(e) ? e : e.contextElement;
}
function Ee(e) {
  const t = Pt(e);
  if (!oe(t)) return we(1);
  const n = t.getBoundingClientRect(),
    { width: o, height: r, $: c } = un(t);
  let s = (c ? Ze(n.width) : n.width) / o,
    i = (c ? Ze(n.height) : n.height) / r;
  return (s && Number.isFinite(s)) || (s = 1), (i && Number.isFinite(i)) || (i = 1), { x: s, y: i };
}
const zt = we(0);
function fn(e, t, n) {
  var o, r;
  if ((t === void 0 && (t = !0), !Et())) return zt;
  const c = e ? J(e) : window;
  return !n || (t && n !== c)
    ? zt
    : {
        x: ((o = c.visualViewport) == null ? void 0 : o.offsetLeft) || 0,
        y: ((r = c.visualViewport) == null ? void 0 : r.offsetTop) || 0,
      };
}
function xe(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(),
    c = Pt(e);
  let s = we(1);
  t && (o ? ae(o) && (s = Ee(o)) : (s = Ee(e)));
  const i = fn(c, n, o);
  let d = (r.left + i.x) / s.x,
    l = (r.top + i.y) / s.y,
    u = r.width / s.x,
    a = r.height / s.y;
  if (c) {
    const $ = J(c),
      f = o && ae(o) ? J(o) : o;
    let p = $.frameElement;
    for (; p && o && f !== $; ) {
      const m = Ee(p),
        h = p.getBoundingClientRect(),
        b = getComputedStyle(p),
        g = h.left + (p.clientLeft + parseFloat(b.paddingLeft)) * m.x,
        x = h.top + (p.clientTop + parseFloat(b.paddingTop)) * m.y;
      (d *= m.x), (l *= m.y), (u *= m.x), (a *= m.y), (d += g), (l += x), (p = J(p).frameElement);
    }
  }
  return Xe({ width: u, height: a, x: d, y: l });
}
function de(e) {
  return ((ln(e) ? e.ownerDocument : e.document) || window.document).documentElement;
}
function ot(e) {
  return ae(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.pageXOffset, scrollTop: e.pageYOffset };
}
function pn(e) {
  return xe(de(e)).left + ot(e).scrollLeft;
}
function Me(e) {
  if (me(e) === 'html') return e;
  const t = e.assignedSlot || e.parentNode || (Wt(e) && e.host) || de(e);
  return Wt(t) ? t.host : t;
}
function mn(e) {
  const t = Me(e);
  return nt(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : oe(t) && Ae(t) ? t : mn(t);
}
function Je(e, t) {
  var n;
  t === void 0 && (t = []);
  const o = mn(e),
    r = o === ((n = e.ownerDocument) == null ? void 0 : n.body),
    c = J(o);
  return r ? t.concat(c, c.visualViewport || [], Ae(o) ? o : []) : t.concat(o, Je(o));
}
function Vt(e, t, n) {
  let o;
  if (t === 'viewport')
    o = (function (r, c) {
      const s = J(r),
        i = de(r),
        d = s.visualViewport;
      let l = i.clientWidth,
        u = i.clientHeight,
        a = 0,
        $ = 0;
      if (d) {
        (l = d.width), (u = d.height);
        const f = Et();
        (!f || (f && c === 'fixed')) && ((a = d.offsetLeft), ($ = d.offsetTop));
      }
      return { width: l, height: u, x: a, y: $ };
    })(e, n);
  else if (t === 'document')
    o = (function (r) {
      const c = de(r),
        s = ot(r),
        i = r.ownerDocument.body,
        d = Se(c.scrollWidth, c.clientWidth, i.scrollWidth, i.clientWidth),
        l = Se(c.scrollHeight, c.clientHeight, i.scrollHeight, i.clientHeight);
      let u = -s.scrollLeft + pn(r);
      const a = -s.scrollTop;
      return (
        te(i).direction === 'rtl' && (u += Se(c.clientWidth, i.clientWidth) - d),
        { width: d, height: l, x: u, y: a }
      );
    })(de(e));
  else if (ae(t))
    o = (function (r, c) {
      const s = xe(r, !0, c === 'fixed'),
        i = s.top + r.clientTop,
        d = s.left + r.clientLeft,
        l = oe(r) ? Ee(r) : we(1);
      return { width: r.clientWidth * l.x, height: r.clientHeight * l.y, x: d * l.x, y: i * l.y };
    })(t, n);
  else {
    const r = fn(e);
    o = { ...t, x: t.x - r.x, y: t.y - r.y };
  }
  return Xe(o);
}
function $n(e, t) {
  const n = Me(e);
  return !(n === t || !ae(n) || nt(n)) && (te(n).position === 'fixed' || $n(n, t));
}
function jt(e, t) {
  return oe(e) && te(e).position !== 'fixed' ? (t ? t(e) : e.offsetParent) : null;
}
function Yt(e, t) {
  const n = J(e);
  if (!oe(e)) return n;
  let o = jt(e, t);
  for (; o && Zo(o) && te(o).position === 'static'; ) o = jt(o, t);
  return o && (me(o) === 'html' || (me(o) === 'body' && te(o).position === 'static' && !$t(o)))
    ? n
    : o ||
        (function (r) {
          let c = Me(r);
          for (; oe(c) && !nt(c); ) {
            if ($t(c)) return c;
            c = Me(c);
          }
          return null;
        })(e) ||
        n;
}
function Jo(e, t, n) {
  const o = oe(t),
    r = de(t),
    c = n === 'fixed',
    s = xe(e, !0, c, t);
  let i = { scrollLeft: 0, scrollTop: 0 };
  const d = we(0);
  if (o || (!o && !c))
    if (((me(t) !== 'body' || Ae(r)) && (i = ot(t)), oe(t))) {
      const l = xe(t, !0, c, t);
      (d.x = l.x + t.clientLeft), (d.y = l.y + t.clientTop);
    } else r && (d.x = pn(r));
  return {
    x: s.left + i.scrollLeft - d.x,
    y: s.top + i.scrollTop - d.y,
    width: s.width,
    height: s.height,
  };
}
const Qo = {
  getClippingRect: function (e) {
    let { element: t, boundary: n, rootBoundary: o, strategy: r } = e;
    const c =
        n === 'clippingAncestors'
          ? (function (l, u) {
              const a = u.get(l);
              if (a) return a;
              let $ = Je(l).filter(h => ae(h) && me(h) !== 'body'),
                f = null;
              const p = te(l).position === 'fixed';
              let m = p ? Me(l) : l;
              for (; ae(m) && !nt(m); ) {
                const h = te(m),
                  b = $t(m);
                b || h.position !== 'fixed' || (f = null),
                  (
                    p
                      ? !b && !f
                      : (!b &&
                          h.position === 'static' &&
                          f &&
                          ['absolute', 'fixed'].includes(f.position)) ||
                        (Ae(m) && !b && $n(l, m))
                  )
                    ? ($ = $.filter(g => g !== m))
                    : (f = h),
                  (m = Me(m));
              }
              return u.set(l, $), $;
            })(t, this._c)
          : [].concat(n),
      s = [...c, o],
      i = s[0],
      d = s.reduce((l, u) => {
        const a = Vt(t, u, r);
        return (
          (l.top = Se(a.top, l.top)),
          (l.right = Ht(a.right, l.right)),
          (l.bottom = Ht(a.bottom, l.bottom)),
          (l.left = Se(a.left, l.left)),
          l
        );
      }, Vt(t, i, r));
    return { width: d.right - d.left, height: d.bottom - d.top, x: d.left, y: d.top };
  },
  convertOffsetParentRelativeRectToViewportRelativeRect: function (e) {
    let { rect: t, offsetParent: n, strategy: o } = e;
    const r = oe(n),
      c = de(n);
    if (n === c) return t;
    let s = { scrollLeft: 0, scrollTop: 0 },
      i = we(1);
    const d = we(0);
    if ((r || (!r && o !== 'fixed')) && ((me(n) !== 'body' || Ae(c)) && (s = ot(n)), oe(n))) {
      const l = xe(n);
      (i = Ee(n)), (d.x = l.x + n.clientLeft), (d.y = l.y + n.clientTop);
    }
    return {
      width: t.width * i.x,
      height: t.height * i.y,
      x: t.x * i.x - s.scrollLeft * i.x + d.x,
      y: t.y * i.y - s.scrollTop * i.y + d.y,
    };
  },
  isElement: ae,
  getDimensions: function (e) {
    return un(e);
  },
  getOffsetParent: Yt,
  getDocumentElement: de,
  getScale: Ee,
  async getElementRects(e) {
    let { reference: t, floating: n, strategy: o } = e;
    const r = this.getOffsetParent || Yt,
      c = this.getDimensions;
    return { reference: Jo(t, await r(n), o), floating: { x: 0, y: 0, ...(await c(n)) } };
  },
  getClientRects: e => Array.from(e.getClientRects()),
  isRTL: e => te(e).direction === 'rtl',
};
function er(e, t, n, o) {
  o === void 0 && (o = {});
  const {
      ancestorScroll: r = !0,
      ancestorResize: c = !0,
      elementResize: s = !0,
      layoutShift: i = typeof IntersectionObserver == 'function',
      animationFrame: d = !1,
    } = o,
    l = Pt(e),
    u = r || c ? [...(l ? Je(l) : []), ...Je(t)] : [];
  u.forEach(m => {
    r && m.addEventListener('scroll', n, { passive: !0 }), c && m.addEventListener('resize', n);
  });
  const a =
    l && i
      ? (function (m, h) {
          let b,
            g = null;
          const x = de(m);
          function w() {
            clearTimeout(b), g && g.disconnect(), (g = null);
          }
          return (
            (function y(E, C) {
              E === void 0 && (E = !1), C === void 0 && (C = 1), w();
              const { left: M, top: I, width: L, height: S } = m.getBoundingClientRect();
              if ((E || h(), !L || !S)) return;
              const k = Ge(I),
                O = Ge(x.clientWidth - (M + L)),
                A = Ge(x.clientHeight - (I + S)),
                N = Ge(M);
              let T = !0;
              (g = new IntersectionObserver(
                H => {
                  const B = H[0].intersectionRatio;
                  if (B !== C) {
                    if (!T) return y();
                    B === 0
                      ? (b = setTimeout(() => {
                          y(!1, 1e-7);
                        }, 100))
                      : y(!1, B);
                  }
                  T = !1;
                },
                { rootMargin: -k + 'px ' + -O + 'px ' + -A + 'px ' + -N + 'px', threshold: C },
              )),
                g.observe(m);
            })(!0),
            w
          );
        })(l, n)
      : null;
  let $,
    f = null;
  s && ((f = new ResizeObserver(n)), l && !d && f.observe(l), f.observe(t));
  let p = d ? xe(e) : null;
  return (
    d &&
      (function m() {
        const h = xe(e);
        !p || (h.x === p.x && h.y === p.y && h.width === p.width && h.height === p.height) || n(),
          (p = h),
          ($ = requestAnimationFrame(m));
      })(),
    n(),
    () => {
      u.forEach(m => {
        r && m.removeEventListener('scroll', n), c && m.removeEventListener('resize', n);
      }),
        a && a(),
        f && f.disconnect(),
        (f = null),
        d && cancelAnimationFrame($);
    }
  );
}
const tr = (e, t, n) => {
    const o = /* @__PURE__ */ new Map(),
      r = { platform: Qo, ...n },
      c = { ...r.platform, _c: o };
    return Bo(e, t, { ...r, platform: c });
  },
  nr = e => {
    function t(n) {
      return {}.hasOwnProperty.call(n, 'current');
    }
    return {
      name: 'arrow',
      options: e,
      fn(n) {
        const { element: o, padding: r } = typeof e == 'function' ? e(n) : e;
        return o && t(o)
          ? o.current != null
            ? Kt({
                element: o.current,
                padding: r,
              }).fn(n)
            : {}
          : o
          ? Kt({
              element: o,
              padding: r,
            }).fn(n)
          : {};
      },
    };
  };
var ze = typeof document < 'u' ? Qt : G;
function Qe(e, t) {
  if (e === t) return !0;
  if (typeof e != typeof t) return !1;
  if (typeof e == 'function' && e.toString() === t.toString()) return !0;
  let n, o, r;
  if (e && t && typeof e == 'object') {
    if (Array.isArray(e)) {
      if (((n = e.length), n != t.length)) return !1;
      for (o = n; o-- !== 0; ) if (!Qe(e[o], t[o])) return !1;
      return !0;
    }
    if (((r = Object.keys(e)), (n = r.length), n !== Object.keys(t).length)) return !1;
    for (o = n; o-- !== 0; ) if (!{}.hasOwnProperty.call(t, r[o])) return !1;
    for (o = n; o-- !== 0; ) {
      const c = r[o];
      if (!(c === '_owner' && e.$$typeof) && !Qe(e[c], t[c])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function hn(e) {
  return typeof window > 'u' ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Xt(e, t) {
  const n = hn(e);
  return Math.round(t * n) / n;
}
function qt(e) {
  const t = U.useRef(e);
  return (
    ze(() => {
      t.current = e;
    }),
    t
  );
}
function or(e) {
  e === void 0 && (e = {});
  const {
      placement: t = 'bottom',
      strategy: n = 'absolute',
      middleware: o = [],
      platform: r,
      elements: { reference: c, floating: s } = {},
      transform: i = !0,
      whileElementsMounted: d,
      open: l,
    } = e,
    [u, a] = U.useState({
      x: 0,
      y: 0,
      strategy: n,
      placement: t,
      middlewareData: {},
      isPositioned: !1,
    }),
    [$, f] = U.useState(o);
  Qe($, o) || f(o);
  const [p, m] = U.useState(null),
    [h, b] = U.useState(null),
    g = U.useCallback(
      T => {
        T != E.current && ((E.current = T), m(T));
      },
      [m],
    ),
    x = U.useCallback(
      T => {
        T !== C.current && ((C.current = T), b(T));
      },
      [b],
    ),
    w = c || p,
    y = s || h,
    E = U.useRef(null),
    C = U.useRef(null),
    M = U.useRef(u),
    I = qt(d),
    L = qt(r),
    S = U.useCallback(() => {
      if (!E.current || !C.current) return;
      const T = {
        placement: t,
        strategy: n,
        middleware: $,
      };
      L.current && (T.platform = L.current),
        tr(E.current, C.current, T).then(H => {
          const B = {
            ...H,
            isPositioned: !0,
          };
          k.current &&
            !Qe(M.current, B) &&
            ((M.current = B),
            ao.flushSync(() => {
              a(B);
            }));
        });
    }, [$, t, n, L]);
  ze(() => {
    l === !1 &&
      M.current.isPositioned &&
      ((M.current.isPositioned = !1),
      a(T => ({
        ...T,
        isPositioned: !1,
      })));
  }, [l]);
  const k = U.useRef(!1);
  ze(
    () => (
      (k.current = !0),
      () => {
        k.current = !1;
      }
    ),
    [],
  ),
    ze(() => {
      if ((w && (E.current = w), y && (C.current = y), w && y)) {
        if (I.current) return I.current(w, y, S);
        S();
      }
    }, [w, y, S, I]);
  const O = U.useMemo(
      () => ({
        reference: E,
        floating: C,
        setReference: g,
        setFloating: x,
      }),
      [g, x],
    ),
    A = U.useMemo(
      () => ({
        reference: w,
        floating: y,
      }),
      [w, y],
    ),
    N = U.useMemo(() => {
      const T = {
        position: n,
        left: 0,
        top: 0,
      };
      if (!A.floating) return T;
      const H = Xt(A.floating, u.x),
        B = Xt(A.floating, u.y);
      return i
        ? {
            ...T,
            transform: 'translate(' + H + 'px, ' + B + 'px)',
            ...(hn(A.floating) >= 1.5 && {
              willChange: 'transform',
            }),
          }
        : {
            position: n,
            left: H,
            top: B,
          };
    }, [n, i, A.floating, u.x, u.y]);
  return U.useMemo(
    () => ({
      ...u,
      update: S,
      refs: O,
      elements: A,
      floatingStyles: N,
    }),
    [u, S, O, A, N],
  );
}
function rr(e) {
  const [t, n] = W(void 0);
  return (
    Pe(() => {
      if (e) {
        n({
          width: e.offsetWidth,
          height: e.offsetHeight,
        });
        const o = new ResizeObserver(r => {
          if (!Array.isArray(r) || !r.length) return;
          const c = r[0];
          let s, i;
          if ('borderBoxSize' in c) {
            const d = c.borderBoxSize,
              l = Array.isArray(d) ? d[0] : d;
            (s = l.inlineSize), (i = l.blockSize);
          } else (s = e.offsetWidth), (i = e.offsetHeight);
          n({
            width: s,
            height: i,
          });
        });
        return (
          o.observe(e, {
            box: 'border-box',
          }),
          () => o.unobserve(e)
        );
      } else n(void 0);
    }, [e]),
    t
  );
}
const bn = 'Popper',
  [vn, gn] = Le(bn),
  [cr, wn] = vn(bn),
  ir = e => {
    const { __scopePopper: t, children: n } = e,
      [o, r] = W(null);
    return /* @__PURE__ */ v(
      cr,
      {
        scope: t,
        anchor: o,
        onAnchorChange: r,
      },
      n,
    );
  },
  sr = 'PopperAnchor',
  ar = /* @__PURE__ */ D((e, t) => {
    const { __scopePopper: n, virtualRef: o, ...r } = e,
      c = wn(sr, n),
      s = F(null),
      i = X(t, s);
    return (
      G(() => {
        c.onAnchorChange((o == null ? void 0 : o.current) || s.current);
      }),
      o
        ? null
        : /* @__PURE__ */ v(
            q.div,
            _({}, r, {
              ref: i,
            }),
          )
    );
  }),
  xn = 'PopperContent',
  [dr, mi] = vn(xn),
  lr = /* @__PURE__ */ D((e, t) => {
    var n, o, r, c, s, i, d, l;
    const {
        __scopePopper: u,
        side: a = 'bottom',
        sideOffset: $ = 0,
        align: f = 'center',
        alignOffset: p = 0,
        arrowPadding: m = 0,
        collisionBoundary: h = [],
        collisionPadding: b = 0,
        sticky: g = 'partial',
        hideWhenDetached: x = !1,
        avoidCollisions: w = !0,
        onPlaced: y,
        ...E
      } = e,
      C = wn(xn, u),
      [M, I] = W(null),
      L = X(t, it => I(it)),
      [S, k] = W(null),
      O = rr(S),
      A = (n = O == null ? void 0 : O.width) !== null && n !== void 0 ? n : 0,
      N = (o = O == null ? void 0 : O.height) !== null && o !== void 0 ? o : 0,
      T = a + (f !== 'center' ? '-' + f : ''),
      H =
        typeof b == 'number'
          ? b
          : {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              ...b,
            },
      B = Array.isArray(h) ? h : [h],
      P = B.length > 0,
      K = {
        padding: H,
        boundary: B.filter(ur),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: P,
      },
      {
        refs: z,
        floatingStyles: Z,
        placement: ce,
        isPositioned: fe,
        middlewareData: ie,
      } = or({
        // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
        strategy: 'fixed',
        placement: T,
        whileElementsMounted: er,
        elements: {
          reference: C.anchor,
        },
        middleware: [
          jo({
            mainAxis: $ + N,
            alignmentAxis: p,
          }),
          w &&
            Yo({
              mainAxis: !0,
              crossAxis: !1,
              limiter: g === 'partial' ? Xo() : void 0,
              ...K,
            }),
          w &&
            zo({
              ...K,
            }),
          qo({
            ...K,
            apply: ({ elements: it, rects: no, availableWidth: oo, availableHeight: ro }) => {
              const { width: co, height: io } = no.reference,
                Be = it.floating.style;
              Be.setProperty('--radix-popper-available-width', `${oo}px`),
                Be.setProperty('--radix-popper-available-height', `${ro}px`),
                Be.setProperty('--radix-popper-anchor-width', `${co}px`),
                Be.setProperty('--radix-popper-anchor-height', `${io}px`);
            },
          }),
          S &&
            nr({
              element: S,
              padding: m,
            }),
          fr({
            arrowWidth: A,
            arrowHeight: N,
          }),
          x &&
            Vo({
              strategy: 'referenceHidden',
            }),
        ],
      }),
      [he, be] = yn(ce),
      ve = Q(y);
    Pe(() => {
      fe && (ve == null || ve());
    }, [fe, ve]);
    const ee = (r = ie.arrow) === null || r === void 0 ? void 0 : r.x,
      Ke = (c = ie.arrow) === null || c === void 0 ? void 0 : c.y,
      Qn = ((s = ie.arrow) === null || s === void 0 ? void 0 : s.centerOffset) !== 0,
      [eo, to] = W();
    return (
      Pe(() => {
        M && to(window.getComputedStyle(M).zIndex);
      }, [M]),
      /* @__PURE__ */ v(
        'div',
        {
          ref: z.setFloating,
          'data-radix-popper-content-wrapper': '',
          style: {
            ...Z,
            transform: fe ? Z.transform : 'translate(0, -200%)',
            // keep off the page when measuring
            minWidth: 'max-content',
            zIndex: eo,
            '--radix-popper-transform-origin': [
              (i = ie.transformOrigin) === null || i === void 0 ? void 0 : i.x,
              (d = ie.transformOrigin) === null || d === void 0 ? void 0 : d.y,
            ].join(' '),
          },
          dir: e.dir,
        },
        /* @__PURE__ */ v(
          dr,
          {
            scope: u,
            placedSide: he,
            onArrowChange: k,
            arrowX: ee,
            arrowY: Ke,
            shouldHideArrow: Qn,
          },
          /* @__PURE__ */ v(
            q.div,
            _(
              {
                'data-side': he,
                'data-align': be,
              },
              E,
              {
                ref: L,
                style: {
                  ...E.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: fe ? void 0 : 'none',
                  // hide the content if using the hide middleware and should be hidden
                  opacity: (l = ie.hide) !== null && l !== void 0 && l.referenceHidden ? 0 : void 0,
                },
              },
            ),
          ),
        ),
      )
    );
  });
function ur(e) {
  return e !== null;
}
const fr = e => ({
  name: 'transformOrigin',
  options: e,
  fn(t) {
    var n, o, r, c, s;
    const { placement: i, rects: d, middlewareData: l } = t,
      a = ((n = l.arrow) === null || n === void 0 ? void 0 : n.centerOffset) !== 0,
      $ = a ? 0 : e.arrowWidth,
      f = a ? 0 : e.arrowHeight,
      [p, m] = yn(i),
      h = {
        start: '0%',
        center: '50%',
        end: '100%',
      }[m],
      b =
        ((o = (r = l.arrow) === null || r === void 0 ? void 0 : r.x) !== null && o !== void 0
          ? o
          : 0) +
        $ / 2,
      g =
        ((c = (s = l.arrow) === null || s === void 0 ? void 0 : s.y) !== null && c !== void 0
          ? c
          : 0) +
        f / 2;
    let x = '',
      w = '';
    return (
      p === 'bottom'
        ? ((x = a ? h : `${b}px`), (w = `${-f}px`))
        : p === 'top'
        ? ((x = a ? h : `${b}px`), (w = `${d.floating.height + f}px`))
        : p === 'right'
        ? ((x = `${-f}px`), (w = a ? h : `${g}px`))
        : p === 'left' && ((x = `${d.floating.width + f}px`), (w = a ? h : `${g}px`)),
      {
        data: {
          x,
          y: w,
        },
      }
    );
  },
});
function yn(e) {
  const [t, n = 'center'] = e.split('-');
  return [t, n];
}
const _n = ir,
  pr = ar,
  mr = lr,
  $r = /* @__PURE__ */ D((e, t) => {
    var n;
    const {
      container: o = globalThis == null || (n = globalThis.document) === null || n === void 0
        ? void 0
        : n.body,
      ...r
    } = e;
    return o
      ? /* @__PURE__ */ lo.createPortal(
          /* @__PURE__ */ v(
            q.div,
            _({}, r, {
              ref: t,
            }),
          ),
          o,
        )
      : null;
  });
function hr(e, t) {
  return so((n, o) => {
    const r = t[n][o];
    return r ?? n;
  }, e);
}
const ke = e => {
  const { present: t, children: n } = e,
    o = br(t),
    r =
      typeof n == 'function'
        ? n({
            present: o.isPresent,
          })
        : Ce.only(n),
    c = X(o.ref, r.ref);
  return typeof n == 'function' || o.isPresent
    ? /* @__PURE__ */ xt(r, {
        ref: c,
      })
    : null;
};
ke.displayName = 'Presence';
function br(e) {
  const [t, n] = W(),
    o = F({}),
    r = F(e),
    c = F('none'),
    s = e ? 'mounted' : 'unmounted',
    [i, d] = hr(s, {
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
    G(() => {
      const l = We(o.current);
      c.current = i === 'mounted' ? l : 'none';
    }, [i]),
    Pe(() => {
      const l = o.current,
        u = r.current;
      if (u !== e) {
        const $ = c.current,
          f = We(l);
        e
          ? d('MOUNT')
          : f === 'none' || (l == null ? void 0 : l.display) === 'none'
          ? d('UNMOUNT')
          : d(u && $ !== f ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (r.current = e);
      }
    }, [e, d]),
    Pe(() => {
      if (t) {
        const l = a => {
            const f = We(o.current).includes(a.animationName);
            a.target === t && f && en(() => d('ANIMATION_END'));
          },
          u = a => {
            a.target === t && (c.current = We(o.current));
          };
        return (
          t.addEventListener('animationstart', u),
          t.addEventListener('animationcancel', l),
          t.addEventListener('animationend', l),
          () => {
            t.removeEventListener('animationstart', u),
              t.removeEventListener('animationcancel', l),
              t.removeEventListener('animationend', l);
          }
        );
      } else d('ANIMATION_END');
    }, [t, d]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(i),
      ref: V(l => {
        l && (o.current = getComputedStyle(l)), n(l);
      }, []),
    }
  );
}
function We(e) {
  return (e == null ? void 0 : e.animationName) || 'none';
}
const ut = 'rovingFocusGroup.onEntryFocus',
  vr = {
    bubbles: !1,
    cancelable: !0,
  },
  Mt = 'RovingFocusGroup',
  [ht, Cn, gr] = nn(Mt),
  [wr, En] = Le(Mt, [gr]),
  [xr, yr] = wr(Mt),
  _r = /* @__PURE__ */ D((e, t) =>
    /* @__PURE__ */ v(
      ht.Provider,
      {
        scope: e.__scopeRovingFocusGroup,
      },
      /* @__PURE__ */ v(
        ht.Slot,
        {
          scope: e.__scopeRovingFocusGroup,
        },
        /* @__PURE__ */ v(
          Cr,
          _({}, e, {
            ref: t,
          }),
        ),
      ),
    ),
  ),
  Cr = /* @__PURE__ */ D((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        orientation: o,
        loop: r = !1,
        dir: c,
        currentTabStopId: s,
        defaultCurrentTabStopId: i,
        onCurrentTabStopIdChange: d,
        onEntryFocus: l,
        ...u
      } = e,
      a = F(null),
      $ = X(t, a),
      f = on(c),
      [p = null, m] = _t({
        prop: s,
        defaultProp: i,
        onChange: d,
      }),
      [h, b] = W(!1),
      g = Q(l),
      x = Cn(n),
      w = F(!1),
      [y, E] = W(0);
    return (
      G(() => {
        const C = a.current;
        if (C) return C.addEventListener(ut, g), () => C.removeEventListener(ut, g);
      }, [g]),
      /* @__PURE__ */ v(
        xr,
        {
          scope: n,
          orientation: o,
          dir: f,
          loop: r,
          currentTabStopId: p,
          onItemFocus: V(C => m(C), [m]),
          onItemShiftTab: V(() => b(!0), []),
          onFocusableItemAdd: V(() => E(C => C + 1), []),
          onFocusableItemRemove: V(() => E(C => C - 1), []),
        },
        /* @__PURE__ */ v(
          q.div,
          _(
            {
              tabIndex: h || y === 0 ? -1 : 0,
              'data-orientation': o,
            },
            u,
            {
              ref: $,
              style: {
                outline: 'none',
                ...e.style,
              },
              onMouseDown: R(e.onMouseDown, () => {
                w.current = !0;
              }),
              onFocus: R(e.onFocus, C => {
                const M = !w.current;
                if (C.target === C.currentTarget && M && !h) {
                  const I = new CustomEvent(ut, vr);
                  if ((C.currentTarget.dispatchEvent(I), !I.defaultPrevented)) {
                    const L = x().filter(N => N.focusable),
                      S = L.find(N => N.active),
                      k = L.find(N => N.id === p),
                      A = [S, k, ...L].filter(Boolean).map(N => N.ref.current);
                    Pn(A);
                  }
                }
                w.current = !1;
              }),
              onBlur: R(e.onBlur, () => b(!1)),
            },
          ),
        ),
      )
    );
  }),
  Er = 'RovingFocusGroupItem',
  Pr = /* @__PURE__ */ D((e, t) => {
    const { __scopeRovingFocusGroup: n, focusable: o = !0, active: r = !1, tabStopId: c, ...s } = e,
      i = Re(),
      d = c || i,
      l = yr(Er, n),
      u = l.currentTabStopId === d,
      a = Cn(n),
      { onFocusableItemAdd: $, onFocusableItemRemove: f } = l;
    return (
      G(() => {
        if (o) return $(), () => f();
      }, [o, $, f]),
      /* @__PURE__ */ v(
        ht.ItemSlot,
        {
          scope: n,
          id: d,
          focusable: o,
          active: r,
        },
        /* @__PURE__ */ v(
          q.span,
          _(
            {
              tabIndex: u ? 0 : -1,
              'data-orientation': l.orientation,
            },
            s,
            {
              ref: t,
              onMouseDown: R(e.onMouseDown, p => {
                o ? l.onItemFocus(d) : p.preventDefault();
              }),
              onFocus: R(e.onFocus, () => l.onItemFocus(d)),
              onKeyDown: R(e.onKeyDown, p => {
                if (p.key === 'Tab' && p.shiftKey) {
                  l.onItemShiftTab();
                  return;
                }
                if (p.target !== p.currentTarget) return;
                const m = Sr(p, l.orientation, l.dir);
                if (m !== void 0) {
                  p.preventDefault();
                  let b = a()
                    .filter(g => g.focusable)
                    .map(g => g.ref.current);
                  if (m === 'last') b.reverse();
                  else if (m === 'prev' || m === 'next') {
                    m === 'prev' && b.reverse();
                    const g = b.indexOf(p.currentTarget);
                    b = l.loop ? Tr(b, g + 1) : b.slice(g + 1);
                  }
                  setTimeout(() => Pn(b));
                }
              }),
            },
          ),
        ),
      )
    );
  }),
  Mr = {
    ArrowLeft: 'prev',
    ArrowUp: 'prev',
    ArrowRight: 'next',
    ArrowDown: 'next',
    PageUp: 'first',
    Home: 'first',
    PageDown: 'last',
    End: 'last',
  };
function Dr(e, t) {
  return t !== 'rtl' ? e : e === 'ArrowLeft' ? 'ArrowRight' : e === 'ArrowRight' ? 'ArrowLeft' : e;
}
function Sr(e, t, n) {
  const o = Dr(e.key, n);
  if (
    !(t === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(o)) &&
    !(t === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(o))
  )
    return Mr[o];
}
function Pn(e) {
  const t = document.activeElement;
  for (const n of e) if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Tr(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
const Rr = _r,
  Or = Pr,
  bt = ['Enter', ' '],
  Ir = ['ArrowDown', 'PageUp', 'Home'],
  Mn = ['ArrowUp', 'PageDown', 'End'],
  Ar = [...Ir, ...Mn],
  Nr = {
    ltr: [...bt, 'ArrowRight'],
    rtl: [...bt, 'ArrowLeft'],
  },
  Fr = {
    ltr: ['ArrowLeft'],
    rtl: ['ArrowRight'],
  },
  rt = 'Menu',
  [Ne, Lr, kr] = nn(rt),
  [_e, Dn] = Le(rt, [kr, gn, En]),
  ct = gn(),
  Sn = En(),
  [Tn, $e] = _e(rt),
  [Ur, Ue] = _e(rt),
  Kr = e => {
    const { __scopeMenu: t, open: n = !1, children: o, dir: r, onOpenChange: c, modal: s = !0 } = e,
      i = ct(t),
      [d, l] = W(null),
      u = F(!1),
      a = Q(c),
      $ = on(r);
    return (
      G(() => {
        const f = () => {
            (u.current = !0),
              document.addEventListener('pointerdown', p, {
                capture: !0,
                once: !0,
              }),
              document.addEventListener('pointermove', p, {
                capture: !0,
                once: !0,
              });
          },
          p = () => (u.current = !1);
        return (
          document.addEventListener('keydown', f, {
            capture: !0,
          }),
          () => {
            document.removeEventListener('keydown', f, {
              capture: !0,
            }),
              document.removeEventListener('pointerdown', p, {
                capture: !0,
              }),
              document.removeEventListener('pointermove', p, {
                capture: !0,
              });
          }
        );
      }, []),
      /* @__PURE__ */ v(
        _n,
        i,
        /* @__PURE__ */ v(
          Tn,
          {
            scope: t,
            open: n,
            onOpenChange: a,
            content: d,
            onContentChange: l,
          },
          /* @__PURE__ */ v(
            Ur,
            {
              scope: t,
              onClose: V(() => a(!1), [a]),
              isUsingKeyboardRef: u,
              dir: $,
              modal: s,
            },
            o,
          ),
        ),
      )
    );
  },
  Rn = /* @__PURE__ */ D((e, t) => {
    const { __scopeMenu: n, ...o } = e,
      r = ct(n);
    return /* @__PURE__ */ v(
      pr,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  On = 'MenuPortal',
  [Br, In] = _e(On, {
    forceMount: void 0,
  }),
  Gr = e => {
    const { __scopeMenu: t, forceMount: n, children: o, container: r } = e,
      c = $e(On, t);
    return /* @__PURE__ */ v(
      Br,
      {
        scope: t,
        forceMount: n,
      },
      /* @__PURE__ */ v(
        ke,
        {
          present: n || c.open,
        },
        /* @__PURE__ */ v(
          $r,
          {
            asChild: !0,
            container: r,
          },
          o,
        ),
      ),
    );
  },
  ne = 'MenuContent',
  [Wr, Dt] = _e(ne),
  Hr = /* @__PURE__ */ D((e, t) => {
    const n = In(ne, e.__scopeMenu),
      { forceMount: o = n.forceMount, ...r } = e,
      c = $e(ne, e.__scopeMenu),
      s = Ue(ne, e.__scopeMenu);
    return /* @__PURE__ */ v(
      Ne.Provider,
      {
        scope: e.__scopeMenu,
      },
      /* @__PURE__ */ v(
        ke,
        {
          present: o || c.open,
        },
        /* @__PURE__ */ v(
          Ne.Slot,
          {
            scope: e.__scopeMenu,
          },
          s.modal
            ? /* @__PURE__ */ v(
                zr,
                _({}, r, {
                  ref: t,
                }),
              )
            : /* @__PURE__ */ v(
                Vr,
                _({}, r, {
                  ref: t,
                }),
              ),
        ),
      ),
    );
  }),
  zr = /* @__PURE__ */ D((e, t) => {
    const n = $e(ne, e.__scopeMenu),
      o = F(null),
      r = X(t, o);
    return (
      G(() => {
        const c = o.current;
        if (c) return uo(c);
      }, []),
      /* @__PURE__ */ v(
        St,
        _({}, e, {
          ref: r,
          trapFocus: n.open,
          disableOutsidePointerEvents: n.open,
          disableOutsideScroll: !0,
          onFocusOutside: R(e.onFocusOutside, c => c.preventDefault(), {
            checkForDefaultPrevented: !1,
          }),
          onDismiss: () => n.onOpenChange(!1),
        }),
      )
    );
  }),
  Vr = /* @__PURE__ */ D((e, t) => {
    const n = $e(ne, e.__scopeMenu);
    return /* @__PURE__ */ v(
      St,
      _({}, e, {
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        onDismiss: () => n.onOpenChange(!1),
      }),
    );
  }),
  St = /* @__PURE__ */ D((e, t) => {
    const {
        __scopeMenu: n,
        loop: o = !1,
        trapFocus: r,
        onOpenAutoFocus: c,
        onCloseAutoFocus: s,
        disableOutsidePointerEvents: i,
        onEntryFocus: d,
        onEscapeKeyDown: l,
        onPointerDownOutside: u,
        onFocusOutside: a,
        onInteractOutside: $,
        onDismiss: f,
        disableOutsideScroll: p,
        ...m
      } = e,
      h = $e(ne, n),
      b = Ue(ne, n),
      g = ct(n),
      x = Sn(n),
      w = Lr(n),
      [y, E] = W(null),
      C = F(null),
      M = X(t, C, h.onContentChange),
      I = F(0),
      L = F(''),
      S = F(0),
      k = F(null),
      O = F('right'),
      A = F(0),
      N = p ? fo : Jt,
      T = p
        ? {
            as: Te,
            allowPinchZoom: !0,
          }
        : void 0,
      H = P => {
        var K, z;
        const Z = L.current + P,
          ce = w().filter(ee => !ee.disabled),
          fe = document.activeElement,
          ie =
            (K = ce.find(ee => ee.ref.current === fe)) === null || K === void 0
              ? void 0
              : K.textValue,
          he = ce.map(ee => ee.textValue),
          be = uc(he, Z, ie),
          ve =
            (z = ce.find(ee => ee.textValue === be)) === null || z === void 0
              ? void 0
              : z.ref.current;
        (function ee(Ke) {
          (L.current = Ke),
            window.clearTimeout(I.current),
            Ke !== '' && (I.current = window.setTimeout(() => ee(''), 1e3));
        })(Z),
          ve && setTimeout(() => ve.focus());
      };
    G(() => () => window.clearTimeout(I.current), []), Ro();
    const B = V(P => {
      var K, z;
      return (
        O.current === ((K = k.current) === null || K === void 0 ? void 0 : K.side) &&
        pc(P, (z = k.current) === null || z === void 0 ? void 0 : z.area)
      );
    }, []);
    return /* @__PURE__ */ v(
      Wr,
      {
        scope: n,
        searchRef: L,
        onItemEnter: V(
          P => {
            B(P) && P.preventDefault();
          },
          [B],
        ),
        onItemLeave: V(
          P => {
            var K;
            B(P) || ((K = C.current) === null || K === void 0 || K.focus(), E(null));
          },
          [B],
        ),
        onTriggerLeave: V(
          P => {
            B(P) && P.preventDefault();
          },
          [B],
        ),
        pointerGraceTimerRef: S,
        onPointerGraceIntentChange: V(P => {
          k.current = P;
        }, []),
      },
      /* @__PURE__ */ v(
        N,
        T,
        /* @__PURE__ */ v(
          Oo,
          {
            asChild: !0,
            trapped: r,
            onMountAutoFocus: R(c, P => {
              var K;
              P.preventDefault(), (K = C.current) === null || K === void 0 || K.focus();
            }),
            onUnmountAutoFocus: s,
          },
          /* @__PURE__ */ v(
            Do,
            {
              asChild: !0,
              disableOutsidePointerEvents: i,
              onEscapeKeyDown: l,
              onPointerDownOutside: u,
              onFocusOutside: a,
              onInteractOutside: $,
              onDismiss: f,
            },
            /* @__PURE__ */ v(
              Rr,
              _(
                {
                  asChild: !0,
                },
                x,
                {
                  dir: b.dir,
                  orientation: 'vertical',
                  loop: o,
                  currentTabStopId: y,
                  onCurrentTabStopIdChange: E,
                  onEntryFocus: R(d, P => {
                    b.isUsingKeyboardRef.current || P.preventDefault();
                  }),
                },
              ),
              /* @__PURE__ */ v(
                mr,
                _(
                  {
                    role: 'menu',
                    'aria-orientation': 'vertical',
                    'data-state': Kn(h.open),
                    'data-radix-menu-content': '',
                    dir: b.dir,
                  },
                  g,
                  m,
                  {
                    ref: M,
                    style: {
                      outline: 'none',
                      ...m.style,
                    },
                    onKeyDown: R(m.onKeyDown, P => {
                      const z = P.target.closest('[data-radix-menu-content]') === P.currentTarget,
                        Z = P.ctrlKey || P.altKey || P.metaKey,
                        ce = P.key.length === 1;
                      z && (P.key === 'Tab' && P.preventDefault(), !Z && ce && H(P.key));
                      const fe = C.current;
                      if (P.target !== fe || !Ar.includes(P.key)) return;
                      P.preventDefault();
                      const he = w()
                        .filter(be => !be.disabled)
                        .map(be => be.ref.current);
                      Mn.includes(P.key) && he.reverse(), dc(he);
                    }),
                    onBlur: R(e.onBlur, P => {
                      P.currentTarget.contains(P.target) ||
                        (window.clearTimeout(I.current), (L.current = ''));
                    }),
                    onPointerMove: R(
                      e.onPointerMove,
                      Fe(P => {
                        const K = P.target,
                          z = A.current !== P.clientX;
                        if (P.currentTarget.contains(K) && z) {
                          const Z = P.clientX > A.current ? 'right' : 'left';
                          (O.current = Z), (A.current = P.clientX);
                        }
                      }),
                    ),
                  },
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }),
  An = /* @__PURE__ */ D((e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ v(
      q.div,
      _(
        {
          role: 'group',
        },
        o,
        {
          ref: t,
        },
      ),
    );
  }),
  jr = /* @__PURE__ */ D((e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ v(
      q.div,
      _({}, o, {
        ref: t,
      }),
    );
  }),
  vt = 'MenuItem',
  Zt = 'menu.itemSelect',
  Tt = /* @__PURE__ */ D((e, t) => {
    const { disabled: n = !1, onSelect: o, ...r } = e,
      c = F(null),
      s = Ue(vt, e.__scopeMenu),
      i = Dt(vt, e.__scopeMenu),
      d = X(t, c),
      l = F(!1),
      u = () => {
        const a = c.current;
        if (!n && a) {
          const $ = new CustomEvent(Zt, {
            bubbles: !0,
            cancelable: !0,
          });
          a.addEventListener(Zt, f => (o == null ? void 0 : o(f)), {
            once: !0,
          }),
            tn(a, $),
            $.defaultPrevented ? (l.current = !1) : s.onClose();
        }
      };
    return /* @__PURE__ */ v(
      Nn,
      _({}, r, {
        ref: d,
        disabled: n,
        onClick: R(e.onClick, u),
        onPointerDown: a => {
          var $;
          ($ = e.onPointerDown) === null || $ === void 0 || $.call(e, a), (l.current = !0);
        },
        onPointerUp: R(e.onPointerUp, a => {
          var $;
          l.current || ($ = a.currentTarget) === null || $ === void 0 || $.click();
        }),
        onKeyDown: R(e.onKeyDown, a => {
          const $ = i.searchRef.current !== '';
          n ||
            ($ && a.key === ' ') ||
            (bt.includes(a.key) && (a.currentTarget.click(), a.preventDefault()));
        }),
      }),
    );
  }),
  Nn = /* @__PURE__ */ D((e, t) => {
    const { __scopeMenu: n, disabled: o = !1, textValue: r, ...c } = e,
      s = Dt(vt, n),
      i = Sn(n),
      d = F(null),
      l = X(t, d),
      [u, a] = W(!1),
      [$, f] = W('');
    return (
      G(() => {
        const p = d.current;
        if (p) {
          var m;
          f(((m = p.textContent) !== null && m !== void 0 ? m : '').trim());
        }
      }, [c.children]),
      /* @__PURE__ */ v(
        Ne.ItemSlot,
        {
          scope: n,
          disabled: o,
          textValue: r ?? $,
        },
        /* @__PURE__ */ v(
          Or,
          _(
            {
              asChild: !0,
            },
            i,
            {
              focusable: !o,
            },
          ),
          /* @__PURE__ */ v(
            q.div,
            _(
              {
                role: 'menuitem',
                'data-highlighted': u ? '' : void 0,
                'aria-disabled': o || void 0,
                'data-disabled': o ? '' : void 0,
              },
              c,
              {
                ref: l,
                onPointerMove: R(
                  e.onPointerMove,
                  Fe(p => {
                    o
                      ? s.onItemLeave(p)
                      : (s.onItemEnter(p), p.defaultPrevented || p.currentTarget.focus());
                  }),
                ),
                onPointerLeave: R(
                  e.onPointerLeave,
                  Fe(p => s.onItemLeave(p)),
                ),
                onFocus: R(e.onFocus, () => a(!0)),
                onBlur: R(e.onBlur, () => a(!1)),
              },
            ),
          ),
        ),
      )
    );
  }),
  Yr = /* @__PURE__ */ D((e, t) => {
    const { checked: n = !1, onCheckedChange: o, ...r } = e;
    return /* @__PURE__ */ v(
      Ln,
      {
        scope: e.__scopeMenu,
        checked: n,
      },
      /* @__PURE__ */ v(
        Tt,
        _(
          {
            role: 'menuitemcheckbox',
            'aria-checked': et(n) ? 'mixed' : n,
          },
          r,
          {
            ref: t,
            'data-state': Rt(n),
            onSelect: R(r.onSelect, () => (o == null ? void 0 : o(et(n) ? !0 : !n)), {
              checkForDefaultPrevented: !1,
            }),
          },
        ),
      ),
    );
  }),
  Xr = 'MenuRadioGroup',
  [qr, Zr] = _e(Xr, {
    value: void 0,
    onValueChange: () => {},
  }),
  Jr = /* @__PURE__ */ D((e, t) => {
    const { value: n, onValueChange: o, ...r } = e,
      c = Q(o);
    return /* @__PURE__ */ v(
      qr,
      {
        scope: e.__scopeMenu,
        value: n,
        onValueChange: c,
      },
      /* @__PURE__ */ v(
        An,
        _({}, r, {
          ref: t,
        }),
      ),
    );
  }),
  Qr = 'MenuRadioItem',
  ec = /* @__PURE__ */ D((e, t) => {
    const { value: n, ...o } = e,
      r = Zr(Qr, e.__scopeMenu),
      c = n === r.value;
    return /* @__PURE__ */ v(
      Ln,
      {
        scope: e.__scopeMenu,
        checked: c,
      },
      /* @__PURE__ */ v(
        Tt,
        _(
          {
            role: 'menuitemradio',
            'aria-checked': c,
          },
          o,
          {
            ref: t,
            'data-state': Rt(c),
            onSelect: R(
              o.onSelect,
              () => {
                var s;
                return (s = r.onValueChange) === null || s === void 0 ? void 0 : s.call(r, n);
              },
              {
                checkForDefaultPrevented: !1,
              },
            ),
          },
        ),
      ),
    );
  }),
  Fn = 'MenuItemIndicator',
  [Ln, tc] = _e(Fn, {
    checked: !1,
  }),
  nc = /* @__PURE__ */ D((e, t) => {
    const { __scopeMenu: n, forceMount: o, ...r } = e,
      c = tc(Fn, n);
    return /* @__PURE__ */ v(
      ke,
      {
        present: o || et(c.checked) || c.checked === !0,
      },
      /* @__PURE__ */ v(
        q.span,
        _({}, r, {
          ref: t,
          'data-state': Rt(c.checked),
        }),
      ),
    );
  }),
  oc = /* @__PURE__ */ D((e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ v(
      q.div,
      _(
        {
          role: 'separator',
          'aria-orientation': 'horizontal',
        },
        o,
        {
          ref: t,
        },
      ),
    );
  }),
  kn = 'MenuSub',
  [rc, Un] = _e(kn),
  cc = e => {
    const { __scopeMenu: t, children: n, open: o = !1, onOpenChange: r } = e,
      c = $e(kn, t),
      s = ct(t),
      [i, d] = W(null),
      [l, u] = W(null),
      a = Q(r);
    return (
      G(() => (c.open === !1 && a(!1), () => a(!1)), [c.open, a]),
      /* @__PURE__ */ v(
        _n,
        s,
        /* @__PURE__ */ v(
          Tn,
          {
            scope: t,
            open: o,
            onOpenChange: a,
            content: l,
            onContentChange: u,
          },
          /* @__PURE__ */ v(
            rc,
            {
              scope: t,
              contentId: Re(),
              triggerId: Re(),
              trigger: i,
              onTriggerChange: d,
            },
            n,
          ),
        ),
      )
    );
  },
  He = 'MenuSubTrigger',
  ic = /* @__PURE__ */ D((e, t) => {
    const n = $e(He, e.__scopeMenu),
      o = Ue(He, e.__scopeMenu),
      r = Un(He, e.__scopeMenu),
      c = Dt(He, e.__scopeMenu),
      s = F(null),
      { pointerGraceTimerRef: i, onPointerGraceIntentChange: d } = c,
      l = {
        __scopeMenu: e.__scopeMenu,
      },
      u = V(() => {
        s.current && window.clearTimeout(s.current), (s.current = null);
      }, []);
    return (
      G(() => u, [u]),
      G(() => {
        const a = i.current;
        return () => {
          window.clearTimeout(a), d(null);
        };
      }, [i, d]),
      /* @__PURE__ */ v(
        Rn,
        _(
          {
            asChild: !0,
          },
          l,
        ),
        /* @__PURE__ */ v(
          Nn,
          _(
            {
              id: r.triggerId,
              'aria-haspopup': 'menu',
              'aria-expanded': n.open,
              'aria-controls': r.contentId,
              'data-state': Kn(n.open),
            },
            e,
            {
              ref: tt(t, r.onTriggerChange),
              onClick: a => {
                var $;
                ($ = e.onClick) === null || $ === void 0 || $.call(e, a),
                  !(e.disabled || a.defaultPrevented) &&
                    (a.currentTarget.focus(), n.open || n.onOpenChange(!0));
              },
              onPointerMove: R(
                e.onPointerMove,
                Fe(a => {
                  c.onItemEnter(a),
                    !a.defaultPrevented &&
                      !e.disabled &&
                      !n.open &&
                      !s.current &&
                      (c.onPointerGraceIntentChange(null),
                      (s.current = window.setTimeout(() => {
                        n.onOpenChange(!0), u();
                      }, 100)));
                }),
              ),
              onPointerLeave: R(
                e.onPointerLeave,
                Fe(a => {
                  var $;
                  u();
                  const f =
                    ($ = n.content) === null || $ === void 0 ? void 0 : $.getBoundingClientRect();
                  if (f) {
                    var p;
                    const m = (p = n.content) === null || p === void 0 ? void 0 : p.dataset.side,
                      h = m === 'right',
                      b = h ? -5 : 5,
                      g = f[h ? 'left' : 'right'],
                      x = f[h ? 'right' : 'left'];
                    c.onPointerGraceIntentChange({
                      area: [
                        // consistently within polygon bounds
                        {
                          x: a.clientX + b,
                          y: a.clientY,
                        },
                        {
                          x: g,
                          y: f.top,
                        },
                        {
                          x,
                          y: f.top,
                        },
                        {
                          x,
                          y: f.bottom,
                        },
                        {
                          x: g,
                          y: f.bottom,
                        },
                      ],
                      side: m,
                    }),
                      window.clearTimeout(i.current),
                      (i.current = window.setTimeout(
                        () => c.onPointerGraceIntentChange(null),
                        300,
                      ));
                  } else {
                    if ((c.onTriggerLeave(a), a.defaultPrevented)) return;
                    c.onPointerGraceIntentChange(null);
                  }
                }),
              ),
              onKeyDown: R(e.onKeyDown, a => {
                const $ = c.searchRef.current !== '';
                if (!(e.disabled || ($ && a.key === ' ')) && Nr[o.dir].includes(a.key)) {
                  var f;
                  n.onOpenChange(!0),
                    (f = n.content) === null || f === void 0 || f.focus(),
                    a.preventDefault();
                }
              }),
            },
          ),
        ),
      )
    );
  }),
  sc = 'MenuSubContent',
  ac = /* @__PURE__ */ D((e, t) => {
    const n = In(ne, e.__scopeMenu),
      { forceMount: o = n.forceMount, ...r } = e,
      c = $e(ne, e.__scopeMenu),
      s = Ue(ne, e.__scopeMenu),
      i = Un(sc, e.__scopeMenu),
      d = F(null),
      l = X(t, d);
    return /* @__PURE__ */ v(
      Ne.Provider,
      {
        scope: e.__scopeMenu,
      },
      /* @__PURE__ */ v(
        ke,
        {
          present: o || c.open,
        },
        /* @__PURE__ */ v(
          Ne.Slot,
          {
            scope: e.__scopeMenu,
          },
          /* @__PURE__ */ v(
            St,
            _(
              {
                id: i.contentId,
                'aria-labelledby': i.triggerId,
              },
              r,
              {
                ref: l,
                align: 'start',
                side: s.dir === 'rtl' ? 'left' : 'right',
                disableOutsidePointerEvents: !1,
                disableOutsideScroll: !1,
                trapFocus: !1,
                onOpenAutoFocus: u => {
                  var a;
                  s.isUsingKeyboardRef.current &&
                    ((a = d.current) === null || a === void 0 || a.focus()),
                    u.preventDefault();
                },
                onCloseAutoFocus: u => u.preventDefault(),
                onFocusOutside: R(e.onFocusOutside, u => {
                  u.target !== i.trigger && c.onOpenChange(!1);
                }),
                onEscapeKeyDown: R(e.onEscapeKeyDown, u => {
                  s.onClose(), u.preventDefault();
                }),
                onKeyDown: R(e.onKeyDown, u => {
                  const a = u.currentTarget.contains(u.target),
                    $ = Fr[s.dir].includes(u.key);
                  if (a && $) {
                    var f;
                    c.onOpenChange(!1),
                      (f = i.trigger) === null || f === void 0 || f.focus(),
                      u.preventDefault();
                  }
                }),
              },
            ),
          ),
        ),
      ),
    );
  });
function Kn(e) {
  return e ? 'open' : 'closed';
}
function et(e) {
  return e === 'indeterminate';
}
function Rt(e) {
  return et(e) ? 'indeterminate' : e ? 'checked' : 'unchecked';
}
function dc(e) {
  const t = document.activeElement;
  for (const n of e) if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function lc(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
function uc(e, t, n) {
  const r = t.length > 1 && Array.from(t).every(l => l === t[0]) ? t[0] : t,
    c = n ? e.indexOf(n) : -1;
  let s = lc(e, Math.max(c, 0));
  r.length === 1 && (s = s.filter(l => l !== n));
  const d = s.find(l => l.toLowerCase().startsWith(r.toLowerCase()));
  return d !== n ? d : void 0;
}
function fc(e, t) {
  const { x: n, y: o } = e;
  let r = !1;
  for (let c = 0, s = t.length - 1; c < t.length; s = c++) {
    const i = t[c].x,
      d = t[c].y,
      l = t[s].x,
      u = t[s].y;
    d > o != u > o && n < ((l - i) * (o - d)) / (u - d) + i && (r = !r);
  }
  return r;
}
function pc(e, t) {
  if (!t) return !1;
  const n = {
    x: e.clientX,
    y: e.clientY,
  };
  return fc(n, t);
}
function Fe(e) {
  return t => (t.pointerType === 'mouse' ? e(t) : void 0);
}
const mc = Kr,
  $c = Rn,
  hc = Gr,
  bc = Hr,
  vc = An,
  gc = jr,
  wc = Tt,
  xc = Yr,
  yc = Jr,
  _c = ec,
  Cc = nc,
  Ec = oc,
  Pc = cc,
  Mc = ic,
  Dc = ac,
  Bn = 'DropdownMenu',
  [Sc, $i] = Le(Bn, [Dn]),
  j = Dn(),
  [Tc, Gn] = Sc(Bn),
  Rc = e => {
    const {
        __scopeDropdownMenu: t,
        children: n,
        dir: o,
        open: r,
        defaultOpen: c,
        onOpenChange: s,
        modal: i = !0,
      } = e,
      d = j(t),
      l = F(null),
      [u = !1, a] = _t({
        prop: r,
        defaultProp: c,
        onChange: s,
      });
    return /* @__PURE__ */ v(
      Tc,
      {
        scope: t,
        triggerId: Re(),
        triggerRef: l,
        contentId: Re(),
        open: u,
        onOpenChange: a,
        onOpenToggle: V(() => a($ => !$), [a]),
        modal: i,
      },
      /* @__PURE__ */ v(
        mc,
        _({}, d, {
          open: u,
          onOpenChange: a,
          dir: o,
          modal: i,
        }),
        n,
      ),
    );
  },
  Oc = 'DropdownMenuTrigger',
  Ic = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, disabled: o = !1, ...r } = e,
      c = Gn(Oc, n),
      s = j(n);
    return /* @__PURE__ */ v(
      $c,
      _(
        {
          asChild: !0,
        },
        s,
      ),
      /* @__PURE__ */ v(
        q.button,
        _(
          {
            type: 'button',
            id: c.triggerId,
            'aria-haspopup': 'menu',
            'aria-expanded': c.open,
            'aria-controls': c.open ? c.contentId : void 0,
            'data-state': c.open ? 'open' : 'closed',
            'data-disabled': o ? '' : void 0,
            disabled: o,
          },
          r,
          {
            ref: tt(t, c.triggerRef),
            onPointerDown: R(e.onPointerDown, i => {
              !o &&
                i.button === 0 &&
                i.ctrlKey === !1 &&
                (c.onOpenToggle(), c.open || i.preventDefault());
            }),
            onKeyDown: R(e.onKeyDown, i => {
              o ||
                (['Enter', ' '].includes(i.key) && c.onOpenToggle(),
                i.key === 'ArrowDown' && c.onOpenChange(!0),
                ['Enter', ' ', 'ArrowDown'].includes(i.key) && i.preventDefault());
            }),
          },
        ),
      ),
    );
  }),
  Ac = e => {
    const { __scopeDropdownMenu: t, ...n } = e,
      o = j(t);
    return /* @__PURE__ */ v(hc, _({}, o, n));
  },
  Nc = 'DropdownMenuContent',
  Fc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Gn(Nc, n),
      c = j(n),
      s = F(!1);
    return /* @__PURE__ */ v(
      bc,
      _(
        {
          id: r.contentId,
          'aria-labelledby': r.triggerId,
        },
        c,
        o,
        {
          ref: t,
          onCloseAutoFocus: R(e.onCloseAutoFocus, i => {
            var d;
            s.current || (d = r.triggerRef.current) === null || d === void 0 || d.focus(),
              (s.current = !1),
              i.preventDefault();
          }),
          onInteractOutside: R(e.onInteractOutside, i => {
            const d = i.detail.originalEvent,
              l = d.button === 0 && d.ctrlKey === !0,
              u = d.button === 2 || l;
            (!r.modal || u) && (s.current = !0);
          }),
          style: {
            ...e.style,
            '--radix-dropdown-menu-content-transform-origin':
              'var(--radix-popper-transform-origin)',
            '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-dropdown-menu-content-available-height':
              'var(--radix-popper-available-height)',
            '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
          },
        },
      ),
    );
  }),
  Lc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      vc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  kc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      gc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  Uc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      wc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  Kc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      xc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  Bc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      yc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  Gc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      _c,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  Wc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      Cc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  Hc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      Ec,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  zc = e => {
    const { __scopeDropdownMenu: t, children: n, open: o, onOpenChange: r, defaultOpen: c } = e,
      s = j(t),
      [i = !1, d] = _t({
        prop: o,
        defaultProp: c,
        onChange: r,
      });
    return /* @__PURE__ */ v(
      Pc,
      _({}, s, {
        open: i,
        onOpenChange: d,
      }),
      n,
    );
  },
  Vc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      Mc,
      _({}, r, o, {
        ref: t,
      }),
    );
  }),
  jc = /* @__PURE__ */ D((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = j(n);
    return /* @__PURE__ */ v(
      Dc,
      _({}, r, o, {
        ref: t,
        style: {
          ...e.style,
          '--radix-dropdown-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-dropdown-menu-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
        },
      }),
    );
  }),
  Yc = Rc,
  Xc = Ic,
  Wn = Ac,
  Hn = Fc,
  qc = Lc,
  zn = kc,
  Vn = Uc,
  jn = Kc,
  Zc = Bc,
  Yn = Gc,
  Xn = Wc,
  qn = Hc,
  Jc = zc,
  Zn = Vc,
  Jn = jc,
  hi = Yc,
  bi = Xc,
  vi = qc,
  gi = Wn,
  wi = Jc,
  xi = Zc,
  Qc = U.forwardRef(({ className: e, inset: t, children: n, ...o }, r) =>
    /* @__PURE__ */ gt(Zn, {
      ref: r,
      className: ue(
        'focus:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        t && 'pl-8',
        e,
      ),
      ...o,
      children: [n, /* @__PURE__ */ Y(mo, { className: 'ml-auto h-4 w-4' })],
    }),
  );
Qc.displayName = Zn.displayName;
const ei = U.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ Y(Jn, {
    ref: n,
    className: ue(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
      e,
    ),
    ...t,
  }),
);
ei.displayName = Jn.displayName;
const ti = U.forwardRef(({ className: e, sideOffset: t = 4, ...n }, o) =>
  /* @__PURE__ */ Y(Wn, {
    children: /* @__PURE__ */ Y(Hn, {
      ref: o,
      sideOffset: t,
      className: ue(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md',
        e,
      ),
      ...n,
    }),
  }),
);
ti.displayName = Hn.displayName;
const ni = U.forwardRef(({ className: e, inset: t, ...n }, o) =>
  /* @__PURE__ */ Y(Vn, {
    ref: o,
    className: ue(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      t && 'pl-8',
      e,
    ),
    ...n,
  }),
);
ni.displayName = Vn.displayName;
const oi = U.forwardRef(({ className: e, children: t, checked: n, ...o }, r) =>
  /* @__PURE__ */ gt(jn, {
    ref: r,
    className: ue(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      e,
    ),
    checked: n,
    ...o,
    children: [
      /* @__PURE__ */ Y('span', {
        className: 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
        children: /* @__PURE__ */ Y(Xn, {
          children: /* @__PURE__ */ Y(po, { className: 'h-4 w-4' }),
        }),
      }),
      t,
    ],
  }),
);
oi.displayName = jn.displayName;
const ri = U.forwardRef(({ className: e, children: t, ...n }, o) =>
  /* @__PURE__ */ gt(Yn, {
    ref: o,
    className: ue(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      e,
    ),
    ...n,
    children: [
      /* @__PURE__ */ Y('span', {
        className: 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
        children: /* @__PURE__ */ Y(Xn, {
          children: /* @__PURE__ */ Y($o, { className: 'h-2 w-2 fill-current' }),
        }),
      }),
      t,
    ],
  }),
);
ri.displayName = Yn.displayName;
const ci = U.forwardRef(({ className: e, inset: t, ...n }, o) =>
  /* @__PURE__ */ Y(zn, {
    ref: o,
    className: ue('px-2 py-1.5 text-sm font-semibold', t && 'pl-8', e),
    ...n,
  }),
);
ci.displayName = zn.displayName;
const ii = U.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ Y(qn, {
    ref: n,
    className: ue('bg-muted -mx-1 my-1 h-px', e),
    ...t,
  }),
);
ii.displayName = qn.displayName;
const si = ({ className: e, ...t }) =>
  /* @__PURE__ */ Y('span', {
    className: ue('ml-auto text-xs tracking-widest opacity-60', e),
    ...t,
  });
si.displayName = 'DropdownMenuShortcut';
export {
  hi as DropdownMenu,
  oi as DropdownMenuCheckboxItem,
  ti as DropdownMenuContent,
  vi as DropdownMenuGroup,
  ni as DropdownMenuItem,
  ci as DropdownMenuLabel,
  gi as DropdownMenuPortal,
  xi as DropdownMenuRadioGroup,
  ri as DropdownMenuRadioItem,
  ii as DropdownMenuSeparator,
  si as DropdownMenuShortcut,
  wi as DropdownMenuSub,
  ei as DropdownMenuSubContent,
  Qc as DropdownMenuSubTrigger,
  bi as DropdownMenuTrigger,
};
