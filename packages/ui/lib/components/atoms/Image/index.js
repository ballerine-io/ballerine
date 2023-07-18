import { jsx as d, jsxs as g } from 'react/jsx-runtime';
import {
  useState as b,
  createContext as O,
  Component as S,
  isValidElement as w,
  createElement as h,
  forwardRef as E,
  Suspense as P,
} from 'react';
import { a as j } from '../../../ctw-6a823672.js';
import { Skeleton as x } from '../Skeleton/index.js';
import { c as B } from '../../../createLucideIcon-6839730e.js';
const C = B('Image', [
  [
    'rect',
    {
      width: '18',
      height: '18',
      x: '3',
      y: '3',
      rx: '2',
      ry: '2',
      key: '1m3agn',
    },
  ],
  ['circle', { cx: '9', cy: '9', r: '2', key: 'af1f0g' }],
  ['path', { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21', key: '1xmnt7' }],
]);
function f(t) {
  '@babel/helpers - typeof';
  return (
    (f =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol == 'function' &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e;
          }),
    f(t)
  );
}
function k(t, e) {
  if (f(t) !== 'object' || t === null) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e || 'default');
    if (f(n) !== 'object') return n;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (e === 'string' ? String : Number)(t);
}
function N(t) {
  var e = k(t, 'string');
  return f(e) === 'symbol' ? e : String(e);
}
function A(t, e, r) {
  return (
    (e = N(e)),
    e in t
      ? Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = r),
    t
  );
}
var I = function (t) {
  var e = t.decode,
    r = e === void 0 ? !0 : e,
    n = t.crossOrigin,
    o = n === void 0 ? '' : n;
  return function (i) {
    return new Promise(function (a, c) {
      var s = new Image();
      o && (s.crossOrigin = o),
        (s.onload = function () {
          r && s.decode ? s.decode().then(a).catch(c) : a();
        }),
        (s.onerror = c),
        (s.src = i);
    });
  };
};
function v(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e &&
      (n = n.filter(function (o) {
        return Object.getOwnPropertyDescriptor(t, o).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function m(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? v(Object(r), !0).forEach(function (n) {
          A(t, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
      : v(Object(r)).forEach(function (n) {
          Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return t;
}
var L = function (e) {
    return e.filter(function (r) {
      return r;
    });
  },
  D = function (e) {
    return Array.isArray(e) ? e : [e];
  },
  l = {},
  F = function (e, r) {
    var n = !1;
    return new Promise(function (o, i) {
      var a = function (s) {
        return r(s).then(function () {
          (n = !0), o(s);
        });
      };
      e.reduce(function (c, s) {
        return c.catch(function () {
          if (!n) return a(s);
        });
      }, a(e.shift())).catch(i);
    });
  };
function K(t) {
  var e = t.srcList,
    r = t.imgPromise,
    n =
      r === void 0
        ? I({
            decode: !0,
          })
        : r,
    o = t.useSuspense,
    i = o === void 0 ? !0 : o,
    a = b(!1),
    c = a[1],
    s = L(D(e)),
    u = s.join('');
  if (
    (l[u] ||
      (l[u] = {
        promise: F(s, n),
        cache: 'pending',
        error: null,
      }),
    l[u].cache === 'resolved')
  )
    return {
      src: l[u].src,
      isLoading: !1,
      error: null,
    };
  if (l[u].cache === 'rejected') {
    if (i) throw l[u].error;
    return {
      isLoading: !1,
      error: l[u].error,
      src: void 0,
    };
  }
  if (
    (l[u].promise
      .then(function (p) {
        (l[u] = m(
          m({}, l[u]),
          {},
          {
            cache: 'resolved',
            src: p,
          },
        )),
          i || c(u);
      })
      .catch(function (p) {
        (l[u] = m(
          m({}, l[u]),
          {},
          {
            cache: 'rejected',
            error: p,
          },
        )),
          i || c(u);
      }),
    i)
  )
    throw l[u].promise;
  return {
    isLoading: !0,
    src: void 0,
    error: null,
  };
}
const T = O(null),
  y = {
    didCatch: !1,
    error: null,
  };
class q extends S {
  constructor(e) {
    super(e), (this.resetErrorBoundary = this.resetErrorBoundary.bind(this)), (this.state = y);
  }
  static getDerivedStateFromError(e) {
    return {
      didCatch: !0,
      error: e,
    };
  }
  resetErrorBoundary() {
    const { error: e } = this.state;
    if (e !== null) {
      for (var r, n, o = arguments.length, i = new Array(o), a = 0; a < o; a++) i[a] = arguments[a];
      (r = (n = this.props).onReset) === null ||
        r === void 0 ||
        r.call(n, {
          args: i,
          reason: 'imperative-api',
        }),
        this.setState(y);
    }
  }
  componentDidCatch(e, r) {
    var n, o;
    (n = (o = this.props).onError) === null || n === void 0 || n.call(o, e, r);
  }
  componentDidUpdate(e, r) {
    const { didCatch: n } = this.state,
      { resetKeys: o } = this.props;
    if (n && r.error !== null && R(e.resetKeys, o)) {
      var i, a;
      (i = (a = this.props).onReset) === null ||
        i === void 0 ||
        i.call(a, {
          next: o,
          prev: e.resetKeys,
          reason: 'keys',
        }),
        this.setState(y);
    }
  }
  render() {
    const { children: e, fallbackRender: r, FallbackComponent: n, fallback: o } = this.props,
      { didCatch: i, error: a } = this.state;
    let c = e;
    if (i) {
      const s = {
        error: a,
        resetErrorBoundary: this.resetErrorBoundary,
      };
      if (w(o)) c = o;
      else if (typeof r == 'function') c = r(s);
      else if (n) c = h(n, s);
      else
        throw new Error(
          'react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop',
        );
    }
    return h(
      T.Provider,
      {
        value: {
          didCatch: i,
          error: a,
          resetErrorBoundary: this.resetErrorBoundary,
        },
      },
      c,
    );
  }
}
function R() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return t.length !== e.length || t.some((r, n) => !Object.is(r, e[n]));
}
const U = E(({ className: t, alt: e, width: r, height: n, src: o, useImageProps: i, ...a }, c) => {
  const { src: s } = K({
    ...i,
    srcList: o,
  });
  return /* @__PURE__ */ d(q, {
    fallback: /* @__PURE__ */ g('figure', {
      className:
        'border-destructive flex flex-col items-center justify-center space-y-2 rounded-md border p-1',
      style: { width: r, height: n },
      'aria-live': 'polite',
      children: [
        /* @__PURE__ */ d(C, {
          className: 'stroke-destructive h-[calc(1rem+15%)] w-[calc(1rem+15%)]',
        }),
        /* @__PURE__ */ d('figcaption', {
          className: 'text-destructive',
          children: 'An error occurred while loading the image',
        }),
      ],
    }),
    children: /* @__PURE__ */ d(P, {
      fallback: /* @__PURE__ */ g('figure', {
        'aria-live': 'polite',
        style: { width: r, height: n },
        children: [
          /* @__PURE__ */ d(x, { className: 'h-full w-full' }),
          /* @__PURE__ */ d('figcaption', { className: 'sr-only', children: 'Loading image...' }),
        ],
      }),
      children: /* @__PURE__ */ d('img', {
        alt: e,
        src: s,
        width: r,
        height: n,
        className: j('rounded-md object-contain', t),
        ...a,
        ref: c,
      }),
    }),
  });
});
U.displayName = 'Image';
export { U as Image };
