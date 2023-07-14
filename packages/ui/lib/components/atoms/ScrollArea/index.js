import { jsxs as se, jsx as _ } from 'react/jsx-runtime';
import * as ie from 'react';
import de, {
  useContext as be,
  createContext as ue,
  forwardRef as v,
  useEffect as P,
  createElement as h,
  useState as $,
  useRef as C,
  useCallback as he,
  useReducer as fe,
  Fragment as pe,
} from 'react';
import { _ as m } from '../../../extends-70f3d2a3.js';
import { $ as W } from '../../../index.module-06df6ed9.js';
import { c as me, d as I, b as A, a as E, $ as $e } from '../../../index.module-e6352d52.js';
import { a as L } from '../../../index.module-4fc81c69.js';
import { a as J } from '../../../ctw-6a823672.js';
import 'react-dom';
const ve = /* @__PURE__ */ ue(void 0);
function Se(e) {
  const r = be(ve);
  return e || r || 'ltr';
}
function we(e, [r, o]) {
  return Math.min(o, Math.max(r, e));
}
function ge(e, r) {
  return fe((o, l) => {
    const t = r[o][l];
    return t ?? o;
  }, e);
}
const K = 'ScrollArea',
  [Q, Ge] = me(K),
  [Pe, w] = Q(K),
  Ce = /* @__PURE__ */ v((e, r) => {
    const { __scopeScrollArea: o, type: l = 'hover', dir: t, scrollHideDelay: n = 600, ...a } = e,
      [c, i] = $(null),
      [b, s] = $(null),
      [u, d] = $(null),
      [f, S] = $(null),
      [D, k] = $(null),
      [T, H] = $(0),
      [B, M] = $(0),
      [N, z] = $(!1),
      [O, X] = $(!1),
      p = L(r, y => i(y)),
      g = Se(t);
    return /* @__PURE__ */ h(
      Pe,
      {
        scope: o,
        type: l,
        dir: g,
        scrollHideDelay: n,
        scrollArea: c,
        viewport: b,
        onViewportChange: s,
        content: u,
        onContentChange: d,
        scrollbarX: f,
        onScrollbarXChange: S,
        scrollbarXEnabled: N,
        onScrollbarXEnabledChange: z,
        scrollbarY: D,
        onScrollbarYChange: k,
        scrollbarYEnabled: O,
        onScrollbarYEnabledChange: X,
        onCornerWidthChange: H,
        onCornerHeightChange: M,
      },
      /* @__PURE__ */ h(
        W.div,
        m(
          {
            dir: g,
          },
          a,
          {
            ref: p,
            style: {
              position: 'relative',
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              '--radix-scroll-area-corner-width': T + 'px',
              '--radix-scroll-area-corner-height': B + 'px',
              ...e.style,
            },
          },
        ),
      ),
    );
  }),
  xe = 'ScrollAreaViewport',
  Te = /* @__PURE__ */ v((e, r) => {
    const { __scopeScrollArea: o, children: l, ...t } = e,
      n = w(xe, o),
      a = C(null),
      c = L(r, a, n.onViewportChange);
    return /* @__PURE__ */ h(
      pe,
      null,
      /* @__PURE__ */ h('style', {
        dangerouslySetInnerHTML: {
          __html:
            '[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}',
        },
      }),
      /* @__PURE__ */ h(
        W.div,
        m(
          {
            'data-radix-scroll-area-viewport': '',
          },
          t,
          {
            ref: c,
            style: {
              /**
               * We don't support `visible` because the intention is to have at least one scrollbar
               * if this component is used and `visible` will behave like `auto` in that case
               * https://developer.mozilla.org/en-US/docs/Web/CSS/overflowed#description
               *
               * We don't handle `auto` because the intention is for the native implementation
               * to be hidden if using this component. We just want to ensure the node is scrollable
               * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
               * the browser from having to work out whether to render native scrollbars or not,
               * we tell it to with the intention of hiding them in CSS.
               */
              overflowX: n.scrollbarXEnabled ? 'scroll' : 'hidden',
              overflowY: n.scrollbarYEnabled ? 'scroll' : 'hidden',
              ...e.style,
            },
          },
        ),
        /* @__PURE__ */ h(
          'div',
          {
            ref: n.onContentChange,
            style: {
              minWidth: '100%',
              display: 'table',
            },
          },
          l,
        ),
      ),
    );
  }),
  x = 'ScrollAreaScrollbar',
  Z = /* @__PURE__ */ v((e, r) => {
    const { forceMount: o, ...l } = e,
      t = w(x, e.__scopeScrollArea),
      { onScrollbarXEnabledChange: n, onScrollbarYEnabledChange: a } = t,
      c = e.orientation === 'horizontal';
    return (
      P(
        () => (
          c ? n(!0) : a(!0),
          () => {
            c ? n(!1) : a(!1);
          }
        ),
        [c, n, a],
      ),
      t.type === 'hover'
        ? /* @__PURE__ */ h(
            Ee,
            m({}, l, {
              ref: r,
              forceMount: o,
            }),
          )
        : t.type === 'scroll'
        ? /* @__PURE__ */ h(
            Ae,
            m({}, l, {
              ref: r,
              forceMount: o,
            }),
          )
        : t.type === 'auto'
        ? /* @__PURE__ */ h(
            ee,
            m({}, l, {
              ref: r,
              forceMount: o,
            }),
          )
        : t.type === 'always'
        ? /* @__PURE__ */ h(
            q,
            m({}, l, {
              ref: r,
            }),
          )
        : null
    );
  }),
  Ee = /* @__PURE__ */ v((e, r) => {
    const { forceMount: o, ...l } = e,
      t = w(x, e.__scopeScrollArea),
      [n, a] = $(!1);
    return (
      P(() => {
        const c = t.scrollArea;
        let i = 0;
        if (c) {
          const b = () => {
              window.clearTimeout(i), a(!0);
            },
            s = () => {
              i = window.setTimeout(() => a(!1), t.scrollHideDelay);
            };
          return (
            c.addEventListener('pointerenter', b),
            c.addEventListener('pointerleave', s),
            () => {
              window.clearTimeout(i),
                c.removeEventListener('pointerenter', b),
                c.removeEventListener('pointerleave', s);
            }
          );
        }
      }, [t.scrollArea, t.scrollHideDelay]),
      /* @__PURE__ */ h(
        I,
        {
          present: o || n,
        },
        /* @__PURE__ */ h(
          ee,
          m(
            {
              'data-state': n ? 'visible' : 'hidden',
            },
            l,
            {
              ref: r,
            },
          ),
        ),
      )
    );
  }),
  Ae = /* @__PURE__ */ v((e, r) => {
    const { forceMount: o, ...l } = e,
      t = w(x, e.__scopeScrollArea),
      n = e.orientation === 'horizontal',
      a = V(() => i('SCROLL_END'), 100),
      [c, i] = ge('hidden', {
        hidden: {
          SCROLL: 'scrolling',
        },
        scrolling: {
          SCROLL_END: 'idle',
          POINTER_ENTER: 'interacting',
        },
        interacting: {
          SCROLL: 'interacting',
          POINTER_LEAVE: 'idle',
        },
        idle: {
          HIDE: 'hidden',
          SCROLL: 'scrolling',
          POINTER_ENTER: 'interacting',
        },
      });
    return (
      P(() => {
        if (c === 'idle') {
          const b = window.setTimeout(() => i('HIDE'), t.scrollHideDelay);
          return () => window.clearTimeout(b);
        }
      }, [c, t.scrollHideDelay, i]),
      P(() => {
        const b = t.viewport,
          s = n ? 'scrollLeft' : 'scrollTop';
        if (b) {
          let u = b[s];
          const d = () => {
            const f = b[s];
            u !== f && (i('SCROLL'), a()), (u = f);
          };
          return b.addEventListener('scroll', d), () => b.removeEventListener('scroll', d);
        }
      }, [t.viewport, n, i, a]),
      /* @__PURE__ */ h(
        I,
        {
          present: o || c !== 'hidden',
        },
        /* @__PURE__ */ h(
          q,
          m(
            {
              'data-state': c === 'hidden' ? 'hidden' : 'visible',
            },
            l,
            {
              ref: r,
              onPointerEnter: A(e.onPointerEnter, () => i('POINTER_ENTER')),
              onPointerLeave: A(e.onPointerLeave, () => i('POINTER_LEAVE')),
            },
          ),
        ),
      )
    );
  }),
  ee = /* @__PURE__ */ v((e, r) => {
    const o = w(x, e.__scopeScrollArea),
      { forceMount: l, ...t } = e,
      [n, a] = $(!1),
      c = e.orientation === 'horizontal',
      i = V(() => {
        if (o.viewport) {
          const b = o.viewport.offsetWidth < o.viewport.scrollWidth,
            s = o.viewport.offsetHeight < o.viewport.scrollHeight;
          a(c ? b : s);
        }
      }, 10);
    return (
      R(o.viewport, i),
      R(o.content, i),
      /* @__PURE__ */ h(
        I,
        {
          present: l || n,
        },
        /* @__PURE__ */ h(
          q,
          m(
            {
              'data-state': n ? 'visible' : 'hidden',
            },
            t,
            {
              ref: r,
            },
          ),
        ),
      )
    );
  }),
  q = /* @__PURE__ */ v((e, r) => {
    const { orientation: o = 'vertical', ...l } = e,
      t = w(x, e.__scopeScrollArea),
      n = C(null),
      a = C(0),
      [c, i] = $({
        content: 0,
        viewport: 0,
        scrollbar: {
          size: 0,
          paddingStart: 0,
          paddingEnd: 0,
        },
      }),
      b = ne(c.viewport, c.content),
      s = {
        ...l,
        sizes: c,
        onSizesChange: i,
        hasThumb: b > 0 && b < 1,
        onThumbChange: d => (n.current = d),
        onThumbPointerUp: () => (a.current = 0),
        onThumbPointerDown: d => (a.current = d),
      };
    function u(d, f) {
      return He(d, a.current, c, f);
    }
    return o === 'horizontal'
      ? /* @__PURE__ */ h(
          ye,
          m({}, s, {
            ref: r,
            onThumbPositionChange: () => {
              if (t.viewport && n.current) {
                const d = t.viewport.scrollLeft,
                  f = G(d, c, t.dir);
                n.current.style.transform = `translate3d(${f}px, 0, 0)`;
              }
            },
            onWheelScroll: d => {
              t.viewport && (t.viewport.scrollLeft = d);
            },
            onDragScroll: d => {
              t.viewport && (t.viewport.scrollLeft = u(d, t.dir));
            },
          }),
        )
      : o === 'vertical'
      ? /* @__PURE__ */ h(
          _e,
          m({}, s, {
            ref: r,
            onThumbPositionChange: () => {
              if (t.viewport && n.current) {
                const d = t.viewport.scrollTop,
                  f = G(d, c);
                n.current.style.transform = `translate3d(0, ${f}px, 0)`;
              }
            },
            onWheelScroll: d => {
              t.viewport && (t.viewport.scrollTop = d);
            },
            onDragScroll: d => {
              t.viewport && (t.viewport.scrollTop = u(d));
            },
          }),
        )
      : null;
  }),
  ye = /* @__PURE__ */ v((e, r) => {
    const { sizes: o, onSizesChange: l, ...t } = e,
      n = w(x, e.__scopeScrollArea),
      [a, c] = $(),
      i = C(null),
      b = L(r, i, n.onScrollbarXChange);
    return (
      P(() => {
        i.current && c(getComputedStyle(i.current));
      }, [i]),
      /* @__PURE__ */ h(
        re,
        m(
          {
            'data-orientation': 'horizontal',
          },
          t,
          {
            ref: b,
            sizes: o,
            style: {
              bottom: 0,
              left: n.dir === 'rtl' ? 'var(--radix-scroll-area-corner-width)' : 0,
              right: n.dir === 'ltr' ? 'var(--radix-scroll-area-corner-width)' : 0,
              '--radix-scroll-area-thumb-width': U(o) + 'px',
              ...e.style,
            },
            onThumbPointerDown: s => e.onThumbPointerDown(s.x),
            onDragScroll: s => e.onDragScroll(s.x),
            onWheelScroll: (s, u) => {
              if (n.viewport) {
                const d = n.viewport.scrollLeft + s.deltaX;
                e.onWheelScroll(d), ce(d, u) && s.preventDefault();
              }
            },
            onResize: () => {
              i.current &&
                n.viewport &&
                a &&
                l({
                  content: n.viewport.scrollWidth,
                  viewport: n.viewport.offsetWidth,
                  scrollbar: {
                    size: i.current.clientWidth,
                    paddingStart: Y(a.paddingLeft),
                    paddingEnd: Y(a.paddingRight),
                  },
                });
            },
          },
        ),
      )
    );
  }),
  _e = /* @__PURE__ */ v((e, r) => {
    const { sizes: o, onSizesChange: l, ...t } = e,
      n = w(x, e.__scopeScrollArea),
      [a, c] = $(),
      i = C(null),
      b = L(r, i, n.onScrollbarYChange);
    return (
      P(() => {
        i.current && c(getComputedStyle(i.current));
      }, [i]),
      /* @__PURE__ */ h(
        re,
        m(
          {
            'data-orientation': 'vertical',
          },
          t,
          {
            ref: b,
            sizes: o,
            style: {
              top: 0,
              right: n.dir === 'ltr' ? 0 : void 0,
              left: n.dir === 'rtl' ? 0 : void 0,
              bottom: 'var(--radix-scroll-area-corner-height)',
              '--radix-scroll-area-thumb-height': U(o) + 'px',
              ...e.style,
            },
            onThumbPointerDown: s => e.onThumbPointerDown(s.y),
            onDragScroll: s => e.onDragScroll(s.y),
            onWheelScroll: (s, u) => {
              if (n.viewport) {
                const d = n.viewport.scrollTop + s.deltaY;
                e.onWheelScroll(d), ce(d, u) && s.preventDefault();
              }
            },
            onResize: () => {
              i.current &&
                n.viewport &&
                a &&
                l({
                  content: n.viewport.scrollHeight,
                  viewport: n.viewport.offsetHeight,
                  scrollbar: {
                    size: i.current.clientHeight,
                    paddingStart: Y(a.paddingTop),
                    paddingEnd: Y(a.paddingBottom),
                  },
                });
            },
          },
        ),
      )
    );
  }),
  [Re, oe] = Q(x),
  re = /* @__PURE__ */ v((e, r) => {
    const {
        __scopeScrollArea: o,
        sizes: l,
        hasThumb: t,
        onThumbChange: n,
        onThumbPointerUp: a,
        onThumbPointerDown: c,
        onThumbPositionChange: i,
        onDragScroll: b,
        onWheelScroll: s,
        onResize: u,
        ...d
      } = e,
      f = w(x, o),
      [S, D] = $(null),
      k = L(r, p => D(p)),
      T = C(null),
      H = C(''),
      B = f.viewport,
      M = l.content - l.viewport,
      N = E(s),
      z = E(i),
      O = V(u, 10);
    function X(p) {
      if (T.current) {
        const g = p.clientX - T.current.left,
          y = p.clientY - T.current.top;
        b({
          x: g,
          y,
        });
      }
    }
    return (
      P(() => {
        const p = g => {
          const y = g.target;
          (S == null ? void 0 : S.contains(y)) && N(g, M);
        };
        return (
          document.addEventListener('wheel', p, {
            passive: !1,
          }),
          () =>
            document.removeEventListener('wheel', p, {
              passive: !1,
            })
        );
      }, [B, S, M, N]),
      P(z, [l, z]),
      R(S, O),
      R(f.content, O),
      /* @__PURE__ */ h(
        Re,
        {
          scope: o,
          scrollbar: S,
          hasThumb: t,
          onThumbChange: E(n),
          onThumbPointerUp: E(a),
          onThumbPositionChange: z,
          onThumbPointerDown: E(c),
        },
        /* @__PURE__ */ h(
          W.div,
          m({}, d, {
            ref: k,
            style: {
              position: 'absolute',
              ...d.style,
            },
            onPointerDown: A(e.onPointerDown, p => {
              p.button === 0 &&
                (p.target.setPointerCapture(p.pointerId),
                (T.current = S.getBoundingClientRect()),
                (H.current = document.body.style.webkitUserSelect),
                (document.body.style.webkitUserSelect = 'none'),
                X(p));
            }),
            onPointerMove: A(e.onPointerMove, X),
            onPointerUp: A(e.onPointerUp, p => {
              const g = p.target;
              g.hasPointerCapture(p.pointerId) && g.releasePointerCapture(p.pointerId),
                (document.body.style.webkitUserSelect = H.current),
                (T.current = null);
            }),
          }),
        ),
      )
    );
  }),
  F = 'ScrollAreaThumb',
  Le = /* @__PURE__ */ v((e, r) => {
    const { forceMount: o, ...l } = e,
      t = oe(F, e.__scopeScrollArea);
    return /* @__PURE__ */ h(
      I,
      {
        present: o || t.hasThumb,
      },
      /* @__PURE__ */ h(
        De,
        m(
          {
            ref: r,
          },
          l,
        ),
      ),
    );
  }),
  De = /* @__PURE__ */ v((e, r) => {
    const { __scopeScrollArea: o, style: l, ...t } = e,
      n = w(F, o),
      a = oe(F, o),
      { onThumbPositionChange: c } = a,
      i = L(r, u => a.onThumbChange(u)),
      b = C(),
      s = V(() => {
        b.current && (b.current(), (b.current = void 0));
      }, 100);
    return (
      P(() => {
        const u = n.viewport;
        if (u) {
          const d = () => {
            if ((s(), !b.current)) {
              const f = Me(u, c);
              (b.current = f), c();
            }
          };
          return c(), u.addEventListener('scroll', d), () => u.removeEventListener('scroll', d);
        }
      }, [n.viewport, s, c]),
      /* @__PURE__ */ h(
        W.div,
        m(
          {
            'data-state': a.hasThumb ? 'visible' : 'hidden',
          },
          t,
          {
            ref: i,
            style: {
              width: 'var(--radix-scroll-area-thumb-width)',
              height: 'var(--radix-scroll-area-thumb-height)',
              ...l,
            },
            onPointerDownCapture: A(e.onPointerDownCapture, u => {
              const f = u.target.getBoundingClientRect(),
                S = u.clientX - f.left,
                D = u.clientY - f.top;
              a.onThumbPointerDown({
                x: S,
                y: D,
              });
            }),
            onPointerUp: A(e.onPointerUp, a.onThumbPointerUp),
          },
        ),
      )
    );
  }),
  te = 'ScrollAreaCorner',
  ze = /* @__PURE__ */ v((e, r) => {
    const o = w(te, e.__scopeScrollArea),
      l = !!(o.scrollbarX && o.scrollbarY);
    return o.type !== 'scroll' && l
      ? /* @__PURE__ */ h(
          We,
          m({}, e, {
            ref: r,
          }),
        )
      : null;
  }),
  We = /* @__PURE__ */ v((e, r) => {
    const { __scopeScrollArea: o, ...l } = e,
      t = w(te, o),
      [n, a] = $(0),
      [c, i] = $(0),
      b = !!(n && c);
    return (
      R(t.scrollbarX, () => {
        var s;
        const u = ((s = t.scrollbarX) === null || s === void 0 ? void 0 : s.offsetHeight) || 0;
        t.onCornerHeightChange(u), i(u);
      }),
      R(t.scrollbarY, () => {
        var s;
        const u = ((s = t.scrollbarY) === null || s === void 0 ? void 0 : s.offsetWidth) || 0;
        t.onCornerWidthChange(u), a(u);
      }),
      b
        ? /* @__PURE__ */ h(
            W.div,
            m({}, l, {
              ref: r,
              style: {
                width: n,
                height: c,
                position: 'absolute',
                right: t.dir === 'ltr' ? 0 : void 0,
                left: t.dir === 'rtl' ? 0 : void 0,
                bottom: 0,
                ...e.style,
              },
            }),
          )
        : null
    );
  });
