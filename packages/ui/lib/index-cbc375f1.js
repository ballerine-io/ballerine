import * as i from 'react';
import { useState as re } from 'react';
var E = function () {
  return (
    (E =
      Object.assign ||
      function (r) {
        for (var t, n = 1, a = arguments.length; n < a; n++) {
          t = arguments[n];
          for (var c in t) Object.prototype.hasOwnProperty.call(t, c) && (r[c] = t[c]);
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
function te(e, r, t) {
  if (t || arguments.length === 2)
    for (var n = 0, a = r.length, c; n < a; n++)
      (c || !(n in r)) && (c || (c = Array.prototype.slice.call(r, 0, n)), (c[n] = r[n]));
  return e.concat(c || Array.prototype.slice.call(r));
}
var L = 'right-scroll-bar-position',
  N = 'width-before-scroll-bar',
  ne = 'with-scroll-bars-hidden',
  ae = '--removed-body-scroll-bar-size';
function oe(e, r) {
  return typeof e == 'function' ? e(r) : e && (e.current = r), e;
}
function ce(e, r) {
  var t = re(function () {
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
function ie(e, r) {
  return ce(r || null, function (t) {
    return e.forEach(function (n) {
      return oe(n, t);
    });
  });
}
function ue(e) {
  return e;
}
function le(e, r) {
  r === void 0 && (r = ue);
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
      useMedium: function (c) {
        var l = r(c, n);
        return (
          t.push(l),
          function () {
            t = t.filter(function (u) {
              return u !== l;
            });
          }
        );
      },
      assignSyncMedium: function (c) {
        for (n = !0; t.length; ) {
          var l = t;
          (t = []), l.forEach(c);
        }
        t = {
          push: function (u) {
            return c(u);
          },
          filter: function () {
            return t;
          },
        };
      },
      assignMedium: function (c) {
        n = !0;
        var l = [];
        if (t.length) {
          var u = t;
          (t = []), u.forEach(c), (l = t);
        }
        var g = function () {
            var v = l;
            (l = []), v.forEach(c);
          },
          h = function () {
            return Promise.resolve().then(g);
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
function fe(e) {
  e === void 0 && (e = {});
  var r = le(null);
  return (r.options = E({ async: !0, ssr: !1 }, e)), r;
}
var $ = function (e) {
  var r = e.sideCar,
    t = F(e, ['sideCar']);
  if (!r) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  var n = r.read();
  if (!n) throw new Error('Sidecar medium not found');
  return i.createElement(n, E({}, t));
};
$.isSideCarExport = !0;
function se(e, r) {
  return e.useMedium(r), $;
}
var Q = fe(),
  D = function () {},
  I = i.forwardRef(function (e, r) {
    var t = i.useRef(null),
      n = i.useState({
        onScrollCapture: D,
        onWheelCapture: D,
        onTouchMoveCapture: D,
      }),
      a = n[0],
      c = n[1],
      l = e.forwardProps,
      u = e.children,
      g = e.className,
      h = e.removeScrollBar,
      v = e.enabled,
      s = e.shards,
      d = e.sideCar,
      y = e.noIsolation,
      b = e.inert,
      o = e.allowPinchZoom,
      f = e.as,
      p = f === void 0 ? 'div' : f,
      w = F(e, [
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
      S = d,
      C = ie([t, r]),
      m = E(E({}, w), a);
    return i.createElement(
      i.Fragment,
      null,
      v &&
        i.createElement(S, {
          sideCar: Q,
          removeScrollBar: h,
          shards: s,
          noIsolation: y,
          inert: b,
          setCallbacks: c,
          allowPinchZoom: !!o,
          lockRef: t,
        }),
      l
        ? i.cloneElement(i.Children.only(u), E(E({}, m), { ref: C }))
        : i.createElement(p, E({}, m, { className: g, ref: C }), u),
    );
  });
I.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1,
};
I.classNames = {
  fullWidth: N,
  zeroRight: L,
};
var H,
  de = function () {
    if (H) return H;
    if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
  };
function ve() {
  if (!document) return null;
  var e = document.createElement('style');
  e.type = 'text/css';
  var r = de();
  return r && e.setAttribute('nonce', r), e;
}
function he(e, r) {
  e.styleSheet ? (e.styleSheet.cssText = r) : e.appendChild(document.createTextNode(r));
}
function me(e) {
  var r = document.head || document.getElementsByTagName('head')[0];
  r.appendChild(e);
}
var ge = function () {
    var e = 0,
      r = null;
    return {
      add: function (t) {
        e == 0 && (r = ve()) && (he(r, t), me(r)), e++;
      },
      remove: function () {
        e--, !e && r && (r.parentNode && r.parentNode.removeChild(r), (r = null));
      },
    };
  },
  ye = function () {
    var e = ge();
    return function (r, t) {
      i.useEffect(
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
  G = function () {
    var e = ye(),
      r = function (t) {
        var n = t.styles,
          a = t.dynamic;
        return e(n, a), null;
      };
    return r;
  },
  pe = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
  },
  X = function (e) {
    return parseInt(e || '', 10) || 0;
  },
  Se = function (e) {
    var r = window.getComputedStyle(document.body),
      t = r[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
      n = r[e === 'padding' ? 'paddingTop' : 'marginTop'],
      a = r[e === 'padding' ? 'paddingRight' : 'marginRight'];
    return [X(t), X(n), X(a)];
  },
  be = function (e) {
    if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return pe;
    var r = Se(e),
      t = document.documentElement.clientWidth,
      n = window.innerWidth;
    return {
      left: r[0],
      top: r[1],
      right: r[2],
      gap: Math.max(0, n - t + r[2] - r[0]),
    };
  },
  we = G(),
  Ce = function (e, r, t, n) {
    var a = e.left,
      c = e.top,
      l = e.right,
      u = e.gap;
    return (
      t === void 0 && (t = 'margin'),
      `
  .`
        .concat(
          ne,
          ` {
   overflow: hidden `,
        )
        .concat(
          n,
          `;
   padding-right: `,
        )
        .concat(u, 'px ')
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
                  c,
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
                .concat(u, 'px ')
                .concat(
                  n,
                  `;
    `,
                ),
            t === 'padding' && 'padding-right: '.concat(u, 'px ').concat(n, ';'),
          ]
            .filter(Boolean)
            .join(''),
          `
  }
  
  .`,
        )
        .concat(
          L,
          ` {
    right: `,
        )
        .concat(u, 'px ')
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
        .concat(u, 'px ')
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(L, ' .')
        .concat(
          L,
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
        .concat(ae, ': ')
        .concat(
          u,
          `px;
  }
`,
        )
    );
  },
  Ee = function (e) {
    var r = e.noRelative,
      t = e.noImportant,
      n = e.gapMode,
      a = n === void 0 ? 'margin' : n,
      c = i.useMemo(
        function () {
          return be(a);
        },
        [a],
      );
    return i.createElement(we, { styles: Ce(c, !r, a, t ? '' : '!important') });
  },
  j = !1;
if (typeof window < 'u')
  try {
    var B = Object.defineProperty({}, 'passive', {
      get: function () {
        return (j = !0), !0;
      },
    });
    window.addEventListener('test', B, B), window.removeEventListener('test', B, B);
  } catch {
    j = !1;
  }
var R = j ? { passive: !1 } : !1,
  Re = function (e) {
    return e.tagName === 'TEXTAREA';
  },
  q = function (e, r) {
    var t = window.getComputedStyle(e);
    return (
      // not-not-scrollable
      t[r] !== 'hidden' && // contains scroll inside self
      !(t.overflowY === t.overflowX && !Re(e) && t[r] === 'visible')
    );
  },
  ke = function (e) {
    return q(e, 'overflowY');
  },
  Ae = function (e) {
    return q(e, 'overflowX');
  },
  V = function (e, r) {
    var t = r;
    do {
      typeof ShadowRoot < 'u' && t instanceof ShadowRoot && (t = t.host);
      var n = K(e, t);
      if (n) {
        var a = J(e, t),
          c = a[1],
          l = a[2];
        if (c > l) return !0;
      }
      t = t.parentNode;
    } while (t && t !== document.body);
    return !1;
  },
  Pe = function (e) {
    var r = e.scrollTop,
      t = e.scrollHeight,
      n = e.clientHeight;
    return [r, t, n];
  },
  Me = function (e) {
    var r = e.scrollLeft,
      t = e.scrollWidth,
      n = e.clientWidth;
    return [r, t, n];
  },
  K = function (e, r) {
    return e === 'v' ? ke(r) : Ae(r);
  },
  J = function (e, r) {
    return e === 'v' ? Pe(r) : Me(r);
  },
  Be = function (e, r) {
    return e === 'h' && r === 'rtl' ? -1 : 1;
  },
  We = function (e, r, t, n, a) {
    var c = Be(e, window.getComputedStyle(r).direction),
      l = c * n,
      u = t.target,
      g = r.contains(u),
      h = !1,
      v = l > 0,
      s = 0,
      d = 0;
    do {
      var y = J(e, u),
        b = y[0],
        o = y[1],
        f = y[2],
        p = o - f - c * b;
      (b || p) && K(e, u) && ((s += p), (d += b)), (u = u.parentNode);
    } while (
      // portaled content
      (!g && u !== document.body) || // self content
      (g && (r.contains(u) || r === u))
    );
    return (
      ((v && ((a && s === 0) || (!a && l > s))) || (!v && ((a && d === 0) || (!a && -l > d)))) &&
        (h = !0),
      h
    );
  },
  W = function (e) {
    return 'changedTouches' in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  z = function (e) {
    return [e.deltaX, e.deltaY];
  },
  Z = function (e) {
    return e && 'current' in e ? e.current : e;
  },
  xe = function (e, r) {
    return e[0] === r[0] && e[1] === r[1];
  },
  Te = function (e) {
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
  Le = 0,
  k = [];
function Ne(e) {
  var r = i.useRef([]),
    t = i.useRef([0, 0]),
    n = i.useRef(),
    a = i.useState(Le++)[0],
    c = i.useState(function () {
      return G();
    })[0],
    l = i.useRef(e);
  i.useEffect(
    function () {
      l.current = e;
    },
    [e],
  ),
    i.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add('block-interactivity-'.concat(a));
          var o = te([e.lockRef.current], (e.shards || []).map(Z), !0).filter(Boolean);
          return (
            o.forEach(function (f) {
              return f.classList.add('allow-interactivity-'.concat(a));
            }),
            function () {
              document.body.classList.remove('block-interactivity-'.concat(a)),
                o.forEach(function (f) {
                  return f.classList.remove('allow-interactivity-'.concat(a));
                });
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    );
  var u = i.useCallback(function (o, f) {
      if ('touches' in o && o.touches.length === 2) return !l.current.allowPinchZoom;
      var p = W(o),
        w = t.current,
        S = 'deltaX' in o ? o.deltaX : w[0] - p[0],
        C = 'deltaY' in o ? o.deltaY : w[1] - p[1],
        m,
        O = o.target,
        P = Math.abs(S) > Math.abs(C) ? 'h' : 'v';
      if ('touches' in o && P === 'h' && O.type === 'range') return !1;
      var M = V(P, O);
      if (!M) return !0;
      if ((M ? (m = P) : ((m = P === 'v' ? 'h' : 'v'), (M = V(P, O))), !M)) return !1;
      if ((!n.current && 'changedTouches' in o && (S || C) && (n.current = m), !m)) return !0;
      var _ = n.current || m;
      return We(_, f, o, _ === 'h' ? S : C, !0);
    }, []),
    g = i.useCallback(function (o) {
      var f = o;
      if (!(!k.length || k[k.length - 1] !== c)) {
        var p = 'deltaY' in f ? z(f) : W(f),
          w = r.current.filter(function (m) {
            return m.name === f.type && m.target === f.target && xe(m.delta, p);
          })[0];
        if (w && w.should) {
          f.cancelable && f.preventDefault();
          return;
        }
        if (!w) {
          var S = (l.current.shards || [])
              .map(Z)
              .filter(Boolean)
              .filter(function (m) {
                return m.contains(f.target);
              }),
            C = S.length > 0 ? u(f, S[0]) : !l.current.noIsolation;
          C && f.cancelable && f.preventDefault();
        }
      }
    }, []),
    h = i.useCallback(function (o, f, p, w) {
      var S = { name: o, delta: f, target: p, should: w };
      r.current.push(S),
        setTimeout(function () {
          r.current = r.current.filter(function (C) {
            return C !== S;
          });
        }, 1);
    }, []),
    v = i.useCallback(function (o) {
      (t.current = W(o)), (n.current = void 0);
    }, []),
    s = i.useCallback(function (o) {
      h(o.type, z(o), o.target, u(o, e.lockRef.current));
    }, []),
    d = i.useCallback(function (o) {
      h(o.type, W(o), o.target, u(o, e.lockRef.current));
    }, []);
  i.useEffect(function () {
    return (
      k.push(c),
      e.setCallbacks({
        onScrollCapture: s,
        onWheelCapture: s,
        onTouchMoveCapture: d,
      }),
      document.addEventListener('wheel', g, R),
      document.addEventListener('touchmove', g, R),
      document.addEventListener('touchstart', v, R),
      function () {
        (k = k.filter(function (o) {
          return o !== c;
        })),
          document.removeEventListener('wheel', g, R),
          document.removeEventListener('touchmove', g, R),
          document.removeEventListener('touchstart', v, R);
      }
    );
  }, []);
  var y = e.removeScrollBar,
    b = e.inert;
  return i.createElement(
    i.Fragment,
    null,
    b ? i.createElement(c, { styles: Te(a) }) : null,
    y ? i.createElement(Ee, { gapMode: 'margin' }) : null,
  );
}
const Ie = se(Q, Ne);
var U = i.forwardRef(function (e, r) {
  return i.createElement(I, E({}, e, { ref: r, sideCar: Ie }));
});
U.classNames = I.classNames;
const je = U;
var Oe = function (e) {
    if (typeof document > 'u') return null;
    var r = Array.isArray(e) ? e[0] : e;
    return r.ownerDocument.body;
  },
  A = /* @__PURE__ */ new WeakMap(),
  x = /* @__PURE__ */ new WeakMap(),
  T = {},
  Y = 0,
  ee = function (e) {
    return e && (e.host || ee(e.parentNode));
  },
  De = function (e, r) {
    return r
      .map(function (t) {
        if (e.contains(t)) return t;
        var n = ee(t);
        return n && e.contains(n)
          ? n
          : (console.error('aria-hidden', t, 'in not contained inside', e, '. Doing nothing'),
            null);
      })
      .filter(function (t) {
        return !!t;
      });
  },
  Xe = function (e, r, t, n) {
    var a = De(r, Array.isArray(e) ? e : [e]);
    T[t] || (T[t] = /* @__PURE__ */ new WeakMap());
    var c = T[t],
      l = [],
      u = /* @__PURE__ */ new Set(),
      g = new Set(a),
      h = function (s) {
        !s || u.has(s) || (u.add(s), h(s.parentNode));
      };
    a.forEach(h);
    var v = function (s) {
      !s ||
        g.has(s) ||
        Array.prototype.forEach.call(s.children, function (d) {
          if (u.has(d)) v(d);
          else {
            var y = d.getAttribute(n),
              b = y !== null && y !== 'false',
              o = (A.get(d) || 0) + 1,
              f = (c.get(d) || 0) + 1;
            A.set(d, o),
              c.set(d, f),
              l.push(d),
              o === 1 && b && x.set(d, !0),
              f === 1 && d.setAttribute(t, 'true'),
              b || d.setAttribute(n, 'true');
          }
        });
    };
    return (
      v(r),
      u.clear(),
      Y++,
      function () {
        l.forEach(function (s) {
          var d = A.get(s) - 1,
            y = c.get(s) - 1;
          A.set(s, d),
            c.set(s, y),
            d || (x.has(s) || s.removeAttribute(n), x.delete(s)),
            y || s.removeAttribute(t);
        }),
          Y--,
          Y ||
            ((A = /* @__PURE__ */ new WeakMap()),
            (A = /* @__PURE__ */ new WeakMap()),
            (x = /* @__PURE__ */ new WeakMap()),
            (T = {}));
      }
    );
  },
  _e = function (e, r, t) {
    t === void 0 && (t = 'data-aria-hidden');
    var n = Array.from(Array.isArray(e) ? e : [e]),
      a = r || Oe(e);
    return a
      ? (n.push.apply(n, Array.from(a.querySelectorAll('[aria-live]'))), Xe(n, a, t, 'aria-hidden'))
      : function () {
          return null;
        };
  };
export { je as $, _e as h };
