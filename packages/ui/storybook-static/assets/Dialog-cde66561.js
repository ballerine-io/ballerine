import { j as S, c as M } from './ctw-409c05e4.js';
import { r as a, a as ze } from './index-8db94870.js';
import { _ as w } from './extends-98964cd2.js';
import { a as F, $ as Xe } from './index.module-1a92c487.js';
import { $ as O, a as Ye } from './index.module-1078e6dd.js';
import { R as Ge, r as Ve } from './index-8ce4a492.js';
function N(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (o) {
    if ((e == null || e(o), n === !1 || !o.defaultPrevented)) return t == null ? void 0 : t(o);
  };
}
function Ze(e, t = []) {
  let n = [];
  function r(c, i) {
    const s = a.createContext(i),
      f = n.length;
    n = [...n, i];
    function d(l) {
      const { scope: h, children: m, ...$ } = l,
        u = (h == null ? void 0 : h[e][f]) || s,
        p = a.useMemo(() => $, Object.values($));
      return a.createElement(u.Provider, { value: p }, m);
    }
    function v(l, h) {
      const m = (h == null ? void 0 : h[e][f]) || s,
        $ = a.useContext(m);
      if ($) return $;
      if (i !== void 0) return i;
      throw new Error(`\`${l}\` must be used within \`${c}\``);
    }
    return (d.displayName = c + 'Provider'), [d, v];
  }
  const o = () => {
    const c = n.map(i => a.createContext(i));
    return function (s) {
      const f = (s == null ? void 0 : s[e]) || c;
      return a.useMemo(() => ({ [`__scope${e}`]: { ...s, [e]: f } }), [s, f]);
    };
  };
  return (o.scopeName = e), [r, qe(o, ...t)];
}
function qe(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map(o => ({ useScope: o(), scopeName: o.scopeName }));
    return function (c) {
      const i = r.reduce((s, { useScope: f, scopeName: d }) => {
        const l = f(c)[`__scope${d}`];
        return { ...s, ...l };
      }, {});
      return a.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    };
  };
  return (n.scopeName = t.scopeName), n;
}
const oe = globalThis != null && globalThis.document ? a.useLayoutEffect : () => {},
  Qe = ze['useId'.toString()] || (() => {});
let Je = 0;
function q(e) {
  const [t, n] = a.useState(Qe());
  return (
    oe(() => {
      e || n(r => r ?? String(Je++));
    }, [e]),
    e || (t ? `radix-${t}` : '')
  );
}
function A(e) {
  const t = a.useRef(e);
  return (
    a.useEffect(() => {
      t.current = e;
    }),
    a.useMemo(
      () =>
        (...n) => {
          var r;
          return (r = t.current) === null || r === void 0 ? void 0 : r.call(t, ...n);
        },
      [],
    )
  );
}
function et({ prop: e, defaultProp: t, onChange: n = () => {} }) {
  const [r, o] = tt({ defaultProp: t, onChange: n }),
    c = e !== void 0,
    i = c ? e : r,
    s = A(n),
    f = a.useCallback(
      d => {
        if (c) {
          const l = typeof d == 'function' ? d(e) : d;
          l !== e && s(l);
        } else o(d);
      },
      [c, e, o, s],
    );
  return [i, f];
}
function tt({ defaultProp: e, onChange: t }) {
  const n = a.useState(e),
    [r] = n,
    o = a.useRef(r),
    c = A(t);
  return (
    a.useEffect(() => {
      o.current !== r && (c(r), (o.current = r));
    }, [r, o, c]),
    n
  );
}
function nt(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = A(e);
  a.useEffect(() => {
    const r = o => {
      o.key === 'Escape' && n(o);
    };
    return t.addEventListener('keydown', r), () => t.removeEventListener('keydown', r);
  }, [n, t]);
}
const ae = 'dismissableLayer.update',
  rt = 'dismissableLayer.pointerDownOutside',
  ot = 'dismissableLayer.focusOutside';