function Y(e) {
  return e ? parseInt(e, 10) : 0;
}
function ne(e, r) {
  const o = e / r;
  return isNaN(o) ? 0 : o;
}
function U(e) {
  const r = ne(e.viewport, e.content),
    o = e.scrollbar.paddingStart + e.scrollbar.paddingEnd,
    l = (e.scrollbar.size - o) * r;
  return Math.max(l, 18);
}
function He(e, r, o, l = 'ltr') {
  const t = U(o),
    n = t / 2,
    a = r || n,
    c = t - a,
    i = o.scrollbar.paddingStart + a,
    b = o.scrollbar.size - o.scrollbar.paddingEnd - c,
    s = o.content - o.viewport,
    u = l === 'ltr' ? [0, s] : [s * -1, 0];
  return le([i, b], u)(e);
}
function G(e, r, o = 'ltr') {
  const l = U(r),
    t = r.scrollbar.paddingStart + r.scrollbar.paddingEnd,
    n = r.scrollbar.size - t,
    a = r.content - r.viewport,
    c = n - l,
    i = o === 'ltr' ? [0, a] : [a * -1, 0],
    b = we(e, i);
  return le([0, a], [0, c])(b);
}
function le(e, r) {
  return o => {
    if (e[0] === e[1] || r[0] === r[1]) return r[0];
    const l = (r[1] - r[0]) / (e[1] - e[0]);
    return r[0] + l * (o - e[0]);
  };
}
function ce(e, r) {
  return e > 0 && e < r;
}
const Me = (e, r = () => {}) => {
  let o = {
      left: e.scrollLeft,
      top: e.scrollTop,
    },
    l = 0;
  return (
    (function t() {
      const n = {
          left: e.scrollLeft,
          top: e.scrollTop,
        },
        a = o.left !== n.left,
        c = o.top !== n.top;
      (a || c) && r(), (o = n), (l = window.requestAnimationFrame(t));
    })(),
    () => window.cancelAnimationFrame(l)
  );
};
function V(e, r) {
  const o = E(e),
    l = C(0);
  return (
    P(() => () => window.clearTimeout(l.current), []),
    he(() => {
      window.clearTimeout(l.current), (l.current = window.setTimeout(o, r));
    }, [o, r])
  );
}
function R(e, r) {
  const o = E(r);
  $e(() => {
    let l = 0;
    if (e) {
      const t = new ResizeObserver(() => {
        cancelAnimationFrame(l), (l = window.requestAnimationFrame(o));
      });
      return (
        t.observe(e),
        () => {
          window.cancelAnimationFrame(l), t.unobserve(e);
        }
      );
    }
  }, [e, o]);
}
const ae = Ce,
  Ne = Te,
  Oe = ze,
  Xe = ie.forwardRef(({ className: e, children: r, orientation: o, ...l }, t) =>
    /* @__PURE__ */ se(ae, {
      ref: t,
      className: J('relative overflow-hidden', e),
      ...l,
      children: [
        /* @__PURE__ */ _(Ne, { className: 'h-full w-full rounded-[inherit]', children: r }),
        /* @__PURE__ */ _(j, { orientation: 'vertical' }),
        /* @__PURE__ */ _(j, { orientation: 'horizontal' }),
        /* @__PURE__ */ _(Oe, {}),
      ],
    }),
  );
Xe.displayName = ae.displayName;
const j = de.forwardRef(({ className: e, orientation: r = 'vertical', ...o }, l) =>
  /* @__PURE__ */ _(Z, {
    ref: l,
    orientation: r,
    className: J(
      'touch-none select-none transition-colors',
      r === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      r === 'horizontal' && 'flex h-2.5 border-t border-t-transparent p-[1px]',
      e,
    ),
    ...o,
    children: /* @__PURE__ */ _(Le, { className: 'bg-border rounded-full' }),
  }),
);
j.displayName = Z.displayName;
export { Xe as ScrollArea, j as ScrollBar };
