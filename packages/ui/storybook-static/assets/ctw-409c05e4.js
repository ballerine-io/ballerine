import { r as cr } from './index-8db94870.js';
var er = { exports: {} },
  O = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var dr = cr,
  ur = Symbol.for('react.element'),
  pr = Symbol.for('react.fragment'),
  fr = Object.prototype.hasOwnProperty,
  br = dr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  gr = { key: !0, ref: !0, __self: !0, __source: !0 };
function tr(r, e, o) {
  var t,
    n = {},
    i = null,
    a = null;
  o !== void 0 && (i = '' + o),
    e.key !== void 0 && (i = '' + e.key),
    e.ref !== void 0 && (a = e.ref);
  for (t in e) fr.call(e, t) && !gr.hasOwnProperty(t) && (n[t] = e[t]);
  if (r && r.defaultProps) for (t in ((e = r.defaultProps), e)) n[t] === void 0 && (n[t] = e[t]);
  return { $$typeof: ur, type: r, key: i, ref: a, props: n, _owner: br.current };
}
O.Fragment = pr;
O.jsx = tr;
O.jsxs = tr;
er.exports = O;
var qr = er.exports;
function or(r) {
  var e,
    o,
    t = '';
  if (typeof r == 'string' || typeof r == 'number') t += r;
  else if (typeof r == 'object')
    if (Array.isArray(r))
      for (e = 0; e < r.length; e++) r[e] && (o = or(r[e])) && (t && (t += ' '), (t += o));
    else for (e in r) r[e] && (t && (t += ' '), (t += e));
  return t;
}
function vr() {
  for (var r, e, o = 0, t = ''; o < arguments.length; )
    (r = arguments[o++]) && (e = or(r)) && (t && (t += ' '), (t += e));
  return t;
}
function mr() {
  for (var r = 0, e, o, t = ''; r < arguments.length; )
    (e = arguments[r++]) && (o = nr(e)) && (t && (t += ' '), (t += o));
  return t;
}
function nr(r) {
  if (typeof r == 'string') return r;
  for (var e, o = '', t = 0; t < r.length; t++)
    r[t] && (e = nr(r[t])) && (o && (o += ' '), (o += e));
  return o;
}
function W() {
  return (
    (W = Object.assign
      ? Object.assign.bind()
      : function (r) {
          for (var e = 1; e < arguments.length; e++) {
            var o = arguments[e];
            for (var t in o) Object.prototype.hasOwnProperty.call(o, t) && (r[t] = o[t]);
          }
          return r;
        }),
    W.apply(this, arguments)
  );
}
var V = '-';
function hr(r) {
  var e = xr(r);
  function o(n) {
    var i = n.split(V);
    return i[0] === '' && i.length !== 1 && i.shift(), ar(i, e) || yr(n);
  }
  function t(n) {
    return r.conflictingClassGroups[n] || [];
  }
  return { getClassGroupId: o, getConflictingClassGroupIds: t };
}
function ar(r, e) {
  var o;
  if (r.length === 0) return e.classGroupId;
  var t = r[0],
    n = e.nextPart.get(t),
    i = n ? ar(r.slice(1), n) : void 0;
  if (i) return i;
  if (e.validators.length !== 0) {
    var a = r.join(V);
    return (o = e.validators.find(function (s) {
      var c = s.validator;
      return c(a);
    })) == null
      ? void 0
      : o.classGroupId;
  }
}
var Q = /^\[(.+)\]$/;
function yr(r) {
  if (Q.test(r)) {
    var e = Q.exec(r)[1],
      o = e == null ? void 0 : e.substring(0, e.indexOf(':'));
    if (o) return 'arbitrary..' + o;
  }
}
function xr(r) {
  var e = r.theme,
    o = r.prefix,
    t = { nextPart: new Map(), validators: [] },
    n = kr(Object.entries(r.classGroups), o);
  return (
    n.forEach(function (i) {
      var a = i[0],
        s = i[1];
      U(s, t, a, e);
    }),
    t
  );
}
function U(r, e, o, t) {
  r.forEach(function (n) {
    if (typeof n == 'string') {
      var i = n === '' ? e : D(e, n);
      i.classGroupId = o;
      return;
    }
    if (typeof n == 'function') {
      if (wr(n)) {
        U(n(t), e, o, t);
        return;
      }
      e.validators.push({ validator: n, classGroupId: o });
      return;
    }
    Object.entries(n).forEach(function (a) {
      var s = a[0],
        c = a[1];
      U(c, D(e, s), o, t);
    });
  });
}
function D(r, e) {
  var o = r;
  return (
    e.split(V).forEach(function (t) {
      o.nextPart.has(t) || o.nextPart.set(t, { nextPart: new Map(), validators: [] }),
        (o = o.nextPart.get(t));
    }),
    o
  );
}
function wr(r) {
  return r.isThemeGetter;
}
function kr(r, e) {
  return e
    ? r.map(function (o) {
        var t = o[0],
          n = o[1],
          i = n.map(function (a) {
            return typeof a == 'string'
              ? e + a
              : typeof a == 'object'
              ? Object.fromEntries(
                  Object.entries(a).map(function (s) {
                    var c = s[0],
                      d = s[1];
                    return [e + c, d];
                  }),
                )
              : a;
          });
        return [t, i];
      })
    : r;
}
function Cr(r) {
  if (r < 1) return { get: function () {}, set: function () {} };
  var e = 0,
    o = new Map(),
    t = new Map();
  function n(i, a) {
    o.set(i, a), e++, e > r && ((e = 0), (t = o), (o = new Map()));
  }
  return {
    get: function (a) {
      var s = o.get(a);
      if (s !== void 0) return s;
      if ((s = t.get(a)) !== void 0) return n(a, s), s;
    },
    set: function (a, s) {
      o.has(a) ? o.set(a, s) : n(a, s);
    },
  };
}
var ir = '!';
function Ir(r) {
  var e = r.separator || ':';
  return function (t) {
    for (var n = 0, i = [], a = 0, s = 0; s < t.length; s++) {
      var c = t[s];
      n === 0 &&
        c === e[0] &&
        (e.length === 1 || t.slice(s, s + e.length) === e) &&
        (i.push(t.slice(a, s)), (a = s + e.length)),
        c === '[' ? n++ : c === ']' && n--;
    }
    var d = i.length === 0 ? t : t.substring(a),
      p = d.startsWith(ir),
      f = p ? d.substring(1) : d;
    return { modifiers: i, hasImportantModifier: p, baseClassName: f };
  };
}
function zr(r) {
  if (r.length <= 1) return r;
  var e = [],
    o = [];
  return (
    r.forEach(function (t) {
      var n = t[0] === '[';
      n ? (e.push.apply(e, o.sort().concat([t])), (o = [])) : o.push(t);
    }),
    e.push.apply(e, o.sort()),
    e
  );
}
function Ar(r) {
  return W({ cache: Cr(r.cacheSize), splitModifiers: Ir(r) }, hr(r));
}
var Gr = /\s+/;
function Sr(r, e) {
  var o = e.splitModifiers,
    t = e.getClassGroupId,
    n = e.getConflictingClassGroupIds,
    i = new Set();
  return r
    .trim()
    .split(Gr)
    .map(function (a) {
      var s = o(a),
        c = s.modifiers,
        d = s.hasImportantModifier,
        p = s.baseClassName,
        f = t(p);
      if (!f) return { isTailwindClass: !1, originalClassName: a };
      var m = zr(c).join(':'),
        x = d ? m + ir : m;
      return { isTailwindClass: !0, modifierId: x, classGroupId: f, originalClassName: a };
    })
    .reverse()
    .filter(function (a) {
      if (!a.isTailwindClass) return !0;
      var s = a.modifierId,
        c = a.classGroupId,
        d = s + c;
      return i.has(d)
        ? !1
        : (i.add(d),
          n(c).forEach(function (p) {
            return i.add(s + p);
          }),
          !0);
    })
    .reverse()
    .map(function (a) {
      return a.originalClassName;
    })
    .join(' ');
}
function Mr() {
  for (var r = arguments.length, e = new Array(r), o = 0; o < r; o++) e[o] = arguments[o];
  var t,
    n,
    i,
    a = s;
  function s(d) {
    var p = e[0],
      f = e.slice(1),
      m = f.reduce(function (x, v) {
        return v(x);
      }, p());
    return (t = Ar(m)), (n = t.cache.get), (i = t.cache.set), (a = c), c(d);
  }
  function c(d) {
    var p = n(d);
    if (p) return p;
    var f = Sr(d, t);
    return i(d, f), f;
  }
  return function () {
    return a(mr.apply(null, arguments));
  };
}
function l(r) {
  var e = function (t) {
    return t[r] || [];
  };
  return (e.isThemeGetter = !0), e;
}
var sr = /^\[(?:([a-z-]+):)?(.+)\]$/i,
  Rr = /^\d+\/\d+$/,
  jr = new Set(['px', 'full', 'screen']),
  Er = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Or = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))/,
  Tr = /^-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