let de;
const at = a.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  ct = a.forwardRef((e, t) => {
    var n;
    const {
        disableOutsidePointerEvents: r = !1,
        onEscapeKeyDown: o,
        onPointerDownOutside: c,
        onFocusOutside: i,
        onInteractOutside: s,
        onDismiss: f,
        ...d
      } = e,
      v = a.useContext(at),
      [l, h] = a.useState(null),
      m =
        (n = l == null ? void 0 : l.ownerDocument) !== null && n !== void 0
          ? n
          : globalThis == null
          ? void 0
          : globalThis.document,
      [, $] = a.useState({}),
      u = F(t, b => h(b)),
      p = Array.from(v.layers),
      [g] = [...v.layersWithOutsidePointerEventsDisabled].slice(-1),
      y = p.indexOf(g),
      E = l ? p.indexOf(l) : -1,
      x = v.layersWithOutsidePointerEventsDisabled.size > 0,
      C = E >= y,
      W = st(b => {
        const _ = b.target,
          le = [...v.branches].some(Z => Z.contains(_));
        !C || le || (c == null || c(b), s == null || s(b), b.defaultPrevented || f == null || f());
      }, m),
      R = it(b => {
        const _ = b.target;
        [...v.branches].some(Z => Z.contains(_)) ||
          (i == null || i(b), s == null || s(b), b.defaultPrevented || f == null || f());
      }, m);
    return (
      nt(b => {
        E === v.layers.size - 1 &&
          (o == null || o(b), !b.defaultPrevented && f && (b.preventDefault(), f()));
      }, m),
      a.useEffect(() => {
        if (l)
          return (
            r &&
              (v.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((de = m.body.style.pointerEvents), (m.body.style.pointerEvents = 'none')),
              v.layersWithOutsidePointerEventsDisabled.add(l)),
            v.layers.add(l),
            fe(),
            () => {
              r &&
                v.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (m.body.style.pointerEvents = de);
            }
          );
      }, [l, m, r, v]),
      a.useEffect(
        () => () => {
          l && (v.layers.delete(l), v.layersWithOutsidePointerEventsDisabled.delete(l), fe());
        },
        [l, v],
      ),
      a.useEffect(() => {
        const b = () => $({});
        return document.addEventListener(ae, b), () => document.removeEventListener(ae, b);
      }, []),
      a.createElement(
        O.div,
        w({}, d, {
          ref: u,
          style: { pointerEvents: x ? (C ? 'auto' : 'none') : void 0, ...e.style },
          onFocusCapture: N(e.onFocusCapture, R.onFocusCapture),
          onBlurCapture: N(e.onBlurCapture, R.onBlurCapture),
          onPointerDownCapture: N(e.onPointerDownCapture, W.onPointerDownCapture),
        }),
      )
    );
  });
function st(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = A(e),
    r = a.useRef(!1),
    o = a.useRef(() => {});
  return (
    a.useEffect(() => {
      const c = s => {
          if (s.target && !r.current) {
            let d = function () {
              Ce(rt, n, f, { discrete: !0 });
            };
            const f = { originalEvent: s };
            s.pointerType === 'touch'
              ? (t.removeEventListener('click', o.current),
                (o.current = d),
                t.addEventListener('click', o.current, { once: !0 }))
              : d();
          }
          r.current = !1;
        },
        i = window.setTimeout(() => {
          t.addEventListener('pointerdown', c);
        }, 0);
      return () => {
        window.clearTimeout(i),
          t.removeEventListener('pointerdown', c),
          t.removeEventListener('click', o.current);
      };
    }, [t, n]),
    { onPointerDownCapture: () => (r.current = !0) }
  );
}
function it(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = A(e),
    r = a.useRef(!1);
  return (
    a.useEffect(() => {
      const o = c => {
        c.target && !r.current && Ce(ot, n, { originalEvent: c }, { discrete: !1 });
      };
      return t.addEventListener('focusin', o), () => t.removeEventListener('focusin', o);
    }, [t, n]),
    { onFocusCapture: () => (r.current = !0), onBlurCapture: () => (r.current = !1) }
  );
}
function fe() {
  const e = new CustomEvent(ae);
  document.dispatchEvent(e);
}
function Ce(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target,
    c = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? Ye(o, c) : o.dispatchEvent(c);
}
const Q = 'focusScope.autoFocusOnMount',
  J = 'focusScope.autoFocusOnUnmount',
  ve = { bubbles: !1, cancelable: !0 },
  ut = a.forwardRef((e, t) => {
    const { loop: n = !1, trapped: r = !1, onMountAutoFocus: o, onUnmountAutoFocus: c, ...i } = e,
      [s, f] = a.useState(null),
      d = A(o),
      v = A(c),
      l = a.useRef(null),
      h = F(t, u => f(u)),
      m = a.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    a.useEffect(() => {
      if (r) {
        let u = function (g) {
            if (m.paused || !s) return;
            const y = g.target;
            s.contains(y) ? (l.current = y) : T(l.current, { select: !0 });
          },
          p = function (g) {
            m.paused || !s || s.contains(g.relatedTarget) || T(l.current, { select: !0 });
          };
        return (
          document.addEventListener('focusin', u),
          document.addEventListener('focusout', p),
          () => {
            document.removeEventListener('focusin', u), document.removeEventListener('focusout', p);
          }
        );
      }
    }, [r, s, m.paused]),
      a.useEffect(() => {
        if (s) {
          pe.add(m);
          const u = document.activeElement;
          if (!s.contains(u)) {
            const g = new CustomEvent(Q, ve);
            s.addEventListener(Q, d),
              s.dispatchEvent(g),
              g.defaultPrevented ||
                (lt(pt(xe(s)), { select: !0 }), document.activeElement === u && T(s));
          }
          return () => {
            s.removeEventListener(Q, d),
              setTimeout(() => {
                const g = new CustomEvent(J, ve);
                s.addEventListener(J, v),
                  s.dispatchEvent(g),
                  g.defaultPrevented || T(u ?? document.body, { select: !0 }),
                  s.removeEventListener(J, v),
                  pe.remove(m);
              }, 0);
          };
        }
      }, [s, d, v, m]);
    const $ = a.useCallback(
      u => {
        if ((!n && !r) || m.paused) return;
        const p = u.key === 'Tab' && !u.altKey && !u.ctrlKey && !u.metaKey,
          g = document.activeElement;
        if (p && g) {
          const y = u.currentTarget,
            [E, x] = dt(y);
          E && x
            ? !u.shiftKey && g === x
              ? (u.preventDefault(), n && T(E, { select: !0 }))
              : u.shiftKey && g === E && (u.preventDefault(), n && T(x, { select: !0 }))
            : g === y && u.preventDefault();
        }
      },
      [n, r, m.paused],
    );
    return a.createElement(O.div, w({ tabIndex: -1 }, i, { ref: h, onKeyDown: $ }));
  });
