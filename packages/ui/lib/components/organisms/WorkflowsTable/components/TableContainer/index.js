import { jsx as r } from 'react/jsx-runtime';
import { a } from '../../../../../ctw-6a823672.js';
function t({ children: o, isFetching: e }) {
  return /* @__PURE__ */ r('div', {
    className: a('relative w-full overflow-auto bg-white', 'h-full  rounded-md border', {
      'opacity-40': e,
      'pointer-events-none': e,
    }),
    children: o,
  });
}
t.displayName = 'TableContainer';
export { t as TableContainer };