function g(r) {
  return M(r) || jr.has(r) || Rr.test(r) || C(r);
}
function C(r) {
  return I(r, 'length', Wr);
}
function Nr(r) {
  return I(r, 'size', lr);
}
function _r(r) {
  return I(r, 'position', lr);
}
function Lr(r) {
  return I(r, 'url', Ur);
}
function P(r) {
  return I(r, 'number', M);
}
function M(r) {
  return !Number.isNaN(Number(r));
}
function G(r) {
  return rr(r) || I(r, 'number', rr);
}
function u(r) {
  return sr.test(r);
}
function S() {
  return !0;
}
function y(r) {
  return Er.test(r);
}
function Pr(r) {
  return I(r, '', Vr);
}
function I(r, e, o) {
  var t = sr.exec(r);
  return t ? (t[1] ? t[1] === e : o(t[2])) : !1;
}
function Wr(r) {
  return Or.test(r);
}
function lr() {
  return !1;
}
function Ur(r) {
  return r.startsWith('url(');
}
function rr(r) {
  return Number.isInteger(Number(r));
}
function Vr(r) {
  return Tr.test(r);
}
function $r() {
  var r = l('colors'),
    e = l('spacing'),
    o = l('blur'),
    t = l('brightness'),
    n = l('borderColor'),
    i = l('borderRadius'),
    a = l('borderSpacing'),
    s = l('borderWidth'),
    c = l('contrast'),
    d = l('grayscale'),
    p = l('hueRotate'),
    f = l('invert'),
    m = l('gap'),
    x = l('gradientColorStops'),
    v = l('inset'),
    w = l('margin'),
    h = l('opacity'),
    k = l('padding'),
    $ = l('saturate'),
    T = l('scale'),
    B = l('sepia'),
    F = l('skew'),
    q = l('space'),
    J = l('translate'),
    N = function () {
      return ['auto', 'contain', 'none'];
    },
    _ = function () {
      return ['auto', 'hidden', 'clip', 'visible', 'scroll'];
    },
    Z = function () {
      return ['auto', e];
    },
    X = function () {
      return ['', g];
    },
    R = function () {
      return ['auto', M, u];
    },
    Y = function () {
      return [
        'bottom',
        'center',
        'left',
        'left-bottom',
        'left-top',
        'right',
        'right-bottom',
        'right-top',
        'top',
      ];
    },
    j = function () {
      return ['solid', 'dashed', 'dotted', 'double', 'none'];
    },
    H = function () {
      return [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
        'plus-lighter',
      ];
    },
    L = function () {
      return ['start', 'end', 'center', 'between', 'around', 'evenly'];
    },
    z = function () {
      return ['', '0', u];
    },
    K = function () {
      return ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
    },
    A = function () {
      return [M, P];
    },
    E = function () {
      return [M, u];
    };
  return {
    cacheSize: 500,
    theme: {
      colors: [S],
      spacing: [g],
      blur: ['none', '', y, C],
      brightness: A(),
      borderColor: [r],
      borderRadius: ['none', '', 'full', y, C],
      borderSpacing: [e],
      borderWidth: X(),
      contrast: A(),
      grayscale: z(),
      hueRotate: E(),
      invert: z(),
      gap: [e],
      gradientColorStops: [r],
      inset: Z(),
      margin: Z(),
      opacity: A(),
      padding: [e],
      saturate: A(),
      scale: A(),
      sepia: z(),
      skew: E(),
      space: [e],
      translate: [e],
    },
    classGroups: {
      aspect: [{ aspect: ['auto', 'square', 'video', u] }],
      container: ['container'],
      columns: [{ columns: [y] }],
      'break-after': [{ 'break-after': K() }],
      'break-before': [{ 'break-before': K() }],
      'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
      'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
      box: [{ box: ['border', 'content'] }],
      display: [
        'block',
        'inline-block',
        'inline',
        'flex',
        'inline-flex',
        'table',
        'inline-table',
        'table-caption',
        'table-cell',
        'table-column',
        'table-column-group',
        'table-footer-group',
        'table-header-group',
        'table-row-group',
        'table-row',
        'flow-root',
        'grid',
        'inline-grid',
        'contents',
        'list-item',
        'hidden',
      ],
      float: [{ float: ['right', 'left', 'none'] }],
      clear: [{ clear: ['left', 'right', 'both', 'none'] }],
      isolation: ['isolate', 'isolation-auto'],
      'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
      'object-position': [{ object: [].concat(Y(), [u]) }],
      overflow: [{ overflow: _() }],
      'overflow-x': [{ 'overflow-x': _() }],
      'overflow-y': [{ 'overflow-y': _() }],
      overscroll: [{ overscroll: N() }],
      'overscroll-x': [{ 'overscroll-x': N() }],
      'overscroll-y': [{ 'overscroll-y': N() }],
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      inset: [{ inset: [v] }],
      'inset-x': [{ 'inset-x': [v] }],
      'inset-y': [{ 'inset-y': [v] }],
      top: [{ top: [v] }],
      right: [{ right: [v] }],
      bottom: [{ bottom: [v] }],
      left: [{ left: [v] }],
      visibility: ['visible', 'invisible', 'collapse'],
      z: [{ z: ['auto', G] }],
      basis: [{ basis: [e] }],
      'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
      'flex-wrap': [{ flex: ['wrap', 'wrap-reverse', 'nowrap'] }],
      flex: [{ flex: ['1', 'auto', 'initial', 'none', u] }],
      grow: [{ grow: z() }],
      shrink: [{ shrink: z() }],
      order: [{ order: ['first', 'last', 'none', G] }],
      'grid-cols': [{ 'grid-cols': [S] }],
      'col-start-end': [{ col: ['auto', { span: [G] }, u] }],
      'col-start': [{ 'col-start': R() }],
      'col-end': [{ 'col-end': R() }],
      'grid-rows': [{ 'grid-rows': [S] }],
      'row-start-end': [{ row: ['auto', { span: [G] }, u] }],
      'row-start': [{ 'row-start': R() }],
      'row-end': [{ 'row-end': R() }],
      'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
      'auto-cols': [{ 'auto-cols': ['auto', 'min', 'max', 'fr', u] }],
      'auto-rows': [{ 'auto-rows': ['auto', 'min', 'max', 'fr', u] }],
      gap: [{ gap: [m] }],
      'gap-x': [{ 'gap-x': [m] }],
      'gap-y': [{ 'gap-y': [m] }],
      'justify-content': [{ justify: L() }],
      'justify-items': [{ 'justify-items': ['start', 'end', 'center', 'stretch'] }],
      'justify-self': [{ 'justify-self': ['auto', 'start', 'end', 'center', 'stretch'] }],
      'align-content': [{ content: [].concat(L(), ['baseline']) }],
      'align-items': [{ items: ['start', 'end', 'center', 'baseline', 'stretch'] }],
      'align-self': [{ self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline'] }],
      'place-content': [{ 'place-content': [].concat(L(), ['baseline', 'stretch']) }],
      'place-items': [{ 'place-items': ['start', 'end', 'center', 'baseline', 'stretch'] }],
      'place-self': [{ 'place-self': ['auto', 'start', 'end', 'center', 'stretch'] }],
      p: [{ p: [k] }],
      px: [{ px: [k] }],
      py: [{ py: [k] }],
      pt: [{ pt: [k] }],
      pr: [{ pr: [k] }],
      pb: [{ pb: [k] }],
      pl: [{ pl: [k] }],
      m: [{ m: [w] }],
      mx: [{ mx: [w] }],
      my: [{ my: [w] }],
      mt: [{ mt: [w] }],
      mr: [{ mr: [w] }],
      mb: [{ mb: [w] }],
      ml: [{ ml: [w] }],
      'space-x': [{ 'space-x': [q] }],
      'space-x-reverse': ['space-x-reverse'],
      'space-y': [{ 'space-y': [q] }],
      'space-y-reverse': ['space-y-reverse'],
      w: [{ w: ['auto', 'min', 'max', 'fit', e] }],
      'min-w': [{ 'min-w': ['min', 'max', 'fit', g] }],
      'max-w': [
        { 'max-w': ['0', 'none', 'full', 'min', 'max', 'fit', 'prose', { screen: [y] }, y, C] },
      ],
      h: [{ h: [e, 'auto', 'min', 'max', 'fit'] }],
      'min-h': [{ 'min-h': ['min', 'max', 'fit', g] }],
      'max-h': [{ 'max-h': [e, 'min', 'max', 'fit'] }],
      'font-size': [{ text: ['base', y, C] }],
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      'font-style': ['italic', 'not-italic'],
      'font-weight': [
        {
          font: [
            'thin',
            'extralight',
            'light',
            'normal',
            'medium',
            'semibold',
            'bold',
            'extrabold',
            'black',
            P,
          ],
        },
      ],
      'font-family': [{ font: [S] }],
      'fvn-normal': ['normal-nums'],
      'fvn-ordinal': ['ordinal'],
      'fvn-slashed-zero': ['slashed-zero'],
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractons'],
      tracking: [{ tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', C] }],
      leading: [{ leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', g] }],
      'list-style-type': [{ list: ['none', 'disc', 'decimal', u] }],
      'list-style-position': [{ list: ['inside', 'outside'] }],
      'placeholder-color': [{ placeholder: [r] }],
      'placeholder-opacity': [{ 'placeholder-opacity': [h] }],
      'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
      'text-color': [{ text: [r] }],
      'text-opacity': [{ 'text-opacity': [h] }],
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      'text-decoration-style': [{ decoration: [].concat(j(), ['wavy']) }],
      'text-decoration-thickness': [{ decoration: ['auto', 'from-font', g] }],
      'underline-offset': [{ 'underline-offset': ['auto', g] }],
      'text-decoration-color': [{ decoration: [r] }],
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      indent: [{ indent: [e] }],
      'vertical-align': [
        {
          align: [
            'baseline',
            'top',
            'middle',
            'bottom',
            'text-top',
            'text-bottom',
            'sub',
            'super',
            C,
          ],
        },
      ],
      whitespace: [{ whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'] }],
      break: [{ break: ['normal', 'words', 'all', 'keep'] }],
      content: [{ content: ['none', u] }],
      'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
      'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
      'bg-opacity': [{ 'bg-opacity': [h] }],
      'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
      'bg-position': [{ bg: [].concat(Y(), [_r]) }],
      'bg-repeat': [{ bg: ['no-repeat', { repeat: ['', 'x', 'y', 'round', 'space'] }] }],
      'bg-size': [{ bg: ['auto', 'cover', 'contain', Nr] }],
      'bg-image': [
        { bg: ['none', { 'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, Lr] },
      ],
      'bg-color': [{ bg: [r] }],
      'gradient-from': [{ from: [x] }],
      'gradient-via': [{ via: [x] }],
      'gradient-to': [{ to: [x] }],
      rounded: [{ rounded: [i] }],
      'rounded-t': [{ 'rounded-t': [i] }],
      'rounded-r': [{ 'rounded-r': [i] }],
      'rounded-b': [{ 'rounded-b': [i] }],
      'rounded-l': [{ 'rounded-l': [i] }],
      'rounded-tl': [{ 'rounded-tl': [i] }],
      'rounded-tr': [{ 'rounded-tr': [i] }],
      'rounded-br': [{ 'rounded-br': [i] }],
      'rounded-bl': [{ 'rounded-bl': [i] }],
      'border-w': [{ border: [s] }],
      'border-w-x': [{ 'border-x': [s] }],
      'border-w-y': [{ 'border-y': [s] }],
      'border-w-t': [{ 'border-t': [s] }],
      'border-w-r': [{ 'border-r': [s] }],
      'border-w-b': [{ 'border-b': [s] }],
      'border-w-l': [{ 'border-l': [s] }],
      'border-opacity': [{ 'border-opacity': [h] }],
      'border-style': [{ border: [].concat(j(), ['hidden']) }],
      'divide-x': [{ 'divide-x': [s] }],
      'divide-x-reverse': ['divide-x-reverse'],
      'divide-y': [{ 'divide-y': [s] }],
      'divide-y-reverse': ['divide-y-reverse'],
      'divide-opacity': [{ 'divide-opacity': [h] }],
      'divide-style': [{ divide: j() }],
      'border-color': [{ border: [n] }],
      'border-color-x': [{ 'border-x': [n] }],
      'border-color-y': [{ 'border-y': [n] }],
      'border-color-t': [{ 'border-t': [n] }],
      'border-color-r': [{ 'border-r': [n] }],
      'border-color-b': [{ 'border-b': [n] }],
      'border-color-l': [{ 'border-l': [n] }],
      'divide-color': [{ divide: [n] }],
      'outline-style': [{ outline: [''].concat(j()) }],
      'outline-offset': [{ 'outline-offset': [g] }],
      'outline-w': [{ outline: [g] }],
      'outline-color': [{ outline: [r] }],
      'ring-w': [{ ring: X() }],
      'ring-w-inset': ['ring-inset'],
      'ring-color': [{ ring: [r] }],
      'ring-opacity': [{ 'ring-opacity': [h] }],
      'ring-offset-w': [{ 'ring-offset': [g] }],
      'ring-offset-color': [{ 'ring-offset': [r] }],
      shadow: [{ shadow: ['', 'inner', 'none', y, Pr] }],
      'shadow-color': [{ shadow: [S] }],
      opacity: [{ opacity: [h] }],
      'mix-blend': [{ 'mix-blend': H() }],
      'bg-blend': [{ 'bg-blend': H() }],
      filter: [{ filter: ['', 'none'] }],
      blur: [{ blur: [o] }],
      brightness: [{ brightness: [t] }],
      contrast: [{ contrast: [c] }],
      'drop-shadow': [{ 'drop-shadow': ['', 'none', y, u] }],
      grayscale: [{ grayscale: [d] }],
      'hue-rotate': [{ 'hue-rotate': [p] }],
      invert: [{ invert: [f] }],
      saturate: [{ saturate: [$] }],
      sepia: [{ sepia: [B] }],
      'backdrop-filter': [{ 'backdrop-filter': ['', 'none'] }],
      'backdrop-blur': [{ 'backdrop-blur': [o] }],
      'backdrop-brightness': [{ 'backdrop-brightness': [t] }],
      'backdrop-contrast': [{ 'backdrop-contrast': [c] }],
      'backdrop-grayscale': [{ 'backdrop-grayscale': [d] }],
      'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [p] }],
      'backdrop-invert': [{ 'backdrop-invert': [f] }],
      'backdrop-opacity': [{ 'backdrop-opacity': [h] }],
      'backdrop-saturate': [{ 'backdrop-saturate': [$] }],
      'backdrop-sepia': [{ 'backdrop-sepia': [B] }],
      'border-collapse': [{ border: ['collapse', 'separate'] }],
      'border-spacing': [{ 'border-spacing': [a] }],
      'border-spacing-x': [{ 'border-spacing-x': [a] }],
      'border-spacing-y': [{ 'border-spacing-y': [a] }],
      'table-layout': [{ table: ['auto', 'fixed'] }],
      transition: [
        { transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', u] },
      ],
      duration: [{ duration: E() }],
      ease: [{ ease: ['linear', 'in', 'out', 'in-out', u] }],
      delay: [{ delay: E() }],
      animate: [{ animate: ['none', 'spin', 'ping', 'pulse', 'bounce', u] }],
      transform: [{ transform: ['', 'gpu', 'none'] }],
      scale: [{ scale: [T] }],
      'scale-x': [{ 'scale-x': [T] }],
      'scale-y': [{ 'scale-y': [T] }],
      rotate: [{ rotate: [G, u] }],
      'translate-x': [{ 'translate-x': [J] }],
      'translate-y': [{ 'translate-y': [J] }],
      'skew-x': [{ 'skew-x': [F] }],
      'skew-y': [{ 'skew-y': [F] }],
      'transform-origin': [
        {
          origin: [
            'center',
            'top',
            'top-right',
            'right',
            'bottom-right',
            'bottom',
            'bottom-left',
            'left',
            'top-left',
            u,
          ],
        },
      ],
      accent: [{ accent: ['auto', r] }],
      appearance: ['appearance-none'],
      cursor: [
        {
          cursor: [
            'auto',
            'default',
            'pointer',
            'wait',
            'text',
            'move',
            'help',
            'not-allowed',
            'none',
            'context-menu',
            'progress',
            'cell',
            'crosshair',
            'vertical-text',
            'alias',
            'copy',
            'no-drop',
            'grab',
            'grabbing',
            'all-scroll',
            'col-resize',
            'row-resize',
            'n-resize',
            'e-resize',
            's-resize',
            'w-resize',
            'ne-resize',
            'nw-resize',
            'se-resize',
            'sw-resize',
            'ew-resize',
            'ns-resize',
            'nesw-resize',
            'nwse-resize',
            'zoom-in',
            'zoom-out',
            u,
          ],
        },
      ],
      'caret-color': [{ caret: [r] }],
      'pointer-events': [{ 'pointer-events': ['none', 'auto'] }],
      resize: [{ resize: ['none', 'y', 'x', ''] }],
      'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
      'scroll-m': [{ 'scroll-m': [e] }],
      'scroll-mx': [{ 'scroll-mx': [e] }],
      'scroll-my': [{ 'scroll-my': [e] }],
      'scroll-mt': [{ 'scroll-mt': [e] }],
      'scroll-mr': [{ 'scroll-mr': [e] }],
      'scroll-mb': [{ 'scroll-mb': [e] }],
      'scroll-ml': [{ 'scroll-ml': [e] }],
      'scroll-p': [{ 'scroll-p': [e] }],
      'scroll-px': [{ 'scroll-px': [e] }],
      'scroll-py': [{ 'scroll-py': [e] }],
      'scroll-pt': [{ 'scroll-pt': [e] }],
      'scroll-pr': [{ 'scroll-pr': [e] }],
      'scroll-pb': [{ 'scroll-pb': [e] }],
      'scroll-pl': [{ 'scroll-pl': [e] }],
      'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
      'snap-stop': [{ snap: ['normal', 'always'] }],
      'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
      'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
      touch: [
        {
          touch: [
            'auto',
            'none',
            'pinch-zoom',
            'manipulation',
            { pan: ['x', 'left', 'right', 'y', 'up', 'down'] },
          ],
        },
      ],
      select: [{ select: ['none', 'text', 'all', 'auto'] }],
      'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', u] }],
      fill: [{ fill: [r, 'none'] }],
      'stroke-w': [{ stroke: [g, P] }],
      stroke: [{ stroke: [r, 'none'] }],
      sr: ['sr-only', 'not-sr-only'],
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      'font-size': ['leading'],
      'fvn-normal': [
        'fvn-ordinal',
        'fvn-slashed-zero',
        'fvn-figure',
        'fvn-spacing',
        'fvn-fraction',
      ],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      rounded: [
        'rounded-t',
        'rounded-r',
        'rounded-b',
        'rounded-l',
        'rounded-tl',
        'rounded-tr',
        'rounded-br',
        'rounded-bl',
      ],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': ['border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': ['scroll-px', 'scroll-py', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
    },
  };
}
var Br = Mr($r);
const Jr = (...r) => Br(vr(r));
export { vr as a, Jr as c, qr as j };
//# sourceMappingURL=ctw-409c05e4.js.map