function lt(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e) if ((T(r, { select: t }), document.activeElement !== n)) return;
}
function dt(e) {
  const t = xe(e),
    n = me(t, e),
    r = me(t.reverse(), e);
  return [n, r];
}
function xe(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: r => {
        const o = r.tagName === 'INPUT' && r.type === 'hidden';
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function me(e, t) {
  for (const n of e) if (!ft(n, { upTo: t })) return n;
}
function ft(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === 'hidden') return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === 'none') return !0;
    e = e.parentElement;
  }
  return !1;
}
function vt(e) {
  return e instanceof HTMLInputElement && 'select' in e;
}
function T(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && vt(e) && t && e.select();
  }
}
const pe = mt();
function mt() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), (e = he(e, t)), e.unshift(t);
    },
    remove(t) {
      var n;
      (e = he(e, t)), (n = e[0]) === null || n === void 0 || n.resume();
    },
  };
}
function he(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function pt(e) {
  return e.filter(t => t.tagName !== 'A');
}
const ht = a.forwardRef((e, t) => {
  var n;
  const {
    container: r = globalThis == null || (n = globalThis.document) === null || n === void 0
      ? void 0
      : n.body,
    ...o
  } = e;
  return r ? Ge.createPortal(a.createElement(O.div, w({}, o, { ref: t })), r) : null;
});
function gt(e, t) {
  return a.useReducer((n, r) => {
    const o = t[n][r];
    return o ?? n;
  }, e);
}
const G = e => {
  const { present: t, children: n } = e,
    r = bt(t),
    o = typeof n == 'function' ? n({ present: r.isPresent }) : a.Children.only(n),
    c = F(r.ref, o.ref);
  return typeof n == 'function' || r.isPresent ? a.cloneElement(o, { ref: c }) : null;
};
G.displayName = 'Presence';
function bt(e) {
  const [t, n] = a.useState(),
    r = a.useRef({}),
    o = a.useRef(e),
    c = a.useRef('none'),
    i = e ? 'mounted' : 'unmounted',
    [s, f] = gt(i, {
      mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
      unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
      unmounted: { MOUNT: 'mounted' },
    });
  return (
    a.useEffect(() => {
      const d = U(r.current);
      c.current = s === 'mounted' ? d : 'none';
    }, [s]),
    oe(() => {
      const d = r.current,
        v = o.current;
      if (v !== e) {
        const h = c.current,
          m = U(d);
        e
          ? f('MOUNT')
          : m === 'none' || (d == null ? void 0 : d.display) === 'none'
          ? f('UNMOUNT')
          : f(v && h !== m ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (o.current = e);
      }
    }, [e, f]),
    oe(() => {
      if (t) {
        const d = l => {
            const m = U(r.current).includes(l.animationName);
            l.target === t && m && Ve.flushSync(() => f('ANIMATION_END'));
          },
          v = l => {
            l.target === t && (c.current = U(r.current));
          };
        return (
          t.addEventListener('animationstart', v),
          t.addEventListener('animationcancel', d),
          t.addEventListener('animationend', d),
          () => {
            t.removeEventListener('animationstart', v),
              t.removeEventListener('animationcancel', d),
              t.removeEventListener('animationend', d);
          }
        );
      } else f('ANIMATION_END');
    }, [t, f]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(s),
      ref: a.useCallback(d => {
        d && (r.current = getComputedStyle(d)), n(d);
      }, []),
    }
  );
}
function U(e) {
  return (e == null ? void 0 : e.animationName) || 'none';
}
let ee = 0;
function $t() {
  a.useEffect(() => {
    var e, t;
    const n = document.querySelectorAll('[data-radix-focus-guard]');
    return (
      document.body.insertAdjacentElement(
        'afterbegin',
        (e = n[0]) !== null && e !== void 0 ? e : ge(),
      ),
      document.body.insertAdjacentElement(
        'beforeend',
        (t = n[1]) !== null && t !== void 0 ? t : ge(),
      ),
      ee++,
      () => {
        ee === 1 && document.querySelectorAll('[data-radix-focus-guard]').forEach(r => r.remove()),
          ee--;
      }
    );
  }, []);
}
function ge() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none'),
    e
  );
}
var P = function () {
  return (
    (P =
      Object.assign ||
      function (t) {
        for (var n, r = 1, o = arguments.length; r < o; r++) {
          n = arguments[r];
          for (var c in n) Object.prototype.hasOwnProperty.call(n, c) && (t[c] = n[c]);
        }
        return t;
      }),
    P.apply(this, arguments)
  );
};
function we(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]]);
  return n;
}
function yt(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, o = t.length, c; r < o; r++)
      (c || !(r in t)) && (c || (c = Array.prototype.slice.call(t, 0, r)), (c[r] = t[r]));
  return e.concat(c || Array.prototype.slice.call(t));
}
var X = 'right-scroll-bar-position',
  Y = 'width-before-scroll-bar',
  Et = 'with-scroll-bars-hidden',
  Ct = '--removed-body-scroll-bar-size';
