import { jsx as D, jsxs as W } from 'react/jsx-runtime';
import * as I from 'react';
import {
  useCallback as q,
  useState as S,
  useRef as h,
  useEffect as E,
  forwardRef as m,
  useContext as ye,
  createElement as l,
  createContext as De,
  Children as xe,
  Fragment as Oe,
} from 'react';
import { _ as g } from '../../../extends-70f3d2a3.js';
import { $ as Ce, a as T, b as O, c as _e, d as V } from '../../../index.module-e6352d52.js';
import { a as A, $ as Pe } from '../../../index.module-4fc81c69.js';
import { $ as C, a as Te } from '../../../index.module-06df6ed9.js';
import Fe from 'react-dom';
import { $ as Ne, h as Ie } from '../../../index-cbc375f1.js';
import { a as F } from '../../../ctw-6a823672.js';
import { c as Re } from '../../../createLucideIcon-6839730e.js';
const we = I['useId'.toString()] || (() => {});
let Ae = 0;
function B(e) {
  const [t, o] = I.useState(we());
  return (
    Ce(() => {
      e || o(n => n ?? String(Ae++));
    }, [e]),
    e || (t ? `radix-${t}` : '')
  );
}
function Le({ prop: e, defaultProp: t, onChange: o = () => {} }) {
  const [n, s] = Se({
      defaultProp: t,
      onChange: o,
    }),
    c = e !== void 0,
    r = c ? e : n,
    a = T(o),
    f = q(
      p => {
        if (c) {
          const u = typeof p == 'function' ? p(e) : p;
          u !== e && a(u);
        } else s(p);
      },
      [c, e, s, a],
    );
  return [r, f];
}
function Se({ defaultProp: e, onChange: t }) {
  const o = S(e),
    [n] = o,
    s = h(n),
    c = T(t);
  return (
    E(() => {
      s.current !== n && (c(n), (s.current = n));
    }, [n, s, c]),
    o
  );
}
function ke(e, t = globalThis == null ? void 0 : globalThis.document) {
  const o = T(e);
  E(() => {
    const n = s => {
      s.key === 'Escape' && o(s);
    };
    return t.addEventListener('keydown', n), () => t.removeEventListener('keydown', n);
  }, [o, t]);
}
const G = 'dismissableLayer.update',
  Me = 'dismissableLayer.pointerDownOutside',
  Ue = 'dismissableLayer.focusOutside';
let Q;
const Ke = /* @__PURE__ */ De({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set(),
  }),
  We = /* @__PURE__ */ m((e, t) => {
    var o;
    const {
        disableOutsidePointerEvents: n = !1,
        onEscapeKeyDown: s,
        onPointerDownOutside: c,
        onFocusOutside: r,
        onInteractOutside: a,
        onDismiss: f,
        ...p
      } = e,
      i = ye(Ke),
      [u, k] = S(null),
      b =
        (o = u == null ? void 0 : u.ownerDocument) !== null && o !== void 0
          ? o
          : globalThis == null
          ? void 0
          : globalThis.document,
      [, M] = S({}),
      d = A(t, $ => k($)),
      x = Array.from(i.layers),
      [v] = [...i.layersWithOutsidePointerEventsDisabled].slice(-1),
      _ = x.indexOf(v),
      N = u ? x.indexOf(u) : -1,
      R = i.layersWithOutsidePointerEventsDisabled.size > 0,
      U = N >= _,
      he = Be($ => {
        const L = $.target,
          J = [...i.branches].some(K => K.contains(L));
        !U || J || (c == null || c($), a == null || a($), $.defaultPrevented || f == null || f());
      }, b),
      Z = ze($ => {
        const L = $.target;
        [...i.branches].some(K => K.contains(L)) ||
          (r == null || r($), a == null || a($), $.defaultPrevented || f == null || f());
      }, b);
    return (
      ke($ => {
        N === i.layers.size - 1 &&
          (s == null || s($), !$.defaultPrevented && f && ($.preventDefault(), f()));
      }, b),
      E(() => {
        if (u)
          return (
            n &&
              (i.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Q = b.body.style.pointerEvents), (b.body.style.pointerEvents = 'none')),
              i.layersWithOutsidePointerEventsDisabled.add(u)),
            i.layers.add(u),
            ee(),
            () => {
              n &&
                i.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (b.body.style.pointerEvents = Q);
            }
          );
      }, [u, b, n, i]),
      E(
        () => () => {
          u && (i.layers.delete(u), i.layersWithOutsidePointerEventsDisabled.delete(u), ee());
        },
        [u, i],
      ),
      E(() => {
        const $ = () => M({});
        return document.addEventListener(G, $), () => document.removeEventListener(G, $);
      }, []),
      /* @__PURE__ */ l(
        C.div,
        g({}, p, {
          ref: d,
          style: {
            pointerEvents: R ? (U ? 'auto' : 'none') : void 0,
            ...e.style,
          },
          onFocusCapture: O(e.onFocusCapture, Z.onFocusCapture),
          onBlurCapture: O(e.onBlurCapture, Z.onBlurCapture),
          onPointerDownCapture: O(e.onPointerDownCapture, he.onPointerDownCapture),
        }),
      )
    );
  });
