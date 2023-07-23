import { c as Q, g as K } from '../../../../_commonjsHelpers-10dfc225.js';
var V = { exports: {} };
(function (j, U) {
  (function (A, x) {
    j.exports = x();
  })(Q, function () {
    var A = 1e3,
      x = 6e4,
      J = 36e5,
      k = 'millisecond',
      p = 'second',
      S = 'minute',
      w = 'hour',
      M = 'day',
      b = 'week',
      l = 'month',
      Z = 'quarter',
      v = 'year',
      O = 'date',
      z = 'Invalid Date',
      q =
        /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
      B = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
      G = {
        name: 'en',
        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        months:
          'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_',
          ),
        ordinal: function (r) {
          var e = ['th', 'st', 'nd', 'rd'],
            t = r % 100;
          return '[' + r + (e[(t - 20) % 10] || e[t] || e[0]) + ']';
        },
      },
      I = function (r, e, t) {
        var i = String(r);
        return !i || i.length >= e ? r : '' + Array(e + 1 - i.length).join(t) + r;
      },
      P = {
        s: I,
        z: function (r) {
          var e = -r.utcOffset(),
            t = Math.abs(e),
            i = Math.floor(t / 60),
            n = t % 60;
          return (e <= 0 ? '+' : '-') + I(i, 2, '0') + ':' + I(n, 2, '0');
        },
        m: function r(e, t) {
          if (e.date() < t.date()) return -r(t, e);
          var i = 12 * (t.year() - e.year()) + (t.month() - e.month()),
            n = e.clone().add(i, l),
            u = t - n < 0,
            s = e.clone().add(i + (u ? -1 : 1), l);
          return +(-(i + (t - n) / (u ? n - s : s - n)) || 0);
        },
        a: function (r) {
          return r < 0 ? Math.ceil(r) || 0 : Math.floor(r);
        },
        p: function (r) {
          return (
            { M: l, y: v, w: b, d: M, D: O, h: w, m: S, s: p, ms: k, Q: Z }[r] ||
            String(r || '')
              .toLowerCase()
              .replace(/s$/, '')
          );
        },
        u: function (r) {
          return r === void 0;
        },
      },
      H = 'en',
      D = {};
    D[H] = G;
    var F = function (r) {
        return r instanceof L;
      },
      C = function r(e, t, i) {
        var n;
        if (!e) return H;
        if (typeof e == 'string') {
          var u = e.toLowerCase();
          D[u] && (n = u), t && ((D[u] = t), (n = u));
          var s = e.split('-');
          if (!n && s.length > 1) return r(s[0]);
        } else {
          var a = e.name;
          (D[a] = e), (n = a);
        }
        return !i && n && (H = n), n || (!i && H);
      },
      c = function (r, e) {
        if (F(r)) return r.clone();
        var t = typeof e == 'object' ? e : {};
        return (t.date = r), (t.args = arguments), new L(t);
      },
      o = P;
    (o.l = C),
      (o.i = F),
      (o.w = function (r, e) {
        return c(r, { locale: e.$L, utc: e.$u, x: e.$x, $offset: e.$offset });
      });
    var L = (function () {
        function r(t) {
          (this.$L = C(t.locale, null, !0)), this.parse(t);
        }
        var e = r.prototype;
        return (
          (e.parse = function (t) {
            (this.$d = (function (i) {
              var n = i.date,
                u = i.utc;
              if (n === null) return /* @__PURE__ */ new Date(NaN);
              if (o.u(n)) return /* @__PURE__ */ new Date();
              if (n instanceof Date) return new Date(n);
              if (typeof n == 'string' && !/Z$/i.test(n)) {
                var s = n.match(q);
                if (s) {
                  var a = s[2] - 1 || 0,
                    f = (s[7] || '0').substring(0, 3);
                  return u
                    ? new Date(Date.UTC(s[1], a, s[3] || 1, s[4] || 0, s[5] || 0, s[6] || 0, f))
                    : new Date(s[1], a, s[3] || 1, s[4] || 0, s[5] || 0, s[6] || 0, f);
                }
              }
              return new Date(n);
            })(t)),
              (this.$x = t.x || {}),
              this.init();
          }),
          (e.init = function () {
            var t = this.$d;
            (this.$y = t.getFullYear()),
              (this.$M = t.getMonth()),
              (this.$D = t.getDate()),
              (this.$W = t.getDay()),
              (this.$H = t.getHours()),
              (this.$m = t.getMinutes()),
              (this.$s = t.getSeconds()),
              (this.$ms = t.getMilliseconds());
          }),
          (e.$utils = function () {
            return o;
          }),
          (e.isValid = function () {
            return this.$d.toString() !== z;
          }),
          (e.isSame = function (t, i) {
            var n = c(t);
            return this.startOf(i) <= n && n <= this.endOf(i);
          }),
          (e.isAfter = function (t, i) {
            return c(t) < this.startOf(i);
          }),
          (e.isBefore = function (t, i) {
            return this.endOf(i) < c(t);
          }),
          (e.$g = function (t, i, n) {
            return o.u(t) ? this[i] : this.set(n, t);
          }),
          (e.unix = function () {
            return Math.floor(this.valueOf() / 1e3);
          }),
          (e.valueOf = function () {
            return this.$d.getTime();
          }),
          (e.startOf = function (t, i) {
            var n = this,
              u = !!o.u(i) || i,
              s = o.p(t),
              a = function (_, $) {
                var g = o.w(n.$u ? Date.UTC(n.$y, $, _) : new Date(n.$y, $, _), n);
                return u ? g : g.endOf(M);
              },
              f = function (_, $) {
                return o.w(
                  n
                    .toDate()
                    [_].apply(n.toDate('s'), (u ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice($)),
                  n,
                );
              },
              h = this.$W,
              d = this.$M,
              y = this.$D,
              m = 'set' + (this.$u ? 'UTC' : '');
            switch (s) {
              case v:
                return u ? a(1, 0) : a(31, 11);
              case l:
                return u ? a(1, d) : a(0, d + 1);
              case b:
                var T = this.$locale().weekStart || 0,
                  Y = (h < T ? h + 7 : h) - T;
                return a(u ? y - Y : y + (6 - Y), d);
              case M:
              case O:
                return f(m + 'Hours', 0);
              case w:
                return f(m + 'Minutes', 1);
              case S:
                return f(m + 'Seconds', 2);
              case p:
                return f(m + 'Milliseconds', 3);
              default:
                return this.clone();
            }
          }),
          (e.endOf = function (t) {
            return this.startOf(t, !1);
          }),
          (e.$set = function (t, i) {
            var n,
              u = o.p(t),
              s = 'set' + (this.$u ? 'UTC' : ''),
              a = ((n = {}),
              (n[M] = s + 'Date'),
              (n[O] = s + 'Date'),
              (n[l] = s + 'Month'),
              (n[v] = s + 'FullYear'),
              (n[w] = s + 'Hours'),
              (n[S] = s + 'Minutes'),
              (n[p] = s + 'Seconds'),
              (n[k] = s + 'Milliseconds'),
              n)[u],
              f = u === M ? this.$D + (i - this.$W) : i;
            if (u === l || u === v) {
              var h = this.clone().set(O, 1);
              h.$d[a](f), h.init(), (this.$d = h.set(O, Math.min(this.$D, h.daysInMonth())).$d);
            } else a && this.$d[a](f);
            return this.init(), this;
          }),
          (e.set = function (t, i) {
            return this.clone().$set(t, i);
          }),
          (e.get = function (t) {
            return this[o.p(t)]();
          }),
          (e.add = function (t, i) {
            var n,
              u = this;
            t = Number(t);
            var s = o.p(i),
              a = function (d) {
                var y = c(u);
                return o.w(y.date(y.date() + Math.round(d * t)), u);
              };
            if (s === l) return this.set(l, this.$M + t);
            if (s === v) return this.set(v, this.$y + t);
            if (s === M) return a(1);
            if (s === b) return a(7);
            var f = ((n = {}), (n[S] = x), (n[w] = J), (n[p] = A), n)[s] || 1,
              h = this.$d.getTime() + t * f;
            return o.w(h, this);
          }),
          (e.subtract = function (t, i) {
            return this.add(-1 * t, i);
          }),
          (e.format = function (t) {
            var i = this,
              n = this.$locale();
            if (!this.isValid()) return n.invalidDate || z;
            var u = t || 'YYYY-MM-DDTHH:mm:ssZ',
              s = o.z(this),
              a = this.$H,
              f = this.$m,
              h = this.$M,
              d = n.weekdays,
              y = n.months,
              m = function ($, g, N, W) {
                return ($ && ($[g] || $(i, u))) || N[g].slice(0, W);
              },
              T = function ($) {
                return o.s(a % 12 || 12, $, '0');
              },
              Y =
                n.meridiem ||
                function ($, g, N) {
                  var W = $ < 12 ? 'AM' : 'PM';
                  return N ? W.toLowerCase() : W;
                },
              _ = {
                YY: String(this.$y).slice(-2),
                YYYY: this.$y,
                M: h + 1,
                MM: o.s(h + 1, 2, '0'),
                MMM: m(n.monthsShort, h, y, 3),
                MMMM: m(y, h),
                D: this.$D,
                DD: o.s(this.$D, 2, '0'),
                d: String(this.$W),
                dd: m(n.weekdaysMin, this.$W, d, 2),
                ddd: m(n.weekdaysShort, this.$W, d, 3),
                dddd: d[this.$W],
                H: String(a),
                HH: o.s(a, 2, '0'),
                h: T(1),
                hh: T(2),
                a: Y(a, f, !0),
                A: Y(a, f, !1),
                m: String(f),
                mm: o.s(f, 2, '0'),
                s: String(this.$s),
                ss: o.s(this.$s, 2, '0'),
                SSS: o.s(this.$ms, 3, '0'),
                Z: s,
              };
            return u.replace(B, function ($, g) {
              return g || _[$] || s.replace(':', '');
            });
          }),
          (e.utcOffset = function () {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }),
          (e.diff = function (t, i, n) {
            var u,
              s = o.p(i),
              a = c(t),
              f = (a.utcOffset() - this.utcOffset()) * x,
              h = this - a,
              d = o.m(this, a);
            return (
              (d =
                ((u = {}),
                (u[v] = d / 12),
                (u[l] = d),
                (u[Z] = d / 3),
                (u[b] = (h - f) / 6048e5),
                (u[M] = (h - f) / 864e5),
                (u[w] = h / J),
                (u[S] = h / x),
                (u[p] = h / A),
                u)[s] || h),
              n ? d : o.a(d)
            );
          }),
          (e.daysInMonth = function () {
            return this.endOf(l).$D;
          }),
          (e.$locale = function () {
            return D[this.$L];
          }),
          (e.locale = function (t, i) {
            if (!t) return this.$L;
            var n = this.clone(),
              u = C(t, i, !0);
            return u && (n.$L = u), n;
          }),
          (e.clone = function () {
            return o.w(this.$d, this);
          }),
          (e.toDate = function () {
            return new Date(this.valueOf());
          }),
          (e.toJSON = function () {
            return this.isValid() ? this.toISOString() : null;
          }),
          (e.toISOString = function () {
            return this.$d.toISOString();
          }),
          (e.toString = function () {
            return this.$d.toUTCString();
          }),
          r
        );
      })(),
      E = L.prototype;
    return (
      (c.prototype = E),
      [
        ['$ms', k],
        ['$s', p],
        ['$m', S],
        ['$H', w],
        ['$W', M],
        ['$M', l],
        ['$y', v],
        ['$D', O],
      ].forEach(function (r) {
        E[r[1]] = function (e) {
          return this.$g(e, r[0], r[1]);
        };
      }),
      (c.extend = function (r, e) {
        return r.$i || (r(e, L, c), (r.$i = !0)), c;
      }),
      (c.locale = C),
      (c.isDayjs = F),
      (c.unix = function (r) {
        return c(1e3 * r);
      }),
      (c.en = D[H]),
      (c.Ls = D),
      (c.p = {}),
      c
    );
  });
})(V);
var R = V.exports;
const X = /* @__PURE__ */ K(R);
function nt(j, U) {
  return Math.abs(X(U).diff(j, 'hour', !1));
}
export { nt as calculateHourDifference };