function xt(e, t) {
  return typeof e == 'function' ? e(t) : e && (e.current = t), e;
}
function wt(e, t) {
  var n = a.useState(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && ((n.value = r), n.callback(r, o));
        },
      },
    };
  })[0];
  return (n.callback = t), n.facade;
}
function St(e, t) {
  return wt(t || null, function (n) {
    return e.forEach(function (r) {
      return xt(r, n);
    });
  });
}
function Dt(e) {
  return e;
}
function Pt(e, t) {
  t === void 0 && (t = Dt);
  var n = [],
    r = !1,
    o = {
      read: function () {
        if (r)
          throw new Error(
            'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.',
          );
        return n.length ? n[n.length - 1] : e;
      },
      useMedium: function (c) {
        var i = t(c, r);
        return (
          n.push(i),
          function () {
            n = n.filter(function (s) {
              return s !== i;
            });
          }
        );
      },
      assignSyncMedium: function (c) {
        for (r = !0; n.length; ) {
          var i = n;
          (n = []), i.forEach(c);
        }
        n = {
          push: function (s) {
            return c(s);
          },
          filter: function () {
            return n;
          },
        };
      },
      assignMedium: function (c) {
        r = !0;
        var i = [];
        if (n.length) {
          var s = n;
          (n = []), s.forEach(c), (i = n);
        }
        var f = function () {
            var v = i;
            (i = []), v.forEach(c);
          },
          d = function () {
            return Promise.resolve().then(f);
          };
        d(),
          (n = {
            push: function (v) {
              i.push(v), d();
            },
            filter: function (v) {
              return (i = i.filter(v)), n;
            },
          });
      },
    };
  return o;
}
function Rt(e) {
  e === void 0 && (e = {});
  var t = Pt(null);
  return (t.options = P({ async: !0, ssr: !1 }, e)), t;
}
var Se = function (e) {
  var t = e.sideCar,
    n = we(e, ['sideCar']);
  if (!t) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  var r = t.read();
  if (!r) throw new Error('Sidecar medium not found');
  return a.createElement(r, P({}, n));
};
Se.isSideCarExport = !0;
function Nt(e, t) {
  return e.useMedium(t), Se;
}
var De = Rt(),
  te = function () {},
  V = a.forwardRef(function (e, t) {
    var n = a.useRef(null),
      r = a.useState({ onScrollCapture: te, onWheelCapture: te, onTouchMoveCapture: te }),
      o = r[0],
      c = r[1],
      i = e.forwardProps,
      s = e.children,
      f = e.className,
      d = e.removeScrollBar,
      v = e.enabled,
      l = e.shards,
      h = e.sideCar,
      m = e.noIsolation,
      $ = e.inert,
      u = e.allowPinchZoom,
      p = e.as,
      g = p === void 0 ? 'div' : p,
      y = we(e, [
        'forwardProps',
        'children',
        'className',
        'removeScrollBar',
        'enabled',
        'shards',
        'sideCar',
        'noIsolation',
        'inert',
        'allowPinchZoom',
        'as',
      ]),
      E = h,
      x = St([n, t]),
      C = P(P({}, y), o);
    return a.createElement(
      a.Fragment,
      null,
      v &&
        a.createElement(E, {
          sideCar: De,
          removeScrollBar: d,
          shards: l,
          noIsolation: m,
          inert: $,
          setCallbacks: c,
          allowPinchZoom: !!u,
          lockRef: n,
        }),
      i
        ? a.cloneElement(a.Children.only(s), P(P({}, C), { ref: x }))
        : a.createElement(g, P({}, C, { className: f, ref: x }), s),
    );
  });
V.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
V.classNames = { fullWidth: Y, zeroRight: X };
var be,
  Ot = function () {
    if (be) return be;
    if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
  };