function Be(e, t = globalThis == null ? void 0 : globalThis.document) {
  const o = T(e),
    n = h(!1),
    s = h(() => {});
  return (
    E(() => {
      const c = a => {
          if (a.target && !n.current) {
            let p = function () {
              ae(Me, o, f, {
                discrete: !0,
              });
            };
            const f = {
              originalEvent: a,
            };
            a.pointerType === 'touch'
              ? (t.removeEventListener('click', s.current),
                (s.current = p),
                t.addEventListener('click', s.current, {
                  once: !0,
                }))
              : p();
          }
          n.current = !1;
        },
        r = window.setTimeout(() => {
          t.addEventListener('pointerdown', c);
        }, 0);
      return () => {
        window.clearTimeout(r),
          t.removeEventListener('pointerdown', c),
          t.removeEventListener('click', s.current);
      };
    }, [t, o]),
    {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => (n.current = !0),
    }
  );
}
function ze(e, t = globalThis == null ? void 0 : globalThis.document) {
  const o = T(e),
    n = h(!1);
  return (
    E(() => {
      const s = c => {
        c.target &&
          !n.current &&
          ae(
            Ue,
            o,
            {
              originalEvent: c,
            },
            {
              discrete: !1,
            },
          );
      };
      return t.addEventListener('focusin', s), () => t.removeEventListener('focusin', s);
    }, [t, o]),
    {
      onFocusCapture: () => (n.current = !0),
      onBlurCapture: () => (n.current = !1),
    }
  );
}
function ee() {
  const e = new CustomEvent(G);
  document.dispatchEvent(e);
}
function ae(e, t, o, { discrete: n }) {
  const s = o.originalEvent.target,
    c = new CustomEvent(e, {
      bubbles: !1,
      cancelable: !0,
      detail: o,
    });
  t &&
    s.addEventListener(e, t, {
      once: !0,
    }),
    n ? Te(s, c) : s.dispatchEvent(c);
}
const z = 'focusScope.autoFocusOnMount',
  H = 'focusScope.autoFocusOnUnmount',
  te = {
    bubbles: !1,
    cancelable: !0,
  },
  He = /* @__PURE__ */ m((e, t) => {
    const { loop: o = !1, trapped: n = !1, onMountAutoFocus: s, onUnmountAutoFocus: c, ...r } = e,
      [a, f] = S(null),
      p = T(s),
      i = T(c),
      u = h(null),
      k = A(t, d => f(d)),
      b = h({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    E(() => {
      if (n) {
        let d = function (v) {
            if (b.paused || !a) return;
            const _ = v.target;
            a.contains(_)
              ? (u.current = _)
              : P(u.current, {
                  select: !0,
                });
          },
          x = function (v) {
            b.paused ||
              !a ||
              a.contains(v.relatedTarget) ||
              P(u.current, {
                select: !0,
              });
          };
        return (
          document.addEventListener('focusin', d),
          document.addEventListener('focusout', x),
          () => {
            document.removeEventListener('focusin', d), document.removeEventListener('focusout', x);
          }
        );
      }
    }, [n, a, b.paused]),
      E(() => {
        if (a) {
          ne.add(b);
          const d = document.activeElement;
          if (!a.contains(d)) {
            const v = new CustomEvent(z, te);
            a.addEventListener(z, p),
              a.dispatchEvent(v),
              v.defaultPrevented ||
                (je(Ye(re(a)), {
                  select: !0,
                }),
                document.activeElement === d && P(a));
          }
          return () => {
            a.removeEventListener(z, p),
              setTimeout(() => {
                const v = new CustomEvent(H, te);
                a.addEventListener(H, i),
                  a.dispatchEvent(v),
                  v.defaultPrevented ||
                    P(d ?? document.body, {
                      select: !0,
                    }),
                  a.removeEventListener(H, i),
                  ne.remove(b);
              }, 0);
          };
        }
      }, [a, p, i, b]);
    const M = q(
      d => {
        if ((!o && !n) || b.paused) return;
        const x = d.key === 'Tab' && !d.altKey && !d.ctrlKey && !d.metaKey,
          v = document.activeElement;
        if (x && v) {
          const _ = d.currentTarget,
            [N, R] = Ge(_);
          N && R
            ? !d.shiftKey && v === R
              ? (d.preventDefault(),
                o &&
                  P(N, {
                    select: !0,
                  }))
              : d.shiftKey &&
                v === N &&
                (d.preventDefault(),
                o &&
                  P(R, {
                    select: !0,
                  }))
            : v === _ && d.preventDefault();
        }
      },
      [o, n, b.paused],
    );
    return /* @__PURE__ */ l(
      C.div,
      g(
        {
          tabIndex: -1,
        },
        r,
        {
          ref: k,
          onKeyDown: M,
        },
      ),
    );
  });
function je(e, { select: t = !1 } = {}) {
  const o = document.activeElement;
  for (const n of e)
    if (
      (P(n, {
        select: t,
      }),
      document.activeElement !== o)
    )
      return;
}
function Ge(e) {
  const t = re(e),
    o = oe(t, e),
    n = oe(t.reverse(), e);
  return [o, n];
}
function re(e) {
  const t = [],
    o = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => {
        const s = n.tagName === 'INPUT' && n.type === 'hidden';
        return n.disabled || n.hidden || s
          ? NodeFilter.FILTER_SKIP
          : n.tabIndex >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
  for (; o.nextNode(); ) t.push(o.currentNode);
  return t;
}
function oe(e, t) {
  for (const o of e)
    if (
      !Xe(o, {
        upTo: t,
      })
    )
      return o;
}
function Xe(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === 'hidden') return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === 'none') return !0;
    e = e.parentElement;
  }
  return !1;
}
function qe(e) {
  return e instanceof HTMLInputElement && 'select' in e;
}
function P(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const o = document.activeElement;
    e.focus({
      preventScroll: !0,
    }),
      e !== o && qe(e) && t && e.select();
  }
}
const ne = Ve();
function Ve() {
  let e = [];
  return {
    add(t) {
      const o = e[0];
      t !== o && (o == null || o.pause()), (e = se(e, t)), e.unshift(t);
    },
    remove(t) {
      var o;
      (e = se(e, t)), (o = e[0]) === null || o === void 0 || o.resume();
    },
  };
}
function se(e, t) {
  const o = [...e],
    n = o.indexOf(t);
  return n !== -1 && o.splice(n, 1), o;
}
function Ye(e) {
  return e.filter(t => t.tagName !== 'A');
}
const Ze = /* @__PURE__ */ m((e, t) => {
  var o;
  const {
    container: n = globalThis == null || (o = globalThis.document) === null || o === void 0
      ? void 0
      : o.body,
    ...s
  } = e;
  return n
    ? /* @__PURE__ */ Fe.createPortal(
        /* @__PURE__ */ l(
          C.div,
          g({}, s, {
            ref: t,
          }),
        ),
        n,
      )
    : null;
});
let j = 0;
function Je() {
  E(() => {
    var e, t;
    const o = document.querySelectorAll('[data-radix-focus-guard]');
    return (
      document.body.insertAdjacentElement(
        'afterbegin',
        (e = o[0]) !== null && e !== void 0 ? e : ce(),
      ),
      document.body.insertAdjacentElement(
        'beforeend',
        (t = o[1]) !== null && t !== void 0 ? t : ce(),
      ),
      j++,
      () => {
        j === 1 && document.querySelectorAll('[data-radix-focus-guard]').forEach(n => n.remove()),
          j--;
      }
    );
  }, []);
}
function ce() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none'),
    e
  );
}
const ie = 'Dialog',
  [de, Lt] = _e(ie),
  [Qe, y] = de(ie),
  et = e => {
    const {
        __scopeDialog: t,
        children: o,
        open: n,
        defaultOpen: s,
        onOpenChange: c,
        modal: r = !0,
      } = e,
      a = h(null),
      f = h(null),
      [p = !1, i] = Le({
        prop: n,
        defaultProp: s,
        onChange: c,
      });
    return /* @__PURE__ */ l(
      Qe,
      {
        scope: t,
        triggerRef: a,
        contentRef: f,
        contentId: B(),
        titleId: B(),
        descriptionId: B(),
        open: p,
        onOpenChange: i,
        onOpenToggle: q(() => i(u => !u), [i]),
        modal: r,
      },
      o,
    );
  },
  tt = 'DialogTrigger',
  ot = /* @__PURE__ */ m((e, t) => {
    const { __scopeDialog: o, ...n } = e,
      s = y(tt, o),
      c = A(t, s.triggerRef);
    return /* @__PURE__ */ l(
      C.button,
      g(
        {
          type: 'button',
          'aria-haspopup': 'dialog',
          'aria-expanded': s.open,
          'aria-controls': s.contentId,
          'data-state': Y(s.open),
        },
        n,
        {
          ref: c,
          onClick: O(e.onClick, s.onOpenToggle),
        },
      ),
    );
  }),
  le = 'DialogPortal',
  [nt, ue] = de(le, {
    forceMount: void 0,
  }),
  st = e => {
    const { __scopeDialog: t, forceMount: o, children: n, container: s } = e,
      c = y(le, t);
    return /* @__PURE__ */ l(
      nt,
      {
        scope: t,
        forceMount: o,
      },
      xe.map(n, r =>
        /* @__PURE__ */ l(
          V,
          {
            present: o || c.open,
          },
          /* @__PURE__ */ l(
            Ze,
            {
              asChild: !0,
              container: s,
            },
            r,
          ),
        ),
      ),
    );
  },
  X = 'DialogOverlay',
  ct = /* @__PURE__ */ m((e, t) => {
    const o = ue(X, e.__scopeDialog),
      { forceMount: n = o.forceMount, ...s } = e,
      c = y(X, e.__scopeDialog);
    return c.modal
      ? /* @__PURE__ */ l(
          V,
          {
            present: n || c.open,
          },
          /* @__PURE__ */ l(
            at,
            g({}, s, {
              ref: t,
            }),
          ),
        )
      : null;
  }),
  at = /* @__PURE__ */ m((e, t) => {
    const { __scopeDialog: o, ...n } = e,
      s = y(X, o);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ l(
        Ne,
        {
          as: Pe,
          allowPinchZoom: !0,
          shards: [s.contentRef],
        },
        /* @__PURE__ */ l(
          C.div,
          g(
            {
              'data-state': Y(s.open),
            },
            n,
            {
              ref: t,
              style: {
                pointerEvents: 'auto',
                ...n.style,
              },
            },
          ),
        ),
      )
    );
  }),
  w = 'DialogContent',
  rt = /* @__PURE__ */ m((e, t) => {
    const o = ue(w, e.__scopeDialog),
      { forceMount: n = o.forceMount, ...s } = e,
      c = y(w, e.__scopeDialog);
    return /* @__PURE__ */ l(
      V,
      {
        present: n || c.open,
      },
      c.modal
        ? /* @__PURE__ */ l(
            it,
            g({}, s, {
              ref: t,
            }),
          )
        : /* @__PURE__ */ l(
            dt,
            g({}, s, {
              ref: t,
            }),
          ),
    );
  }),
  it = /* @__PURE__ */ m((e, t) => {
    const o = y(w, e.__scopeDialog),
      n = h(null),
      s = A(t, o.contentRef, n);
    return (
      E(() => {
        const c = n.current;
        if (c) return Ie(c);
      }, []),
      /* @__PURE__ */ l(
        fe,
        g({}, e, {
          ref: s,
          trapFocus: o.open,
          disableOutsidePointerEvents: !0,
          onCloseAutoFocus: O(e.onCloseAutoFocus, c => {
            var r;
            c.preventDefault(), (r = o.triggerRef.current) === null || r === void 0 || r.focus();
          }),
          onPointerDownOutside: O(e.onPointerDownOutside, c => {
            const r = c.detail.originalEvent,
              a = r.button === 0 && r.ctrlKey === !0;
            (r.button === 2 || a) && c.preventDefault();
          }),
          onFocusOutside: O(e.onFocusOutside, c => c.preventDefault()),
        }),
      )
    );
  }),
  dt = /* @__PURE__ */ m((e, t) => {
    const o = y(w, e.__scopeDialog),
      n = h(!1);
    return /* @__PURE__ */ l(
      fe,
      g({}, e, {
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: s => {
          var c;
          if (
            ((c = e.onCloseAutoFocus) === null || c === void 0 || c.call(e, s), !s.defaultPrevented)
          ) {
            var r;
            n.current || (r = o.triggerRef.current) === null || r === void 0 || r.focus(),
              s.preventDefault();
          }
          n.current = !1;
        },
        onInteractOutside: s => {
          var c, r;
          (c = e.onInteractOutside) === null || c === void 0 || c.call(e, s),
            s.defaultPrevented || (n.current = !0);
          const a = s.target;
          ((r = o.triggerRef.current) === null || r === void 0 ? void 0 : r.contains(a)) &&
            s.preventDefault();
        },
      }),
    );
  }),
  fe = /* @__PURE__ */ m((e, t) => {
    const { __scopeDialog: o, trapFocus: n, onOpenAutoFocus: s, onCloseAutoFocus: c, ...r } = e,
      a = y(w, o),
      f = h(null),
      p = A(t, f);
    return (
      Je(),
      /* @__PURE__ */ l(
        Oe,
        null,
        /* @__PURE__ */ l(
          He,
          {
            asChild: !0,
            loop: !0,
            trapped: n,
            onMountAutoFocus: s,
            onUnmountAutoFocus: c,
          },
          /* @__PURE__ */ l(
            We,
            g(
              {
                role: 'dialog',
                id: a.contentId,
                'aria-describedby': a.descriptionId,
                'aria-labelledby': a.titleId,
                'data-state': Y(a.open),
              },
              r,
              {
                ref: p,
                onDismiss: () => a.onOpenChange(!1),
              },
            ),
          ),
        ),
        !1,
      )
    );
  }),
  lt = 'DialogTitle',
  ut = /* @__PURE__ */ m((e, t) => {
    const { __scopeDialog: o, ...n } = e,
      s = y(lt, o);
    return /* @__PURE__ */ l(
      C.h2,
      g(
        {
          id: s.titleId,
        },
        n,
        {
          ref: t,
        },
      ),
    );
  }),
  ft = 'DialogDescription',
  $t = /* @__PURE__ */ m((e, t) => {
    const { __scopeDialog: o, ...n } = e,
      s = y(ft, o);
    return /* @__PURE__ */ l(
      C.p,
      g(
        {
          id: s.descriptionId,
        },
        n,
        {
          ref: t,
        },
      ),
    );
  }),
  pt = 'DialogClose',
  bt = /* @__PURE__ */ m((e, t) => {
    const { __scopeDialog: o, ...n } = e,
      s = y(pt, o);
    return /* @__PURE__ */ l(
      C.button,
      g(
        {
          type: 'button',
        },
        n,
        {
          ref: t,
          onClick: O(e.onClick, () => s.onOpenChange(!1)),
        },
      ),
    );
  });
