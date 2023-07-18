import { forwardRef as w, createElement as a } from 'react';
var p = {
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
const m = e => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  h = (e, s) => {
    const r = w(
      ({ color: n = 'currentColor', size: o = 24, strokeWidth: i = 2, children: t, ...c }, l) =>
        a(
          'svg',
          {
            ref: l,
            ...p,
            width: o,
            height: o,
            stroke: n,
            strokeWidth: i,
            className: `lucide lucide-${m(e)}`,
            ...c,
          },
          [...s.map(([u, d]) => a(u, d)), ...((Array.isArray(t) ? t : [t]) || [])],
        ),
    );
    return (r.displayName = `${e}`), r;
  };
export { h as c };