function _t() {
  if (!document) return null;
  var e = document.createElement('style');
  e.type = 'text/css';
  var t = Ot();
  return t && e.setAttribute('nonce', t), e;
}
function Tt(e, t) {
  e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t));
}
function At(e) {
  var t = document.head || document.getElementsByTagName('head')[0];
  t.appendChild(e);
}
var kt = function () {
    var e = 0,
      t = null;
    return {
      add: function (n) {
        e == 0 && (t = _t()) && (Tt(t, n), At(t)), e++;
      },
      remove: function () {
        e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null));
      },
    };
  },
  It = function () {
    var e = kt();
    return function (t, n) {
      a.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && n],
      );
    };
  },
  Pe = function () {
    var e = It(),
      t = function (n) {
        var r = n.styles,
          o = n.dynamic;
        return e(r, o), null;
      };
    return t;
  },
  Lt = { left: 0, top: 0, right: 0, gap: 0 },
  ne = function (e) {
    return parseInt(e || '', 10) || 0;
  },
  Mt = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
      r = t[e === 'padding' ? 'paddingTop' : 'marginTop'],
      o = t[e === 'padding' ? 'paddingRight' : 'marginRight'];
    return [ne(n), ne(r), ne(o)];
  },
  Ft = function (e) {
    if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return Lt;
    var t = Mt(e),
      n = document.documentElement.clientWidth,
      r = window.innerWidth;
    return { left: t[0], top: t[1], right: t[2], gap: Math.max(0, r - n + t[2] - t[0]) };
  },
  Wt = Pe(),
  Bt = function (e, t, n, r) {
    var o = e.left,
      c = e.top,
      i = e.right,
      s = e.gap;
    return (
      n === void 0 && (n = 'margin'),
      `
  .`
        .concat(
          Et,
          ` {
   overflow: hidden `,
        )
        .concat(
          r,
          `;
   padding-right: `,
        )
        .concat(s, 'px ')
        .concat(
          r,
          `;
  }
  body {
    overflow: hidden `,
        )
        .concat(
          r,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            t && 'position: relative '.concat(r, ';'),
            n === 'margin' &&
              `
    padding-left: `
                .concat(
                  o,
                  `px;
    padding-top: `,
                )
                .concat(
                  c,
                  `px;
    padding-right: `,
                )
                .concat(
                  i,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(s, 'px ')
                .concat(
                  r,
                  `;
    `,
                ),
            n === 'padding' && 'padding-right: '.concat(s, 'px ').concat(r, ';'),
          ]
            .filter(Boolean)
            .join(''),
          `
  }
  
  .`,
        )
        .concat(
          X,
          ` {
    right: `,
        )
        .concat(s, 'px ')
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(
          Y,
          ` {
    margin-right: `,
        )
        .concat(s, 'px ')
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(X, ' .')
        .concat(
          X,
          ` {
    right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(Y, ' .')
        .concat(
          Y,
          ` {
    margin-right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  body {
    `,
        )
        .concat(Ct, ': ')
        .concat(
          s,
          `px;
  }
`,
        )
    );
  },
  Ut = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      r = e.gapMode,
      o = r === void 0 ? 'margin' : r,
      c = a.useMemo(
        function () {
          return Ft(o);
        },
        [o],
      );
    return a.createElement(Wt, { styles: Bt(c, !t, o, n ? '' : '!important') });
  },
  ce = !1;
if (typeof window < 'u')
  try {
    var j = Object.defineProperty({}, 'passive', {
      get: function () {
        return (ce = !0), !0;
      },
    });
    window.addEventListener('test', j, j), window.removeEventListener('test', j, j);
  } catch {
    ce = !1;
  }
var k = ce ? { passive: !1 } : !1,
  jt = function (e) {
    return e.tagName === 'TEXTAREA';
  },
  Re = function (e, t) {
    var n = window.getComputedStyle(e);
    return n[t] !== 'hidden' && !(n.overflowY === n.overflowX && !jt(e) && n[t] === 'visible');
  },
  Kt = function (e) {
    return Re(e, 'overflowY');
  },
  Ht = function (e) {
    return Re(e, 'overflowX');
  },
  $e = function (e, t) {
    var n = t;
    do {
      typeof ShadowRoot < 'u' && n instanceof ShadowRoot && (n = n.host);
      var r = Ne(e, n);
      if (r) {
        var o = Oe(e, n),
          c = o[1],
          i = o[2];
        if (c > i) return !0;
      }
      n = n.parentNode;
    } while (n && n !== document.body);
    return !1;
  },
  zt = function (e) {
    var t = e.scrollTop,
      n = e.scrollHeight,
      r = e.clientHeight;
    return [t, n, r];
  },
  Xt = function (e) {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      r = e.clientWidth;
    return [t, n, r];
  },
  Ne = function (e, t) {
    return e === 'v' ? Kt(t) : Ht(t);
  },
  Oe = function (e, t) {
    return e === 'v' ? zt(t) : Xt(t);
  },
  Yt = function (e, t) {
    return e === 'h' && t === 'rtl' ? -1 : 1;
  },
  Gt = function (e, t, n, r, o) {
    var c = Yt(e, window.getComputedStyle(t).direction),
      i = c * r,
      s = n.target,
      f = t.contains(s),
      d = !1,
      v = i > 0,
      l = 0,
      h = 0;
    do {
      var m = Oe(e, s),
        $ = m[0],
        u = m[1],
        p = m[2],
        g = u - p - c * $;
      ($ || g) && Ne(e, s) && ((l += g), (h += $)), (s = s.parentNode);
    } while ((!f && s !== document.body) || (f && (t.contains(s) || t === s)));
    return (
      ((v && ((o && l === 0) || (!o && i > l))) || (!v && ((o && h === 0) || (!o && -i > h)))) &&
        (d = !0),
      d
    );
  },
  K = function (e) {
    return 'changedTouches' in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  ye = function (e) {
    return [e.deltaX, e.deltaY];
  },
  Ee = function (e) {
    return e && 'current' in e ? e.current : e;
  },
  Vt = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  },
  Zt = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        e,
        ` {pointer-events: all;}
`,
      );
  },
  qt = 0,
  I = [];
function Qt(e) {
  var t = a.useRef([]),
    n = a.useRef([0, 0]),
    r = a.useRef(),
    o = a.useState(qt++)[0],
    c = a.useState(function () {
      return Pe();
    })[0],
    i = a.useRef(e);
  a.useEffect(
    function () {
      i.current = e;
    },
    [e],
  ),
    a.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add('block-interactivity-'.concat(o));
          var u = yt([e.lockRef.current], (e.shards || []).map(Ee), !0).filter(Boolean);
          return (
            u.forEach(function (p) {
              return p.classList.add('allow-interactivity-'.concat(o));
            }),
            function () {
              document.body.classList.remove('block-interactivity-'.concat(o)),
                u.forEach(function (p) {
                  return p.classList.remove('allow-interactivity-'.concat(o));
                });
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    );
  var s = a.useCallback(function (u, p) {
      if ('touches' in u && u.touches.length === 2) return !i.current.allowPinchZoom;
      var g = K(u),
        y = n.current,
        E = 'deltaX' in u ? u.deltaX : y[0] - g[0],
        x = 'deltaY' in u ? u.deltaY : y[1] - g[1],
        C,
        W = u.target,
        R = Math.abs(E) > Math.abs(x) ? 'h' : 'v';
      if ('touches' in u && R === 'h' && W.type === 'range') return !1;
      var b = $e(R, W);
      if (!b) return !0;
      if ((b ? (C = R) : ((C = R === 'v' ? 'h' : 'v'), (b = $e(R, W))), !b)) return !1;
      if ((!r.current && 'changedTouches' in u && (E || x) && (r.current = C), !C)) return !0;
      var _ = r.current || C;
      return Gt(_, p, u, _ === 'h' ? E : x, !0);
    }, []),
    f = a.useCallback(function (u) {
      var p = u;
      if (!(!I.length || I[I.length - 1] !== c)) {
        var g = 'deltaY' in p ? ye(p) : K(p),
          y = t.current.filter(function (C) {
            return C.name === p.type && C.target === p.target && Vt(C.delta, g);
          })[0];
        if (y && y.should) {
          p.cancelable && p.preventDefault();
          return;
        }
        if (!y) {
          var E = (i.current.shards || [])
              .map(Ee)
              .filter(Boolean)
              .filter(function (C) {
                return C.contains(p.target);
              }),
            x = E.length > 0 ? s(p, E[0]) : !i.current.noIsolation;
          x && p.cancelable && p.preventDefault();
        }
      }
    }, []),
    d = a.useCallback(function (u, p, g, y) {
      var E = { name: u, delta: p, target: g, should: y };
      t.current.push(E),
        setTimeout(function () {
          t.current = t.current.filter(function (x) {
            return x !== E;
          });
        }, 1);
    }, []),
    v = a.useCallback(function (u) {
      (n.current = K(u)), (r.current = void 0);
    }, []),
    l = a.useCallback(function (u) {
      d(u.type, ye(u), u.target, s(u, e.lockRef.current));
    }, []),
    h = a.useCallback(function (u) {
      d(u.type, K(u), u.target, s(u, e.lockRef.current));
    }, []);
  a.useEffect(function () {
    return (
      I.push(c),
      e.setCallbacks({ onScrollCapture: l, onWheelCapture: l, onTouchMoveCapture: h }),
      document.addEventListener('wheel', f, k),
      document.addEventListener('touchmove', f, k),
      document.addEventListener('touchstart', v, k),
      function () {
        (I = I.filter(function (u) {
          return u !== c;
        })),
          document.removeEventListener('wheel', f, k),
          document.removeEventListener('touchmove', f, k),
          document.removeEventListener('touchstart', v, k);
      }
    );
  }, []);
  var m = e.removeScrollBar,
    $ = e.inert;
  return a.createElement(
    a.Fragment,
    null,
    $ ? a.createElement(c, { styles: Zt(o) }) : null,
    m ? a.createElement(Ut, { gapMode: 'margin' }) : null,
  );
}
const Jt = Nt(De, Qt);
var _e = a.forwardRef(function (e, t) {
  return a.createElement(V, P({}, e, { ref: t, sideCar: Jt }));
});
_e.classNames = V.classNames;
const en = _e;
var tn = function (e) {
    if (typeof document > 'u') return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  L = new WeakMap(),
  H = new WeakMap(),
  z = {},
  re = 0,
  Te = function (e) {
    return e && (e.host || Te(e.parentNode));
  },
  nn = function (e, t) {
    return t
      .map(function (n) {
        if (e.contains(n)) return n;
        var r = Te(n);
        return r && e.contains(r)
          ? r
          : (console.error('aria-hidden', n, 'in not contained inside', e, '. Doing nothing'),
            null);
      })
      .filter(function (n) {
        return !!n;
      });
  },
  rn = function (e, t, n, r) {
    var o = nn(t, Array.isArray(e) ? e : [e]);
    z[n] || (z[n] = new WeakMap());
    var c = z[n],
      i = [],
      s = new Set(),
      f = new Set(o),
      d = function (l) {
        !l || s.has(l) || (s.add(l), d(l.parentNode));
      };
    o.forEach(d);
    var v = function (l) {
      !l ||
        f.has(l) ||
        Array.prototype.forEach.call(l.children, function (h) {
          if (s.has(h)) v(h);
          else {
            var m = h.getAttribute(r),
              $ = m !== null && m !== 'false',
              u = (L.get(h) || 0) + 1,
              p = (c.get(h) || 0) + 1;
            L.set(h, u),
              c.set(h, p),
              i.push(h),
              u === 1 && $ && H.set(h, !0),
              p === 1 && h.setAttribute(n, 'true'),
              $ || h.setAttribute(r, 'true');
          }
        });
    };
    return (
      v(t),
      s.clear(),
      re++,
      function () {
        i.forEach(function (l) {
          var h = L.get(l) - 1,
            m = c.get(l) - 1;
          L.set(l, h),
            c.set(l, m),
            h || (H.has(l) || l.removeAttribute(r), H.delete(l)),
            m || l.removeAttribute(n);
        }),
          re--,
          re || ((L = new WeakMap()), (L = new WeakMap()), (H = new WeakMap()), (z = {}));
      }
    );
  },
  on = function (e, t, n) {
    n === void 0 && (n = 'data-aria-hidden');
    var r = Array.from(Array.isArray(e) ? e : [e]),
      o = t || tn(e);
    return o
      ? (r.push.apply(r, Array.from(o.querySelectorAll('[aria-live]'))), rn(r, o, n, 'aria-hidden'))
      : function () {
          return null;
        };
  };
const Ae = 'Dialog',
  [ke, Wn] = Ze(Ae),
  [an, D] = ke(Ae),
  cn = e => {
    const {
        __scopeDialog: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: c,
        modal: i = !0,
      } = e,
      s = a.useRef(null),
      f = a.useRef(null),
      [d = !1, v] = et({ prop: r, defaultProp: o, onChange: c });
    return a.createElement(
      an,
      {
        scope: t,
        triggerRef: s,
        contentRef: f,
        contentId: q(),
        titleId: q(),
        descriptionId: q(),
        open: d,
        onOpenChange: v,
        onOpenToggle: a.useCallback(() => v(l => !l), [v]),
        modal: i,
      },
      n,
    );
  },
  sn = 'DialogTrigger',
  un = a.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = D(sn, n),
      c = F(t, o.triggerRef);
    return a.createElement(
      O.button,
      w(
        {
          type: 'button',
          'aria-haspopup': 'dialog',
          'aria-expanded': o.open,
          'aria-controls': o.contentId,
          'data-state': ue(o.open),
        },
        r,
        { ref: c, onClick: N(e.onClick, o.onOpenToggle) },
      ),
    );
  }),
  Ie = 'DialogPortal',
  [ln, Le] = ke(Ie, { forceMount: void 0 }),
  dn = e => {
    const { __scopeDialog: t, forceMount: n, children: r, container: o } = e,
      c = D(Ie, t);
    return a.createElement(
      ln,
      { scope: t, forceMount: n },
      a.Children.map(r, i =>
        a.createElement(
          G,
          { present: n || c.open },
          a.createElement(ht, { asChild: !0, container: o }, i),
        ),
      ),
    );
  },
  se = 'DialogOverlay',
  fn = a.forwardRef((e, t) => {
    const n = Le(se, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      c = D(se, e.__scopeDialog);
    return c.modal
      ? a.createElement(G, { present: r || c.open }, a.createElement(vn, w({}, o, { ref: t })))
      : null;
  }),
  vn = a.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = D(se, n);
    return a.createElement(
      en,
      { as: Xe, allowPinchZoom: !0, shards: [o.contentRef] },
      a.createElement(
        O.div,
        w({ 'data-state': ue(o.open) }, r, {
          ref: t,
          style: { pointerEvents: 'auto', ...r.style },
        }),
      ),
    );
  }),
  B = 'DialogContent',
  mn = a.forwardRef((e, t) => {
    const n = Le(B, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      c = D(B, e.__scopeDialog);
    return a.createElement(
      G,
      { present: r || c.open },
      c.modal
        ? a.createElement(pn, w({}, o, { ref: t }))
        : a.createElement(hn, w({}, o, { ref: t })),
    );
  }),
  pn = a.forwardRef((e, t) => {
    const n = D(B, e.__scopeDialog),
      r = a.useRef(null),
      o = F(t, n.contentRef, r);
    return (
      a.useEffect(() => {
        const c = r.current;
        if (c) return on(c);
      }, []),
      a.createElement(
        Me,
        w({}, e, {
          ref: o,
          trapFocus: n.open,
          disableOutsidePointerEvents: !0,
          onCloseAutoFocus: N(e.onCloseAutoFocus, c => {
            var i;
            c.preventDefault(), (i = n.triggerRef.current) === null || i === void 0 || i.focus();
          }),
          onPointerDownOutside: N(e.onPointerDownOutside, c => {
            const i = c.detail.originalEvent,
              s = i.button === 0 && i.ctrlKey === !0;
            (i.button === 2 || s) && c.preventDefault();
          }),
          onFocusOutside: N(e.onFocusOutside, c => c.preventDefault()),
        }),
      )
    );
  }),
  hn = a.forwardRef((e, t) => {
    const n = D(B, e.__scopeDialog),
      r = a.useRef(!1);
    return a.createElement(
      Me,
      w({}, e, {
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: o => {
          var c;
          if (
            ((c = e.onCloseAutoFocus) === null || c === void 0 || c.call(e, o), !o.defaultPrevented)
          ) {
            var i;
            r.current || (i = n.triggerRef.current) === null || i === void 0 || i.focus(),
              o.preventDefault();
          }
          r.current = !1;
        },
        onInteractOutside: o => {
          var c, i;
          (c = e.onInteractOutside) === null || c === void 0 || c.call(e, o),
            o.defaultPrevented || (r.current = !0);
          const s = o.target;
          ((i = n.triggerRef.current) === null || i === void 0 ? void 0 : i.contains(s)) &&
            o.preventDefault();
        },
      }),
    );
  }),
  Me = a.forwardRef((e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: c, ...i } = e,
      s = D(B, n),
      f = a.useRef(null),
      d = F(t, f);
    return (
      $t(),
      a.createElement(
        a.Fragment,
        null,
        a.createElement(
          ut,
          { asChild: !0, loop: !0, trapped: r, onMountAutoFocus: o, onUnmountAutoFocus: c },
          a.createElement(
            ct,
            w(
              {
                role: 'dialog',
                id: s.contentId,
                'aria-describedby': s.descriptionId,
                'aria-labelledby': s.titleId,
                'data-state': ue(s.open),
              },
              i,
              { ref: d, onDismiss: () => s.onOpenChange(!1) },
            ),
          ),
        ),
        !1,
      )
    );
  }),
  gn = 'DialogTitle',
  bn = a.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = D(gn, n);
    return a.createElement(O.h2, w({ id: o.titleId }, r, { ref: t }));
  }),
  $n = 'DialogDescription',
  yn = a.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = D($n, n);
    return a.createElement(O.p, w({ id: o.descriptionId }, r, { ref: t }));
  }),
  En = 'DialogClose',
  Cn = a.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = D(En, n);
    return a.createElement(
      O.button,
      w({ type: 'button' }, r, { ref: t, onClick: N(e.onClick, () => o.onOpenChange(!1)) }),
    );
  });
function ue(e) {
  return e ? 'open' : 'closed';
}
const xn = cn,
  wn = un,
  Fe = dn,
  We = fn,
  Be = mn,
  Ue = bn,
  je = yn,
  Sn = Cn;
var Dn = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const Pn = e => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  Rn = (e, t) => {
    const n = a.forwardRef(
      ({ color: r = 'currentColor', size: o = 24, strokeWidth: c = 2, children: i, ...s }, f) =>
        a.createElement(
          'svg',
          {
            ref: f,
            ...Dn,
            width: o,
            height: o,
            stroke: r,
            strokeWidth: c,
            className: `lucide lucide-${Pn(e)}`,
            ...s,
          },
          [...t.map(([d, v]) => a.createElement(d, v)), ...((Array.isArray(i) ? i : [i]) || [])],
        ),
    );
    return (n.displayName = `${e}`), n;
  },
  Nn = Rn('X', [
    ['line', { x1: '18', x2: '6', y1: '6', y2: '18', key: '15jfxm' }],
    ['line', { x1: '6', x2: '18', y1: '6', y2: '18', key: 'd1lma3' }],
  ]),
  Bn = xn,
  Un = wn,
  Ke = ({ className: e, children: t, ...n }) =>
    S.jsx(Fe, {
      className: M(e),
      ...n,
      children: S.jsx('div', {
        className: 'fixed inset-0 z-50 flex items-start justify-center sm:items-center',
        children: t,
      }),
    });
Ke.displayName = Fe.displayName;
const He = a.forwardRef(({ className: e, ...t }, n) =>
  S.jsx(We, {
    ref: n,
    className: M(
      'bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-50 backdrop-blur-sm transition-all duration-100',
      e,
    ),
    ...t,
  }),
);
He.displayName = We.displayName;
const On = a.forwardRef(({ className: e, children: t, ...n }, r) =>
  S.jsxs(Ke, {
    children: [
      S.jsx(He, {}),
      S.jsxs(Be, {
        ref: r,
        className: M(
          'bg-background animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 fixed z-50 grid w-full gap-4 rounded-b-lg border p-6 shadow-lg sm:max-w-lg sm:rounded-lg',
          e,
        ),
        ...n,
        children: [
          t,
          S.jsxs(Sn, {
            className:
              'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none',
            children: [
              S.jsx(Nn, { className: 'h-4 w-4' }),
              S.jsx('span', { className: 'sr-only', children: 'Close' }),
            ],
          }),
        ],
      }),
    ],
  }),
);
On.displayName = Be.displayName;
const ie = ({ className: e, ...t }) =>
  S.jsx('div', { className: M('flex flex-col space-y-1.5 text-center sm:text-left', e), ...t });
ie.displayName = 'DialogHeader';
const _n = a.forwardRef(({ className: e, ...t }, n) =>
  S.jsx(Ue, { ref: n, className: M('text-lg font-semibold leading-none tracking-tight', e), ...t }),
);
_n.displayName = Ue.displayName;
const Tn = a.forwardRef(({ className: e, ...t }, n) =>
  S.jsx(je, { ref: n, className: M('text-muted-foreground text-sm', e), ...t }),
);
Tn.displayName = je.displayName;
try {
  (ie.displayName = 'DialogHeader'),
    (ie.__docgenInfo = { description: '', displayName: 'DialogHeader', props: {} });
} catch {}
export {
  en as $,
  Bn as D,
  On as a,
  Ze as b,
  Rn as c,
  G as d,
  N as e,
  A as f,
  oe as g,
  on as h,
  Un as i,
};
//# sourceMappingURL=Dialog-cde66561.js.map
