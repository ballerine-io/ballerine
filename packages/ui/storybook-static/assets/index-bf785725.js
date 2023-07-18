import { a as O } from './ctw-409c05e4.js';
const m = e => (typeof e == 'boolean' ? ''.concat(e) : e === 0 ? '0' : e),
  y = O,
  j = (e, l) => n => {
    var u;
    if ((l == null ? void 0 : l.variants) == null)
      return y(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
    const { variants: o, defaultVariants: d } = l,
      N = Object.keys(o).map(t => {
        const a = n == null ? void 0 : n[t],
          s = d == null ? void 0 : d[t];
        if (a === null) return null;
        const i = m(a) || m(s);
        return o[t][i];
      }),
      v =
        n &&
        Object.entries(n).reduce((t, a) => {
          let [s, i] = a;
          return i === void 0 || (t[s] = i), t;
        }, {}),
      V =
        l == null || (u = l.compoundVariants) === null || u === void 0
          ? void 0
          : u.reduce((t, a) => {
              let { class: s, className: i, ...f } = a;
              return Object.entries(f).every(C => {
                let [c, r] = C;
                return Array.isArray(r) ? r.includes({ ...d, ...v }[c]) : { ...d, ...v }[c] === r;
              })
                ? [...t, s, i]
                : t;
            }, []);
    return y(e, N, V, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  };
export { j as c };
//# sourceMappingURL=index-bf785725.js.map
