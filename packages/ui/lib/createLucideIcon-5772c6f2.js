import * as u from 'react';
import { useState as te, forwardRef as ne, createElement as $ } from 'react';
var E = function () {
  return (
    (E =
      Object.assign ||
      function (r) {
        for (var t, n = 1, a = arguments.length; n < a; n++) {
          t = arguments[n];
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
        }
        return r;
      }),
    E.apply(this, arguments)
  );
};
function F(e, r) {
  var t = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && r.indexOf(n) < 0 && (t[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
      r.indexOf(n[a]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
        (t[n[a]] = e[n[a]]);
  return t;
}
function ae(e, r, t) {
  if (t || arguments.length === 2)
    for (var n = 0, a = r.length, o; n < a; n++)
      (o || !(n in r)) && (o || (o = Array.prototype.slice.call(r, 0, n)), (o[n] = r[n]));
  return e.concat(o || Array.prototype.slice.call(r));
}
var T = 'right-scroll-bar-position',
  N = 'width-before-scroll-bar',
  oe = 'with-scroll-bars-hidden',
  ce = '--removed-body-scroll-bar-size';
function ie(e, r) {
  return typeof e == 'function' ? e(r) : e && (e.current = r), e;
}
function ue(e, r) {
  var t = te(function () {
    return {
      // value
      value: e,
      // last callback
      callback: r,
      // "memoized" public interface
      facade: {
        get current() {
          return t.value;
        },
        set current(n) {
          var a = t.value;
          a !== n && ((t.value = n), t.callback(n, a));
        },
      },
    };
  })[0];
  return (t.callback = r), t.facade;
}
function le(e, r) {
  return ue(r || null, function (t) {
    return e.forEach(function (n) {
      return ie(n, t);
    });
  });
}
function fe(e) {
  return e;
}
function se(e, r) {
  r === void 0 && (r = fe);
  var t = [],
    n = !1,
    a = {
      read: function () {
        if (n)
          throw new Error(
            'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.',
          );
        return t.length ? t[t.length - 1] : e;
      },
      useMedium: function (o) {
        var l = r(o, n);
        return (
          t.push(l),
          function () {
            t = t.filter(function (i) {
              return i !== l;
            });
          }
        );
      },
      assignSyncMedium: function (o) {
        for (n = !0; t.length; ) {
          var l = t;
          (t = []), l.forEach(o);
        }
        t = {
          push: function (i) {
            return o(i);
          },
          filter: function () {
            return t;
          },
        };
      },
      assignMedium: function (o) {
        n = !0;
        var l = [];
        if (t.length) {
          var i = t;
          (t = []), i.forEach(o), (l = t);
        }
        var m = function () {
            var v = l;
            (l = []), v.forEach(o);
          },
          h = function () {
            return Promise.resolve().then(m);
          };
        h(),
          (t = {
            push: function (v) {
              l.push(v), h();
            },
            filter: function (v) {
              return (l = l.filter(v)), t;
            },
          });
      },
    };
  return a;
}
function de(e) {
  e === void 0 && (e = {});
  var r = se(null);
  return (r.options = E({ async: !0, ssr: !1 }, e)), r;
}
var Q = function (e) {
  var r = e.sideCar,
    t = F(e, ['sideCar']);
  if (!r) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  var n = r.read();
  if (!n) throw new Error('Sidecar medium not found');
  return u.createElement(n, E({}, t));
};
Q.isSideCarExport = !0;
function ve(e, r) {
  return e.useMedium(r), Q;
}
var G = de(),
  j = function () {},
  I = u.forwardRef(function (e, r) {
    var t = u.useRef(null),
      n = u.useState({
        onScrollCapture: j,
        onWheelCapture: j,
        onTouchMoveCapture: j,
      }),
      a = n[0],
      o = n[1],
      l = e.forwardProps,
      i = e.children,
      m = e.className,
      h = e.removeScrollBar,
      v = e.enabled,
      s = e.shards,
      d = e.sideCar,
      y = e.noIsolation,
      S = e.inert,
      c = e.allowPinchZoom,
      f = e.as,
      p = f === void 0 ? 'div' : f,
      b = F(e, [
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
      w = d,
      C = le([t, r]),
      g = E(E({}, b), a);
    return u.createElement(
      u.Fragment,
      null,
      v &&
        u.createElement(w, {
          sideCar: G,
          removeScrollBar: h,
          shards: s,
          noIsolation: y,
          inert: S,
          setCallbacks: o,
          allowPinchZoom: !!c,
          lockRef: t,
        }),
      l
        ? u.cloneElement(u.Children.only(i), E(E({}, g), { ref: C }))
        : u.createElement(p, E({}, g, { className: m, ref: C }), i),
    );
  });
I.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1,
};
I.classNames = {
  fullWidth: N,
  zeroRight: T,
};
var H,
  he = function () {
    if (H) return H;
    if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
  };
function me() {
  if (!document) return null;
  var e = document.createElement('style');
  e.type = 'text/css';
  var r = he();
  return r && e.setAttribute('nonce', r), e;
}
function ge(e, r) {
  e.styleSheet ? (e.styleSheet.cssText = r) : e.appendChild(document.createTextNode(r));
}
function ye(e) {
  var r = document.head || document.getElementsByTagName('head')[0];
  r.appendChild(e);
}
var pe = function () {
    var e = 0,
      r = null;
    return {
      add: function (t) {
        e == 0 && (r = me()) && (ge(r, t), ye(r)), e++;
      },
      remove: function () {
        e--, !e && r && (r.parentNode && r.parentNode.removeChild(r), (r = null));
      },
    };
  },
  we = function () {
    var e = pe();
    return function (r, t) {
      u.useEffect(
        function () {
          return (
            e.add(r),
            function () {
              e.remove();
            }
          );
        },
        [r && t],
      );
    };
  },
  K = function () {
    var e = we(),
      r = function (t) {
        var n = t.styles,
          a = t.dynamic;
        return e(n, a), null;
      };
    return r;
  },
  Se = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
  },
  D = function (e) {
    return parseInt(e || '', 10) || 0;
  },
  be = function (e) {
    var r = window.getComputedStyle(document.body),
      t = r[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
      n = r[e === 'padding' ? 'paddingTop' : 'marginTop'],
      a = r[e === 'padding' ? 'paddingRight' : 'marginRight'];
    return [D(t), D(n), D(a)];
  },
  Ce = function (e) {
    if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return Se;
    var r = be(e),
      t = document.documentElement.clientWidth,
      n = window.innerWidth;
    return {
      left: r[0],
      top: r[1],
      right: r[2],
      gap: Math.max(0, n - t + r[2] - r[0]),
    };
  },
  Ee = K(),
  ke = function (e, r, t, n) {
    var a = e.left,
      o = e.top,
      l = e.right,
      i = e.gap;
    return (
      t === void 0 && (t = 'margin'),
      `
  .`
        .concat(
          oe,
          ` {
   overflow: hidden `,
        )
        .concat(
          n,
          `;
   padding-right: `,
        )
        .concat(i, 'px ')
        .concat(
          n,
          `;
  }
  body {
    overflow: hidden `,
        )
        .concat(
          n,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            r && 'position: relative '.concat(n, ';'),
            t === 'margin' &&
              `
    padding-left: `
                .concat(
                  a,
                  `px;
    padding-top: `,
                )
                .concat(
                  o,
                  `px;
    padding-right: `,
                )
                .concat(
                  l,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(i, 'px ')
                .concat(
                  n,
                  `;
    `,
                ),
            t === 'padding' && 'padding-right: '.concat(i, 'px ').concat(n, ';'),
          ]
            .filter(Boolean)
            .join(''),
          `
  }
  
  .`,
        )
        .concat(
          T,
          ` {
    right: `,
        )
        .concat(i, 'px ')
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(
          N,
          ` {
    margin-right: `,
        )
        .concat(i, 'px ')
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(T, ' .')
        .concat(
          T,
          ` {
    right: 0 `,
        )
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(N, ' .')
        .concat(
          N,
          ` {
    margin-right: 0 `,
        )
        .concat(
          n,
          `;
  }
  
  body {
    `,
        )
        .concat(ce, ': ')
        .concat(
          i,
          `px;
  }
`,
        )
    );
  },
  Re = function (e) {
    var r = e.noRelative,
      t = e.noImportant,
      n = e.gapMode,
      a = n === void 0 ? 'margin' : n,
      o = u.useMemo(
        function () {
          return Ce(a);
        },
        [a],
      );
    return u.createElement(Ee, { styles: ke(o, !r, a, t ? '' : '!important') });
  },
  Y = !1;
if (typeof window < 'u')
  try {
    var B = Object.defineProperty({}, 'passive', {
      get: function () {
        return (Y = !0), !0;
      },
    });
    window.addEventListener('test', B, B), window.removeEventListener('test', B, B);
  } catch {
    Y = !1;
  }
var k = Y ? { passive: !1 } : !1,
  Ae = function (e) {
    return e.tagName === 'TEXTAREA';
  },
  q = function (e, r) {
    var t = window.getComputedStyle(e);
    return (
      // not-not-scrollable
      t[r] !== 'hidden' && // contains scroll inside self
      !(t.overflowY === t.overflowX && !Ae(e) && t[r] === 'visible')
    );
  },
  Pe = function (e) {
    return q(e, 'overflowY');
  },
  xe = function (e) {
    return q(e, 'overflowX');
  },
  V = function (e, r) {
    var t = r;
    do {
      typeof ShadowRoot < 'u' && t instanceof ShadowRoot && (t = t.host);
      var n = J(e, t);
      if (n) {
        var a = U(e, t),
          o = a[1],
          l = a[2];
        if (o > l) return !0;
      }
      t = t.parentNode;
    } while (t && t !== document.body);
    return !1;
  },
  Be = function (e) {
    var r = e.scrollTop,
      t = e.scrollHeight,
      n = e.clientHeight;
    return [r, t, n];
  },
  Le = function (e) {
    var r = e.scrollLeft,
      t = e.scrollWidth,
      n = e.clientWidth;
    return [r, t, n];
  },
  J = function (e, r) {
    return e === 'v' ? Pe(r) : xe(r);
  },
  U = function (e, r) {
    return e === 'v' ? Be(r) : Le(r);
  },
  Me = function (e, r) {
    return e === 'h' && r === 'rtl' ? -1 : 1;
  },
  We = function (e, r, t, n, a) {
    var o = Me(e, window.getComputedStyle(r).direction),
      l = o * n,
      i = t.target,
      m = r.contains(i),
      h = !1,
      v = l > 0,
      s = 0,
      d = 0;
    do {
      var y = U(e, i),
        S = y[0],
        c = y[1],
        f = y[2],
        p = c - f - o * S;
      (S || p) && J(e, i) && ((s += p), (d += S)), (i = i.parentNode);
    } while (
      // portaled content
      (!m && i !== document.body) || // self content
      (m && (r.contains(i) || r === i))
    );
    return (
      ((v && ((a && s === 0) || (!a && l > s))) || (!v && ((a && d === 0) || (!a && -l > d)))) &&
        (h = !0),
      h
    );
  },
  L = function (e) {
    return 'changedTouches' in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  Z = function (e) {
    return [e.deltaX, e.deltaY];
  },
  z = function (e) {
    return e && 'current' in e ? e.current : e;
  },
  Te = function (e, r) {
    return e[0] === r[0] && e[1] === r[1];
  },
  Ne = function (e) {
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
  Ie = 0,
  R = [];
function Oe(e) {
  var r = u.useRef([]),
    t = u.useRef([0, 0]),
    n = u.useRef(),
    a = u.useState(Ie++)[0],
    o = u.useState(function () {
      return K();
    })[0],
    l = u.useRef(e);
  u.useEffect(
    function () {
      l.current = e;
    },
    [e],
  ),
    u.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add('block-interactivity-'.concat(a));
          var c = ae([e.lockRef.current], (e.shards || []).map(z), !0).filter(Boolean);
          return (
            c.forEach(function (f) {
              return f.classList.add('allow-interactivity-'.concat(a));
            }),
            function () {
              document.body.classList.remove('block-interactivity-'.concat(a)),
                c.forEach(function (f) {
                  return f.classList.remove('allow-interactivity-'.concat(a));
                });
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    );
  var i = u.useCallback(function (c, f) {
      if ('touches' in c && c.touches.length === 2) return !l.current.allowPinchZoom;
      var p = L(c),
        b = t.current,
        w = 'deltaX' in c ? c.deltaX : b[0] - p[0],
        C = 'deltaY' in c ? c.deltaY : b[1] - p[1],
        g,
        O = c.target,
        P = Math.abs(w) > Math.abs(C) ? 'h' : 'v';
      if ('touches' in c && P === 'h' && O.type === 'range') return !1;
      var x = V(P, O);
      if (!x) return !0;
      if ((x ? (g = P) : ((g = P === 'v' ? 'h' : 'v'), (x = V(P, O))), !x)) return !1;
      if ((!n.current && 'changedTouches' in c && (w || C) && (n.current = g), !g)) return !0;
      var _ = n.current || g;
      return We(_, f, c, _ === 'h' ? w : C, !0);
    }, []),
    m = u.useCallback(function (c) {
      var f = c;
      if (!(!R.length || R[R.length - 1] !== o)) {
        var p = 'deltaY' in f ? Z(f) : L(f),
          b = r.current.filter(function (g) {
            return g.name === f.type && g.target === f.target && Te(g.delta, p);
          })[0];
        if (b && b.should) {
          f.cancelable && f.preventDefault();
          return;
        }
        if (!b) {
          var w = (l.current.shards || [])
              .map(z)
              .filter(Boolean)
              .filter(function (g) {
                return g.contains(f.target);
              }),
            C = w.length > 0 ? i(f, w[0]) : !l.current.noIsolation;
          C && f.cancelable && f.preventDefault();
        }
      }
    }, []),
    h = u.useCallback(function (c, f, p, b) {
      var w = { name: c, delta: f, target: p, should: b };
      r.current.push(w),
        setTimeout(function () {
          r.current = r.current.filter(function (C) {
            return C !== w;
          });
        }, 1);
    }, []),
    v = u.useCallback(function (c) {
      (t.current = L(c)), (n.current = void 0);
    }, []),
    s = u.useCallback(function (c) {
      h(c.type, Z(c), c.target, i(c, e.lockRef.current));
    }, []),
    d = u.useCallback(function (c) {
      h(c.type, L(c), c.target, i(c, e.lockRef.current));
    }, []);
  u.useEffect(function () {
    return (
      R.push(o),
      e.setCallbacks({
        onScrollCapture: s,
        onWheelCapture: s,
        onTouchMoveCapture: d,
      }),
      document.addEventListener('wheel', m, k),
      document.addEventListener('touchmove', m, k),
      document.addEventListener('touchstart', v, k),
      function () {
        (R = R.filter(function (c) {
          return c !== o;
        })),
          document.removeEventListener('wheel', m, k),
          document.removeEventListener('touchmove', m, k),
          document.removeEventListener('touchstart', v, k);
      }
    );
  }, []);
  var y = e.removeScrollBar,
    S = e.inert;
  return u.createElement(
    u.Fragment,
    null,
    S ? u.createElement(o, { styles: Ne(a) }) : null,
    y ? u.createElement(Re, { gapMode: 'margin' }) : null,
  );
}
const je = ve(G, Oe);
var ee = u.forwardRef(function (e, r) {
  return u.createElement(I, E({}, e, { ref: r, sideCar: je }));
});
ee.classNames = I.classNames;
const Ve = ee;
var De = function (e) {
    if (typeof document > 'u') return null;
    var r = Array.isArray(e) ? e[0] : e;
    return r.ownerDocument.body;
  },
  A = /* @__PURE__ */ new WeakMap(),
  M = /* @__PURE__ */ new WeakMap(),
  W = {},
  X = 0,
  re = function (e) {
    return e && (e.host || re(e.parentNode));
  },
  Xe = function (e, r) {
    return r
      .map(function (t) {
        if (e.contains(t)) return t;
        var n = re(t);
        return n && e.contains(n)
          ? n
          : (console.error('aria-hidden', t, 'in not contained inside', e, '. Doing nothing'),
            null);
      })
      .filter(function (t) {
        return !!t;
      });
  },
  Ye = function (e, r, t, n) {
    var a = Xe(r, Array.isArray(e) ? e : [e]);
    W[t] || (W[t] = /* @__PURE__ */ new WeakMap());
    var o = W[t],
      l = [],
      i = /* @__PURE__ */ new Set(),
      m = new Set(a),
      h = function (s) {
        !s || i.has(s) || (i.add(s), h(s.parentNode));
      };
    a.forEach(h);
    var v = function (s) {
      !s ||
        m.has(s) ||
        Array.prototype.forEach.call(s.children, function (d) {
          if (i.has(d)) v(d);
          else {
            var y = d.getAttribute(n),
              S = y !== null && y !== 'false',
              c = (A.get(d) || 0) + 1,
              f = (o.get(d) || 0) + 1;
            A.set(d, c),
              o.set(d, f),
              l.push(d),
              c === 1 && S && M.set(d, !0),
              f === 1 && d.setAttribute(t, 'true'),
              S || d.setAttribute(n, 'true');
          }
        });
    };
    return (
      v(r),
      i.clear(),
      X++,
      function () {
        l.forEach(function (s) {
          var d = A.get(s) - 1,
            y = o.get(s) - 1;
          A.set(s, d),
            o.set(s, y),
            d || (M.has(s) || s.removeAttribute(n), M.delete(s)),
            y || s.removeAttribute(t);
        }),
          X--,
          X ||
            ((A = /* @__PURE__ */ new WeakMap()),
            (A = /* @__PURE__ */ new WeakMap()),
            (M = /* @__PURE__ */ new WeakMap()),
            (W = {}));
      }
    );
  },
  Ze = function (e, r, t) {
    t === void 0 && (t = 'data-aria-hidden');
    var n = Array.from(Array.isArray(e) ? e : [e]),
      a = r || De(e);
    return a
      ? (n.push.apply(n, Array.from(a.querySelectorAll('[aria-live]'))), Ye(n, a, t, 'aria-hidden'))
      : function () {
          return null;
        };
  },
  _e = {
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
const $e = e => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  ze = (e, r) => {
    const t = ne(
      ({ color: n = 'currentColor', size: a = 24, strokeWidth: o = 2, children: l, ...i }, m) =>
        $(
          'svg',
          {
            ref: m,
            ..._e,
            width: a,
            height: a,
            stroke: n,
            strokeWidth: o,
            className: `lucide lucide-${$e(e)}`,
            ...i,
          },
          [...r.map(([h, v]) => $(h, v)), ...((Array.isArray(l) ? l : [l]) || [])],
        ),
    );
    return (t.displayName = `${e}`), t;
  };
export { Ve as $, ze as c, Ze as h };