function Y(e) {
  return e ? 'open' : 'closed';
}
const vt = et,
  gt = ot,
  $e = st,
  pe = ct,
  be = rt,
  ve = ut,
  ge = $t,
  mt = bt,
  Et = Re('X', [
    ['line', { x1: '18', x2: '6', y1: '6', y2: '18', key: '15jfxm' }],
    ['line', { x1: '6', x2: '18', y1: '6', y2: '18', key: 'd1lma3' }],
  ]),
  St = vt,
  kt = gt,
  me = ({ className: e, children: t, ...o }) =>
    /* @__PURE__ */ D($e, {
      className: F(e),
      ...o,
      children: /* @__PURE__ */ D('div', {
        className: 'fixed inset-0 z-50 flex items-start justify-center sm:items-center',
        children: t,
      }),
    });
me.displayName = $e.displayName;
const Ee = I.forwardRef(({ className: e, ...t }, o) =>
  /* @__PURE__ */ D(pe, {
    ref: o,
    className: F(
      'bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-50 backdrop-blur-sm transition-all duration-100',
      e,
    ),
    ...t,
  }),
);
Ee.displayName = pe.displayName;
const ht = I.forwardRef(({ className: e, children: t, ...o }, n) =>
  /* @__PURE__ */ W(me, {
    children: [
      /* @__PURE__ */ D(Ee, {}),
      /* @__PURE__ */ W(be, {
        ref: n,
        className: F(
          'bg-background animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 fixed z-50 grid w-full gap-4 rounded-b-lg border p-6 shadow-lg sm:max-w-lg sm:rounded-lg',
          e,
        ),
        ...o,
        children: [
          t,
          /* @__PURE__ */ W(mt, {
            className:
              'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none',
            children: [
              /* @__PURE__ */ D(Et, { className: 'h-4 w-4' }),
              /* @__PURE__ */ D('span', { className: 'sr-only', children: 'Close' }),
            ],
          }),
        ],
      }),
    ],
  }),
);
ht.displayName = be.displayName;
const yt = ({ className: e, ...t }) =>
  /* @__PURE__ */ D('div', {
    className: F('flex flex-col space-y-1.5 text-center sm:text-left', e),
    ...t,
  });
yt.displayName = 'DialogHeader';
const Dt = ({ className: e, ...t }) =>
  /* @__PURE__ */ D('div', {
    className: F('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', e),
    ...t,
  });
Dt.displayName = 'DialogFooter';
const xt = I.forwardRef(({ className: e, ...t }, o) =>
  /* @__PURE__ */ D(ve, {
    ref: o,
    className: F('text-lg font-semibold leading-none tracking-tight', e),
    ...t,
  }),
);
xt.displayName = ve.displayName;
const Ot = I.forwardRef(({ className: e, ...t }, o) =>
  /* @__PURE__ */ D(ge, {
    ref: o,
    className: F('text-muted-foreground text-sm', e),
    ...t,
  }),
);
Ot.displayName = ge.displayName;
export {
  St as Dialog,
  ht as DialogContent,
  Ot as DialogDescription,
  Dt as DialogFooter,
  yt as DialogHeader,
  xt as DialogTitle,
  kt as DialogTrigger,
};
