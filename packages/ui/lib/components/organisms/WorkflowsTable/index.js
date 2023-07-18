import { jsx as S, jsxs as wt } from 'react/jsx-runtime';
import {
  T as nn,
  e as rn,
  b as ae,
  d as on,
  a as an,
  c as Ne,
} from '../../../TableHeader-fa2a2a43.js';
import * as _e from 'react';
import { useMemo as ln } from 'react';
import { getWorkflowHealthStatus as sn } from './utils/get-workflow-health-status.js';
import { formatDate as Ge } from './utils/format-date.js';
import { DataTableColumnHeader as O } from './components/DataTableColumnHeader/index.js';
import { HealthIndicator as un } from '../../atoms/HealthIndicator/index.js';
import { JsonDialog as gn } from './components/JsonDialog/index.js';
import { c as B, g as dn } from '../../../_commonjsHelpers-10dfc225.js';
import { mergeColumns as cn } from './utils/merge-columns.js';
import { TableContainer as fn } from './components/TableContainer/index.js';
import { ScrollContainer as pn } from './components/ScrollContainer/index.js';
import '../../../ctw-6a823672.js';
import './utils/calculate-hour-difference.js';
import '../../../workflow-health-status-39d1eb5a.js';
import '../../atoms/Button/index.js';
import '../../../index.module-4fc81c69.js';
import '../../../extends-70f3d2a3.js';
import '../../../index-177aa058.js';
import '../../atoms/Dropdown/index.js';
import 'react-dom';
import '../../../index-cbc375f1.js';
import '../../../createLucideIcon-6839730e.js';
import '../../atoms/Dialog/index.js';
import '../../../index.module-e6352d52.js';
import '../../../index.module-06df6ed9.js';
import '../../atoms/ScrollArea/index.js';
/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function V(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function R(e, t) {
  return n => {
    t.setState(r => ({
      ...r,
      [e]: V(n, r[e]),
    }));
  };
}
function W(e) {
  return e instanceof Function;
}
function vn(e) {
  return Array.isArray(e) && e.every(t => typeof t == 'number');
}
function _n(e, t) {
  const n = [],
    r = o => {
      o.forEach(i => {
        n.push(i);
        const a = t(i);
        a != null && a.length && r(a);
      });
    };
  return r(e), n;
}
function _(e, t, n) {
  let r = [],
    o;
  return () => {
    let i;
    n.key && n.debug && (i = Date.now());
    const a = e();
    if (!(a.length !== r.length || a.some((g, u) => r[u] !== g))) return o;
    r = a;
    let l;
    if (
      (n.key && n.debug && (l = Date.now()),
      (o = t(...a)),
      n == null || n.onChange == null || n.onChange(o),
      n.key && n.debug && n != null && n.debug())
    ) {
      const g = Math.round((Date.now() - i) * 100) / 100,
        u = Math.round((Date.now() - l) * 100) / 100,
        d = u / 16,
        c = (f, v) => {
          for (f = String(f); f.length < v; ) f = ' ' + f;
          return f;
        };
      console.info(
        `%c⏱ ${c(u, 5)} /${c(g, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * d, 120))}deg 100% 31%);`,
        n == null ? void 0 : n.key,
      );
    }
    return o;
  };
}
function mn(e, t, n, r) {
  var o, i;
  const s = {
      ...e._getDefaultColumnDef(),
      ...t,
    },
    l = s.accessorKey;
  let g =
      (o = (i = s.id) != null ? i : l ? l.replace('.', '_') : void 0) != null
        ? o
        : typeof s.header == 'string'
        ? s.header
        : void 0,
    u;
  if (
    (s.accessorFn
      ? (u = s.accessorFn)
      : l &&
        (l.includes('.')
          ? (u = c => {
              let f = c;
              for (const p of l.split('.')) {
                var v;
                (f = (v = f) == null ? void 0 : v[p]),
                  process.env.NODE_ENV !== 'production' &&
                    f === void 0 &&
                    console.warn(`"${p}" in deeply nested key "${l}" returned undefined.`);
              }
              return f;
            })
          : (u = c => c[s.accessorKey])),
    !g)
  )
    throw process.env.NODE_ENV !== 'production'
      ? new Error(
          s.accessorFn
            ? 'Columns require an id when using an accessorFn'
            : 'Columns require an id when using a non-string header',
        )
      : new Error();
  let d = {
    id: `${String(g)}`,
    accessorFn: u,
    parent: r,
    depth: n,
    columnDef: s,
    columns: [],
    getFlatColumns: _(
      () => [!0],
      () => {
        var c;
        return [d, ...((c = d.columns) == null ? void 0 : c.flatMap(f => f.getFlatColumns()))];
      },
      {
        key: process.env.NODE_ENV === 'production' && 'column.getFlatColumns',
        debug: () => {
          var c;
          return (c = e.options.debugAll) != null ? c : e.options.debugColumns;
        },
      },
    ),
    getLeafColumns: _(
      () => [e._getOrderColumnsFn()],
      c => {
        var f;
        if ((f = d.columns) != null && f.length) {
          let v = d.columns.flatMap(p => p.getLeafColumns());
          return c(v);
        }
        return [d];
      },
      {
        key: process.env.NODE_ENV === 'production' && 'column.getLeafColumns',
        debug: () => {
          var c;
          return (c = e.options.debugAll) != null ? c : e.options.debugColumns;
        },
      },
    ),
  };
  return (
    (d = e._features.reduce(
      (c, f) => Object.assign(c, f.createColumn == null ? void 0 : f.createColumn(d, e)),
      d,
    )),
    d
  );
}
function Le(e, t, n) {
  var r;
  let i = {
    id: (r = n.id) != null ? r : t.id,
    column: t,
    index: n.index,
    isPlaceholder: !!n.isPlaceholder,
    placeholderId: n.placeholderId,
    depth: n.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const a = [],
        s = l => {
          l.subHeaders && l.subHeaders.length && l.subHeaders.map(s), a.push(l);
        };
      return s(i), a;
    },
    getContext: () => ({
      table: e,
      header: i,
      column: t,
    }),
  };
  return (
    e._features.forEach(a => {
      Object.assign(i, a.createHeader == null ? void 0 : a.createHeader(i, e));
    }),
    i
  );
}
const hn = {
  createTable: e => ({
    // Header Groups
    getHeaderGroups: _(
      () => [
        e.getAllColumns(),
        e.getVisibleLeafColumns(),
        e.getState().columnPinning.left,
        e.getState().columnPinning.right,
      ],
      (t, n, r, o) => {
        var i, a;
        const s =
            (i = r == null ? void 0 : r.map(d => n.find(c => c.id === d)).filter(Boolean)) != null
              ? i
              : [],
          l =
            (a = o == null ? void 0 : o.map(d => n.find(c => c.id === d)).filter(Boolean)) != null
              ? a
              : [],
          g = n.filter(d => !(r != null && r.includes(d.id)) && !(o != null && o.includes(d.id)));
        return q(t, [...s, ...g, ...l], e);
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getHeaderGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getCenterHeaderGroups: _(
      () => [
        e.getAllColumns(),
        e.getVisibleLeafColumns(),
        e.getState().columnPinning.left,
        e.getState().columnPinning.right,
      ],
      (t, n, r, o) => (
        (n = n.filter(i => !(r != null && r.includes(i.id)) && !(o != null && o.includes(i.id)))),
        q(t, n, e, 'center')
      ),
      {
        key: process.env.NODE_ENV === 'development' && 'getCenterHeaderGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getLeftHeaderGroups: _(
      () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left],
      (t, n, r) => {
        var o;
        const i =
          (o = r == null ? void 0 : r.map(a => n.find(s => s.id === a)).filter(Boolean)) != null
            ? o
            : [];
        return q(t, i, e, 'left');
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getLeftHeaderGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getRightHeaderGroups: _(
      () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.right],
      (t, n, r) => {
        var o;
        const i =
          (o = r == null ? void 0 : r.map(a => n.find(s => s.id === a)).filter(Boolean)) != null
            ? o
            : [];
        return q(t, i, e, 'right');
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getRightHeaderGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    // Footer Groups
    getFooterGroups: _(
      () => [e.getHeaderGroups()],
      t => [...t].reverse(),
      {
        key: process.env.NODE_ENV === 'development' && 'getFooterGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getLeftFooterGroups: _(
      () => [e.getLeftHeaderGroups()],
      t => [...t].reverse(),
      {
        key: process.env.NODE_ENV === 'development' && 'getLeftFooterGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getCenterFooterGroups: _(
      () => [e.getCenterHeaderGroups()],
      t => [...t].reverse(),
      {
        key: process.env.NODE_ENV === 'development' && 'getCenterFooterGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getRightFooterGroups: _(
      () => [e.getRightHeaderGroups()],
      t => [...t].reverse(),
      {
        key: process.env.NODE_ENV === 'development' && 'getRightFooterGroups',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    // Flat Headers
    getFlatHeaders: _(
      () => [e.getHeaderGroups()],
      t => t.map(n => n.headers).flat(),
      {
        key: process.env.NODE_ENV === 'development' && 'getFlatHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getLeftFlatHeaders: _(
      () => [e.getLeftHeaderGroups()],
      t => t.map(n => n.headers).flat(),
      {
        key: process.env.NODE_ENV === 'development' && 'getLeftFlatHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getCenterFlatHeaders: _(
      () => [e.getCenterHeaderGroups()],
      t => t.map(n => n.headers).flat(),
      {
        key: process.env.NODE_ENV === 'development' && 'getCenterFlatHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getRightFlatHeaders: _(
      () => [e.getRightHeaderGroups()],
      t => t.map(n => n.headers).flat(),
      {
        key: process.env.NODE_ENV === 'development' && 'getRightFlatHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    // Leaf Headers
    getCenterLeafHeaders: _(
      () => [e.getCenterFlatHeaders()],
      t =>
        t.filter(n => {
          var r;
          return !((r = n.subHeaders) != null && r.length);
        }),
      {
        key: process.env.NODE_ENV === 'development' && 'getCenterLeafHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getLeftLeafHeaders: _(
      () => [e.getLeftFlatHeaders()],
      t =>
        t.filter(n => {
          var r;
          return !((r = n.subHeaders) != null && r.length);
        }),
      {
        key: process.env.NODE_ENV === 'development' && 'getLeftLeafHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getRightLeafHeaders: _(
      () => [e.getRightFlatHeaders()],
      t =>
        t.filter(n => {
          var r;
          return !((r = n.subHeaders) != null && r.length);
        }),
      {
        key: process.env.NODE_ENV === 'development' && 'getRightLeafHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
    getLeafHeaders: _(
      () => [e.getLeftHeaderGroups(), e.getCenterHeaderGroups(), e.getRightHeaderGroups()],
      (t, n, r) => {
        var o, i, a, s, l, g;
        return [
          ...((o = (i = t[0]) == null ? void 0 : i.headers) != null ? o : []),
          ...((a = (s = n[0]) == null ? void 0 : s.headers) != null ? a : []),
          ...((l = (g = r[0]) == null ? void 0 : g.headers) != null ? l : []),
        ]
          .map(u => u.getLeafHeaders())
          .flat();
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getLeafHeaders',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugHeaders;
        },
      },
    ),
  }),
};
function q(e, t, n, r) {
  var o, i;
  let a = 0;
  const s = function (c, f) {
    f === void 0 && (f = 1),
      (a = Math.max(a, f)),
      c
        .filter(v => v.getIsVisible())
        .forEach(v => {
          var p;
          (p = v.columns) != null && p.length && s(v.columns, f + 1);
        }, 0);
  };
  s(e);
  let l = [];
  const g = (c, f) => {
      const v = {
          depth: f,
          id: [r, `${f}`].filter(Boolean).join('_'),
          headers: [],
        },
        p = [];
      c.forEach(m => {
        const h = [...p].reverse()[0],
          C = m.column.depth === v.depth;
        let w,
          y = !1;
        if (
          (C && m.column.parent ? (w = m.column.parent) : ((w = m.column), (y = !0)),
          h && (h == null ? void 0 : h.column) === w)
        )
          h.subHeaders.push(m);
        else {
          const b = Le(n, w, {
            id: [r, f, w.id, m == null ? void 0 : m.id].filter(Boolean).join('_'),
            isPlaceholder: y,
            placeholderId: y ? `${p.filter(ie => ie.column === w).length}` : void 0,
            depth: f,
            index: p.length,
          });
          b.subHeaders.push(m), p.push(b);
        }
        v.headers.push(m), (m.headerGroup = v);
      }),
        l.push(v),
        f > 0 && g(p, f - 1);
    },
    u = t.map((c, f) =>
      Le(n, c, {
        depth: a,
        index: f,
      }),
    );
  g(u, a - 1), l.reverse();
  const d = c =>
    c
      .filter(v => v.column.getIsVisible())
      .map(v => {
        let p = 0,
          m = 0,
          h = [0];
        v.subHeaders && v.subHeaders.length
          ? ((h = []),
            d(v.subHeaders).forEach(w => {
              let { colSpan: y, rowSpan: b } = w;
              (p += y), h.push(b);
            }))
          : (p = 1);
        const C = Math.min(...h);
        return (
          (m = m + C),
          (v.colSpan = p),
          (v.rowSpan = m),
          {
            colSpan: p,
            rowSpan: m,
          }
        );
      });
  return d((o = (i = l[0]) == null ? void 0 : i.headers) != null ? o : []), l;
}
const K = {
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER,
  },
  le = () => ({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: !1,
    columnSizingStart: [],
  }),
  $n = {
    getDefaultColumnDef: () => K,
    getInitialState: e => ({
      columnSizing: {},
      columnSizingInfo: le(),
      ...e,
    }),
    getDefaultOptions: e => ({
      columnResizeMode: 'onEnd',
      onColumnSizingChange: R('columnSizing', e),
      onColumnSizingInfoChange: R('columnSizingInfo', e),
    }),
    createColumn: (e, t) => ({
      getSize: () => {
        var n, r, o;
        const i = t.getState().columnSizing[e.id];
        return Math.min(
          Math.max(
            (n = e.columnDef.minSize) != null ? n : K.minSize,
            (r = i ?? e.columnDef.size) != null ? r : K.size,
          ),
          (o = e.columnDef.maxSize) != null ? o : K.maxSize,
        );
      },
      getStart: n => {
        const r = n
            ? n === 'left'
              ? t.getLeftVisibleLeafColumns()
              : t.getRightVisibleLeafColumns()
            : t.getVisibleLeafColumns(),
          o = r.findIndex(i => i.id === e.id);
        if (o > 0) {
          const i = r[o - 1];
          return i.getStart(n) + i.getSize();
        }
        return 0;
      },
      resetSize: () => {
        t.setColumnSizing(n => {
          let { [e.id]: r, ...o } = n;
          return o;
        });
      },
      getCanResize: () => {
        var n, r;
        return (
          ((n = e.columnDef.enableResizing) != null ? n : !0) &&
          ((r = t.options.enableColumnResizing) != null ? r : !0)
        );
      },
      getIsResizing: () => t.getState().columnSizingInfo.isResizingColumn === e.id,
    }),
    createHeader: (e, t) => ({
      getSize: () => {
        let n = 0;
        const r = o => {
          if (o.subHeaders.length) o.subHeaders.forEach(r);
          else {
            var i;
            n += (i = o.column.getSize()) != null ? i : 0;
          }
        };
        return r(e), n;
      },
      getStart: () => {
        if (e.index > 0) {
          const n = e.headerGroup.headers[e.index - 1];
          return n.getStart() + n.getSize();
        }
        return 0;
      },
      getResizeHandler: () => {
        const n = t.getColumn(e.column.id),
          r = n == null ? void 0 : n.getCanResize();
        return o => {
          if (
            !n ||
            !r ||
            (o.persist == null || o.persist(), se(o) && o.touches && o.touches.length > 1)
          )
            return;
          const i = e.getSize(),
            a = e
              ? e.getLeafHeaders().map(p => [p.column.id, p.column.getSize()])
              : [[n.id, n.getSize()]],
            s = se(o) ? Math.round(o.touches[0].clientX) : o.clientX,
            l = {},
            g = (p, m) => {
              typeof m == 'number' &&
                (t.setColumnSizingInfo(h => {
                  var C, w;
                  const y = m - ((C = h == null ? void 0 : h.startOffset) != null ? C : 0),
                    b = Math.max(
                      y / ((w = h == null ? void 0 : h.startSize) != null ? w : 0),
                      -0.999999,
                    );
                  return (
                    h.columnSizingStart.forEach(ie => {
                      let [tn, He] = ie;
                      l[tn] = Math.round(Math.max(He + He * b, 0) * 100) / 100;
                    }),
                    {
                      ...h,
                      deltaOffset: y,
                      deltaPercentage: b,
                    }
                  );
                }),
                (t.options.columnResizeMode === 'onChange' || p === 'end') &&
                  t.setColumnSizing(h => ({
                    ...h,
                    ...l,
                  })));
            },
            u = p => g('move', p),
            d = p => {
              g('end', p),
                t.setColumnSizingInfo(m => ({
                  ...m,
                  isResizingColumn: !1,
                  startOffset: null,
                  startSize: null,
                  deltaOffset: null,
                  deltaPercentage: null,
                  columnSizingStart: [],
                }));
            },
            c = {
              moveHandler: p => u(p.clientX),
              upHandler: p => {
                document.removeEventListener('mousemove', c.moveHandler),
                  document.removeEventListener('mouseup', c.upHandler),
                  d(p.clientX);
              },
            },
            f = {
              moveHandler: p => (
                p.cancelable && (p.preventDefault(), p.stopPropagation()),
                u(p.touches[0].clientX),
                !1
              ),
              upHandler: p => {
                var m;
                document.removeEventListener('touchmove', f.moveHandler),
                  document.removeEventListener('touchend', f.upHandler),
                  p.cancelable && (p.preventDefault(), p.stopPropagation()),
                  d((m = p.touches[0]) == null ? void 0 : m.clientX);
              },
            },
            v = Sn()
              ? {
                  passive: !1,
                }
              : !1;
          se(o)
            ? (document.addEventListener('touchmove', f.moveHandler, v),
              document.addEventListener('touchend', f.upHandler, v))
            : (document.addEventListener('mousemove', c.moveHandler, v),
              document.addEventListener('mouseup', c.upHandler, v)),
            t.setColumnSizingInfo(p => ({
              ...p,
              startOffset: s,
              startSize: i,
              deltaOffset: 0,
              deltaPercentage: 0,
              columnSizingStart: a,
              isResizingColumn: n.id,
            }));
        };
      },
    }),
    createTable: e => ({
      setColumnSizing: t =>
        e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(t),
      setColumnSizingInfo: t =>
        e.options.onColumnSizingInfoChange == null ? void 0 : e.options.onColumnSizingInfoChange(t),
      resetColumnSizing: t => {
        var n;
        e.setColumnSizing(t ? {} : (n = e.initialState.columnSizing) != null ? n : {});
      },
      resetHeaderSizeInfo: t => {
        var n;
        e.setColumnSizingInfo(t ? le() : (n = e.initialState.columnSizingInfo) != null ? n : le());
      },
      getTotalSize: () => {
        var t, n;
        return (t =
          (n = e.getHeaderGroups()[0]) == null
            ? void 0
            : n.headers.reduce((r, o) => r + o.getSize(), 0)) != null
          ? t
          : 0;
      },
      getLeftTotalSize: () => {
        var t, n;
        return (t =
          (n = e.getLeftHeaderGroups()[0]) == null
            ? void 0
            : n.headers.reduce((r, o) => r + o.getSize(), 0)) != null
          ? t
          : 0;
      },
      getCenterTotalSize: () => {
        var t, n;
        return (t =
          (n = e.getCenterHeaderGroups()[0]) == null
            ? void 0
            : n.headers.reduce((r, o) => r + o.getSize(), 0)) != null
          ? t
          : 0;
      },
      getRightTotalSize: () => {
        var t, n;
        return (t =
          (n = e.getRightHeaderGroups()[0]) == null
            ? void 0
            : n.headers.reduce((r, o) => r + o.getSize(), 0)) != null
          ? t
          : 0;
      },
    }),
  };
let U = null;
function Sn() {
  if (typeof U == 'boolean') return U;
  let e = !1;
  try {
    const t = {
        get passive() {
          return (e = !0), !1;
        },
      },
      n = () => {};
    window.addEventListener('test', n, t), window.removeEventListener('test', n);
  } catch {
    e = !1;
  }
  return (U = e), U;
}
function se(e) {
  return e.type === 'touchstart';
}
const Cn = {
    getInitialState: e => ({
      expanded: {},
      ...e,
    }),
    getDefaultOptions: e => ({
      onExpandedChange: R('expanded', e),
      paginateExpandedRows: !0,
    }),
    createTable: e => {
      let t = !1,
        n = !1;
      return {
        _autoResetExpanded: () => {
          var r, o;
          if (!t) {
            e._queue(() => {
              t = !0;
            });
            return;
          }
          if (
            (r = (o = e.options.autoResetAll) != null ? o : e.options.autoResetExpanded) != null
              ? r
              : !e.options.manualExpanding
          ) {
            if (n) return;
            (n = !0),
              e._queue(() => {
                e.resetExpanded(), (n = !1);
              });
          }
        },
        setExpanded: r =>
          e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(r),
        toggleAllRowsExpanded: r => {
          r ?? !e.getIsAllRowsExpanded() ? e.setExpanded(!0) : e.setExpanded({});
        },
        resetExpanded: r => {
          var o, i;
          e.setExpanded(
            r ? {} : (o = (i = e.initialState) == null ? void 0 : i.expanded) != null ? o : {},
          );
        },
        getCanSomeRowsExpand: () =>
          e.getPrePaginationRowModel().flatRows.some(r => r.getCanExpand()),
        getToggleAllRowsExpandedHandler: () => r => {
          r.persist == null || r.persist(), e.toggleAllRowsExpanded();
        },
        getIsSomeRowsExpanded: () => {
          const r = e.getState().expanded;
          return r === !0 || Object.values(r).some(Boolean);
        },
        getIsAllRowsExpanded: () => {
          const r = e.getState().expanded;
          return typeof r == 'boolean'
            ? r === !0
            : !(!Object.keys(r).length || e.getRowModel().flatRows.some(o => !o.getIsExpanded()));
        },
        getExpandedDepth: () => {
          let r = 0;
          return (
            (e.getState().expanded === !0
              ? Object.keys(e.getRowModel().rowsById)
              : Object.keys(e.getState().expanded)
            ).forEach(i => {
              const a = i.split('.');
              r = Math.max(r, a.length);
            }),
            r
          );
        },
        getPreExpandedRowModel: () => e.getSortedRowModel(),
        getExpandedRowModel: () => (
          !e._getExpandedRowModel &&
            e.options.getExpandedRowModel &&
            (e._getExpandedRowModel = e.options.getExpandedRowModel(e)),
          e.options.manualExpanding || !e._getExpandedRowModel
            ? e.getPreExpandedRowModel()
            : e._getExpandedRowModel()
        ),
      };
    },
    createRow: (e, t) => ({
      toggleExpanded: n => {
        t.setExpanded(r => {
          var o;
          const i = r === !0 ? !0 : !!(r != null && r[e.id]);
          let a = {};
          if (
            (r === !0
              ? Object.keys(t.getRowModel().rowsById).forEach(s => {
                  a[s] = !0;
                })
              : (a = r),
            (n = (o = n) != null ? o : !i),
            !i && n)
          )
            return {
              ...a,
              [e.id]: !0,
            };
          if (i && !n) {
            const { [e.id]: s, ...l } = a;
            return l;
          }
          return r;
        });
      },
      getIsExpanded: () => {
        var n;
        const r = t.getState().expanded;
        return !!((n =
          t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(e)) != null
          ? n
          : r === !0 || (r != null && r[e.id]));
      },
      getCanExpand: () => {
        var n, r, o;
        return (n = t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(e)) !=
          null
          ? n
          : ((r = t.options.enableExpanding) != null ? r : !0) &&
              !!((o = e.subRows) != null && o.length);
      },
      getToggleExpandedHandler: () => {
        const n = e.getCanExpand();
        return () => {
          n && e.toggleExpanded();
        };
      },
    }),
  },
  yt = (e, t, n) => {
    var r, o, i;
    const a = n.toLowerCase();
    return !!(
      !(
        (r = e.getValue(t)) == null ||
        (o = r.toString()) == null ||
        (i = o.toLowerCase()) == null
      ) && i.includes(a)
    );
  };
yt.autoRemove = e => A(e);
const bt = (e, t, n) => {
  var r, o;
  return !!(!((r = e.getValue(t)) == null || (o = r.toString()) == null) && o.includes(n));
};
bt.autoRemove = e => A(e);
const Rt = (e, t, n) => {
  var r, o;
  return (
    ((r = e.getValue(t)) == null || (o = r.toString()) == null ? void 0 : o.toLowerCase()) ===
    (n == null ? void 0 : n.toLowerCase())
  );
};
Rt.autoRemove = e => A(e);
const At = (e, t, n) => {
  var r;
  return (r = e.getValue(t)) == null ? void 0 : r.includes(n);
};
At.autoRemove = e => A(e) || !(e != null && e.length);
const Ft = (e, t, n) =>
  !n.some(r => {
    var o;
    return !((o = e.getValue(t)) != null && o.includes(r));
  });
Ft.autoRemove = e => A(e) || !(e != null && e.length);
const Et = (e, t, n) =>
  n.some(r => {
    var o;
    return (o = e.getValue(t)) == null ? void 0 : o.includes(r);
  });
Et.autoRemove = e => A(e) || !(e != null && e.length);
const Mt = (e, t, n) => e.getValue(t) === n;
Mt.autoRemove = e => A(e);
const Vt = (e, t, n) => e.getValue(t) == n;
Vt.autoRemove = e => A(e);
const Ae = (e, t, n) => {
  let [r, o] = n;
  const i = e.getValue(t);
  return i >= r && i <= o;
};
Ae.resolveFilterValue = e => {
  let [t, n] = e,
    r = typeof t != 'number' ? parseFloat(t) : t,
    o = typeof n != 'number' ? parseFloat(n) : n,
    i = t === null || Number.isNaN(r) ? -1 / 0 : r,
    a = n === null || Number.isNaN(o) ? 1 / 0 : o;
  if (i > a) {
    const s = i;
    (i = a), (a = s);
  }
  return [i, a];
};
Ae.autoRemove = e => A(e) || (A(e[0]) && A(e[1]));
const F = {
  includesString: yt,
  includesStringSensitive: bt,
  equalsString: Rt,
  arrIncludes: At,
  arrIncludesAll: Ft,
  arrIncludesSome: Et,
  equals: Mt,
  weakEquals: Vt,
  inNumberRange: Ae,
};
function A(e) {
  return e == null || e === '';
}
const wn = {
  getDefaultColumnDef: () => ({
    filterFn: 'auto',
  }),
  getInitialState: e => ({
    columnFilters: [],
    globalFilter: void 0,
    // filtersProgress: 1,
    // facetProgress: {},
    ...e,
  }),
  getDefaultOptions: e => ({
    onColumnFiltersChange: R('columnFilters', e),
    onGlobalFilterChange: R('globalFilter', e),
    filterFromLeafRows: !1,
    maxLeafRowFilterDepth: 100,
    globalFilterFn: 'auto',
    getColumnCanGlobalFilter: t => {
      var n, r;
      const o =
        (n = e.getCoreRowModel().flatRows[0]) == null ||
        (r = n._getAllCellsByColumnId()[t.id]) == null
          ? void 0
          : r.getValue();
      return typeof o == 'string' || typeof o == 'number';
    },
  }),
  createColumn: (e, t) => ({
    getAutoFilterFn: () => {
      const n = t.getCoreRowModel().flatRows[0],
        r = n == null ? void 0 : n.getValue(e.id);
      return typeof r == 'string'
        ? F.includesString
        : typeof r == 'number'
        ? F.inNumberRange
        : typeof r == 'boolean' || (r !== null && typeof r == 'object')
        ? F.equals
        : Array.isArray(r)
        ? F.arrIncludes
        : F.weakEquals;
    },
    getFilterFn: () => {
      var n, r;
      return W(e.columnDef.filterFn)
        ? e.columnDef.filterFn
        : e.columnDef.filterFn === 'auto'
        ? e.getAutoFilterFn()
        : (n = (r = t.options.filterFns) == null ? void 0 : r[e.columnDef.filterFn]) != null
        ? n
        : F[e.columnDef.filterFn];
    },
    getCanFilter: () => {
      var n, r, o;
      return (
        ((n = e.columnDef.enableColumnFilter) != null ? n : !0) &&
        ((r = t.options.enableColumnFilters) != null ? r : !0) &&
        ((o = t.options.enableFilters) != null ? o : !0) &&
        !!e.accessorFn
      );
    },
    getCanGlobalFilter: () => {
      var n, r, o, i;
      return (
        ((n = e.columnDef.enableGlobalFilter) != null ? n : !0) &&
        ((r = t.options.enableGlobalFilter) != null ? r : !0) &&
        ((o = t.options.enableFilters) != null ? o : !0) &&
        ((i =
          t.options.getColumnCanGlobalFilter == null
            ? void 0
            : t.options.getColumnCanGlobalFilter(e)) != null
          ? i
          : !0) &&
        !!e.accessorFn
      );
    },
    getIsFiltered: () => e.getFilterIndex() > -1,
    getFilterValue: () => {
      var n, r;
      return (n = t.getState().columnFilters) == null || (r = n.find(o => o.id === e.id)) == null
        ? void 0
        : r.value;
    },
    getFilterIndex: () => {
      var n, r;
      return (n =
        (r = t.getState().columnFilters) == null ? void 0 : r.findIndex(o => o.id === e.id)) != null
        ? n
        : -1;
    },
    setFilterValue: n => {
      t.setColumnFilters(r => {
        const o = e.getFilterFn(),
          i = r == null ? void 0 : r.find(u => u.id === e.id),
          a = V(n, i ? i.value : void 0);
        if (ze(o, a, e)) {
          var s;
          return (s = r == null ? void 0 : r.filter(u => u.id !== e.id)) != null ? s : [];
        }
        const l = {
          id: e.id,
          value: a,
        };
        if (i) {
          var g;
          return (g = r == null ? void 0 : r.map(u => (u.id === e.id ? l : u))) != null ? g : [];
        }
        return r != null && r.length ? [...r, l] : [l];
      });
    },
    _getFacetedRowModel: t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id),
    getFacetedRowModel: () =>
      e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel(),
    _getFacetedUniqueValues:
      t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id),
    getFacetedUniqueValues: () =>
      e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : /* @__PURE__ */ new Map(),
    _getFacetedMinMaxValues:
      t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id),
    getFacetedMinMaxValues: () => {
      if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues();
    },
    // () => [column.getFacetedRowModel()],
    // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
  }),
  createRow: (e, t) => ({
    columnFilters: {},
    columnFiltersMeta: {},
  }),
  createTable: e => ({
    getGlobalAutoFilterFn: () => F.includesString,
    getGlobalFilterFn: () => {
      var t, n;
      const { globalFilterFn: r } = e.options;
      return W(r)
        ? r
        : r === 'auto'
        ? e.getGlobalAutoFilterFn()
        : (t = (n = e.options.filterFns) == null ? void 0 : n[r]) != null
        ? t
        : F[r];
    },
    setColumnFilters: t => {
      const n = e.getAllLeafColumns(),
        r = o => {
          var i;
          return (i = V(t, o)) == null
            ? void 0
            : i.filter(a => {
                const s = n.find(l => l.id === a.id);
                if (s) {
                  const l = s.getFilterFn();
                  if (ze(l, a.value, s)) return !1;
                }
                return !0;
              });
        };
      e.options.onColumnFiltersChange == null || e.options.onColumnFiltersChange(r);
    },
    setGlobalFilter: t => {
      e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(t);
    },
    resetGlobalFilter: t => {
      e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter);
    },
    resetColumnFilters: t => {
      var n, r;
      e.setColumnFilters(
        t ? [] : (n = (r = e.initialState) == null ? void 0 : r.columnFilters) != null ? n : [],
      );
    },
    getPreFilteredRowModel: () => e.getCoreRowModel(),
    getFilteredRowModel: () => (
      !e._getFilteredRowModel &&
        e.options.getFilteredRowModel &&
        (e._getFilteredRowModel = e.options.getFilteredRowModel(e)),
      e.options.manualFiltering || !e._getFilteredRowModel
        ? e.getPreFilteredRowModel()
        : e._getFilteredRowModel()
    ),
    _getGlobalFacetedRowModel:
      e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, '__global__'),
    getGlobalFacetedRowModel: () =>
      e.options.manualFiltering || !e._getGlobalFacetedRowModel
        ? e.getPreFilteredRowModel()
        : e._getGlobalFacetedRowModel(),
    _getGlobalFacetedUniqueValues:
      e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, '__global__'),
    getGlobalFacetedUniqueValues: () =>
      e._getGlobalFacetedUniqueValues
        ? e._getGlobalFacetedUniqueValues()
        : /* @__PURE__ */ new Map(),
    _getGlobalFacetedMinMaxValues:
      e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, '__global__'),
    getGlobalFacetedMinMaxValues: () => {
      if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues();
    },
  }),
};
function ze(e, t, n) {
  return (
    (e && e.autoRemove ? e.autoRemove(t, n) : !1) || typeof t > 'u' || (typeof t == 'string' && !t)
  );
}
const yn = (e, t, n) =>
    n.reduce((r, o) => {
      const i = o.getValue(e);
      return r + (typeof i == 'number' ? i : 0);
    }, 0),
  bn = (e, t, n) => {
    let r;
    return (
      n.forEach(o => {
        const i = o.getValue(e);
        i != null && (r > i || (r === void 0 && i >= i)) && (r = i);
      }),
      r
    );
  },
  Rn = (e, t, n) => {
    let r;
    return (
      n.forEach(o => {
        const i = o.getValue(e);
        i != null && (r < i || (r === void 0 && i >= i)) && (r = i);
      }),
      r
    );
  },
  An = (e, t, n) => {
    let r, o;
    return (
      n.forEach(i => {
        const a = i.getValue(e);
        a != null && (r === void 0 ? a >= a && (r = o = a) : (r > a && (r = a), o < a && (o = a)));
      }),
      [r, o]
    );
  },
  Fn = (e, t) => {
    let n = 0,
      r = 0;
    if (
      (t.forEach(o => {
        let i = o.getValue(e);
        i != null && (i = +i) >= i && (++n, (r += i));
      }),
      n)
    )
      return r / n;
  },
  En = (e, t) => {
    if (!t.length) return;
    const n = t.map(i => i.getValue(e));
    if (!vn(n)) return;
    if (n.length === 1) return n[0];
    const r = Math.floor(n.length / 2),
      o = n.sort((i, a) => i - a);
    return n.length % 2 !== 0 ? o[r] : (o[r - 1] + o[r]) / 2;
  },
  Mn = (e, t) => Array.from(new Set(t.map(n => n.getValue(e))).values()),
  Vn = (e, t) => new Set(t.map(n => n.getValue(e))).size,
  Pn = (e, t) => t.length,
  ue = {
    sum: yn,
    min: bn,
    max: Rn,
    extent: An,
    mean: Fn,
    median: En,
    unique: Mn,
    uniqueCount: Vn,
    count: Pn,
  },
  On = {
    getDefaultColumnDef: () => ({
      aggregatedCell: e => {
        var t, n;
        return (t = (n = e.getValue()) == null || n.toString == null ? void 0 : n.toString()) !=
          null
          ? t
          : null;
      },
      aggregationFn: 'auto',
    }),
    getInitialState: e => ({
      grouping: [],
      ...e,
    }),
    getDefaultOptions: e => ({
      onGroupingChange: R('grouping', e),
      groupedColumnMode: 'reorder',
    }),
    createColumn: (e, t) => ({
      toggleGrouping: () => {
        t.setGrouping(n =>
          n != null && n.includes(e.id) ? n.filter(r => r !== e.id) : [...(n ?? []), e.id],
        );
      },
      getCanGroup: () => {
        var n, r, o, i;
        return (n =
          (r =
            (o = (i = e.columnDef.enableGrouping) != null ? i : !0) != null
              ? o
              : t.options.enableGrouping) != null
            ? r
            : !0) != null
          ? n
          : !!e.accessorFn;
      },
      getIsGrouped: () => {
        var n;
        return (n = t.getState().grouping) == null ? void 0 : n.includes(e.id);
      },
      getGroupedIndex: () => {
        var n;
        return (n = t.getState().grouping) == null ? void 0 : n.indexOf(e.id);
      },
      getToggleGroupingHandler: () => {
        const n = e.getCanGroup();
        return () => {
          n && e.toggleGrouping();
        };
      },
      getAutoAggregationFn: () => {
        const n = t.getCoreRowModel().flatRows[0],
          r = n == null ? void 0 : n.getValue(e.id);
        if (typeof r == 'number') return ue.sum;
        if (Object.prototype.toString.call(r) === '[object Date]') return ue.extent;
      },
      getAggregationFn: () => {
        var n, r;
        if (!e) throw new Error();
        return W(e.columnDef.aggregationFn)
          ? e.columnDef.aggregationFn
          : e.columnDef.aggregationFn === 'auto'
          ? e.getAutoAggregationFn()
          : (n = (r = t.options.aggregationFns) == null ? void 0 : r[e.columnDef.aggregationFn]) !=
            null
          ? n
          : ue[e.columnDef.aggregationFn];
      },
    }),
    createTable: e => ({
      setGrouping: t =>
        e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(t),
      resetGrouping: t => {
        var n, r;
        e.setGrouping(
          t ? [] : (n = (r = e.initialState) == null ? void 0 : r.grouping) != null ? n : [],
        );
      },
      getPreGroupedRowModel: () => e.getFilteredRowModel(),
      getGroupedRowModel: () => (
        !e._getGroupedRowModel &&
          e.options.getGroupedRowModel &&
          (e._getGroupedRowModel = e.options.getGroupedRowModel(e)),
        e.options.manualGrouping || !e._getGroupedRowModel
          ? e.getPreGroupedRowModel()
          : e._getGroupedRowModel()
      ),
    }),
    createRow: (e, t) => ({
      getIsGrouped: () => !!e.groupingColumnId,
      getGroupingValue: n => {
        if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n];
        const r = t.getColumn(n);
        return r != null && r.columnDef.getGroupingValue
          ? ((e._groupingValuesCache[n] = r.columnDef.getGroupingValue(e.original)),
            e._groupingValuesCache[n])
          : e.getValue(n);
      },
      _groupingValuesCache: {},
    }),
    createCell: (e, t, n, r) => ({
      getIsGrouped: () => t.getIsGrouped() && t.id === n.groupingColumnId,
      getIsPlaceholder: () => !e.getIsGrouped() && t.getIsGrouped(),
      getIsAggregated: () => {
        var o;
        return (
          !e.getIsGrouped() && !e.getIsPlaceholder() && !!((o = n.subRows) != null && o.length)
        );
      },
    }),
  };
function xn(e, t, n) {
  if (!(t != null && t.length) || !n) return e;
  const r = e.filter(i => !t.includes(i.id));
  return n === 'remove' ? r : [...t.map(i => e.find(a => a.id === i)).filter(Boolean), ...r];
}
const In = {
    getInitialState: e => ({
      columnOrder: [],
      ...e,
    }),
    getDefaultOptions: e => ({
      onColumnOrderChange: R('columnOrder', e),
    }),
    createTable: e => ({
      setColumnOrder: t =>
        e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(t),
      resetColumnOrder: t => {
        var n;
        e.setColumnOrder(t ? [] : (n = e.initialState.columnOrder) != null ? n : []);
      },
      _getOrderColumnsFn: _(
        () => [e.getState().columnOrder, e.getState().grouping, e.options.groupedColumnMode],
        (t, n, r) => o => {
          let i = [];
          if (!(t != null && t.length)) i = o;
          else {
            const a = [...t],
              s = [...o];
            for (; s.length && a.length; ) {
              const l = a.shift(),
                g = s.findIndex(u => u.id === l);
              g > -1 && i.push(s.splice(g, 1)[0]);
            }
            i = [...i, ...s];
          }
          return xn(i, n, r);
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getOrderColumnsFn',
          // debug: () => table.options.debugAll ?? table.options.debugTable,
        },
      ),
    }),
  },
  me = 0,
  he = 10,
  ge = () => ({
    pageIndex: me,
    pageSize: he,
  }),
  Dn = {
    getInitialState: e => ({
      ...e,
      pagination: {
        ...ge(),
        ...(e == null ? void 0 : e.pagination),
      },
    }),
    getDefaultOptions: e => ({
      onPaginationChange: R('pagination', e),
    }),
    createTable: e => {
      let t = !1,
        n = !1;
      return {
        _autoResetPageIndex: () => {
          var r, o;
          if (!t) {
            e._queue(() => {
              t = !0;
            });
            return;
          }
          if (
            (r = (o = e.options.autoResetAll) != null ? o : e.options.autoResetPageIndex) != null
              ? r
              : !e.options.manualPagination
          ) {
            if (n) return;
            (n = !0),
              e._queue(() => {
                e.resetPageIndex(), (n = !1);
              });
          }
        },
        setPagination: r => {
          const o = i => V(r, i);
          return e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange(o);
        },
        resetPagination: r => {
          var o;
          e.setPagination(r ? ge() : (o = e.initialState.pagination) != null ? o : ge());
        },
        setPageIndex: r => {
          e.setPagination(o => {
            let i = V(r, o.pageIndex);
            const a =
              typeof e.options.pageCount > 'u' || e.options.pageCount === -1
                ? Number.MAX_SAFE_INTEGER
                : e.options.pageCount - 1;
            return (
              (i = Math.max(0, Math.min(i, a))),
              {
                ...o,
                pageIndex: i,
              }
            );
          });
        },
        resetPageIndex: r => {
          var o, i, a;
          e.setPageIndex(
            r
              ? me
              : (o =
                  (i = e.initialState) == null || (a = i.pagination) == null
                    ? void 0
                    : a.pageIndex) != null
              ? o
              : me,
          );
        },
        resetPageSize: r => {
          var o, i, a;
          e.setPageSize(
            r
              ? he
              : (o =
                  (i = e.initialState) == null || (a = i.pagination) == null
                    ? void 0
                    : a.pageSize) != null
              ? o
              : he,
          );
        },
        setPageSize: r => {
          e.setPagination(o => {
            const i = Math.max(1, V(r, o.pageSize)),
              a = o.pageSize * o.pageIndex,
              s = Math.floor(a / i);
            return {
              ...o,
              pageIndex: s,
              pageSize: i,
            };
          });
        },
        setPageCount: r =>
          e.setPagination(o => {
            var i;
            let a = V(r, (i = e.options.pageCount) != null ? i : -1);
            return (
              typeof a == 'number' && (a = Math.max(-1, a)),
              {
                ...o,
                pageCount: a,
              }
            );
          }),
        getPageOptions: _(
          () => [e.getPageCount()],
          r => {
            let o = [];
            return r && r > 0 && (o = [...new Array(r)].fill(null).map((i, a) => a)), o;
          },
          {
            key: process.env.NODE_ENV === 'development' && 'getPageOptions',
            debug: () => {
              var r;
              return (r = e.options.debugAll) != null ? r : e.options.debugTable;
            },
          },
        ),
        getCanPreviousPage: () => e.getState().pagination.pageIndex > 0,
        getCanNextPage: () => {
          const { pageIndex: r } = e.getState().pagination,
            o = e.getPageCount();
          return o === -1 ? !0 : o === 0 ? !1 : r < o - 1;
        },
        previousPage: () => e.setPageIndex(r => r - 1),
        nextPage: () => e.setPageIndex(r => r + 1),
        getPrePaginationRowModel: () => e.getExpandedRowModel(),
        getPaginationRowModel: () => (
          !e._getPaginationRowModel &&
            e.options.getPaginationRowModel &&
            (e._getPaginationRowModel = e.options.getPaginationRowModel(e)),
          e.options.manualPagination || !e._getPaginationRowModel
            ? e.getPrePaginationRowModel()
            : e._getPaginationRowModel()
        ),
        getPageCount: () => {
          var r;
          return (r = e.options.pageCount) != null
            ? r
            : Math.ceil(
                e.getPrePaginationRowModel().rows.length / e.getState().pagination.pageSize,
              );
        },
      };
    },
  },
  de = () => ({
    left: [],
    right: [],
  }),
  Tn = {
    getInitialState: e => ({
      columnPinning: de(),
      ...e,
    }),
    getDefaultOptions: e => ({
      onColumnPinningChange: R('columnPinning', e),
    }),
    createColumn: (e, t) => ({
      pin: n => {
        const r = e
          .getLeafColumns()
          .map(o => o.id)
          .filter(Boolean);
        t.setColumnPinning(o => {
          var i, a;
          if (n === 'right') {
            var s, l;
            return {
              left: ((s = o == null ? void 0 : o.left) != null ? s : []).filter(
                d => !(r != null && r.includes(d)),
              ),
              right: [
                ...((l = o == null ? void 0 : o.right) != null ? l : []).filter(
                  d => !(r != null && r.includes(d)),
                ),
                ...r,
              ],
            };
          }
          if (n === 'left') {
            var g, u;
            return {
              left: [
                ...((g = o == null ? void 0 : o.left) != null ? g : []).filter(
                  d => !(r != null && r.includes(d)),
                ),
                ...r,
              ],
              right: ((u = o == null ? void 0 : o.right) != null ? u : []).filter(
                d => !(r != null && r.includes(d)),
              ),
            };
          }
          return {
            left: ((i = o == null ? void 0 : o.left) != null ? i : []).filter(
              d => !(r != null && r.includes(d)),
            ),
            right: ((a = o == null ? void 0 : o.right) != null ? a : []).filter(
              d => !(r != null && r.includes(d)),
            ),
          };
        });
      },
      getCanPin: () =>
        e.getLeafColumns().some(r => {
          var o, i;
          return (
            ((o = r.columnDef.enablePinning) != null ? o : !0) &&
            ((i = t.options.enablePinning) != null ? i : !0)
          );
        }),
      getIsPinned: () => {
        const n = e.getLeafColumns().map(s => s.id),
          { left: r, right: o } = t.getState().columnPinning,
          i = n.some(s => (r == null ? void 0 : r.includes(s))),
          a = n.some(s => (o == null ? void 0 : o.includes(s)));
        return i ? 'left' : a ? 'right' : !1;
      },
      getPinnedIndex: () => {
        var n, r, o;
        const i = e.getIsPinned();
        return i
          ? (n =
              (r = t.getState().columnPinning) == null || (o = r[i]) == null
                ? void 0
                : o.indexOf(e.id)) != null
            ? n
            : -1
          : 0;
      },
    }),
    createRow: (e, t) => ({
      getCenterVisibleCells: _(
        () => [
          e._getAllVisibleCells(),
          t.getState().columnPinning.left,
          t.getState().columnPinning.right,
        ],
        (n, r, o) => {
          const i = [...(r ?? []), ...(o ?? [])];
          return n.filter(a => !i.includes(a.column.id));
        },
        {
          key: process.env.NODE_ENV === 'production' && 'row.getCenterVisibleCells',
          debug: () => {
            var n;
            return (n = t.options.debugAll) != null ? n : t.options.debugRows;
          },
        },
      ),
      getLeftVisibleCells: _(
        () => [e._getAllVisibleCells(), t.getState().columnPinning.left, ,],
        (n, r) =>
          (r ?? [])
            .map(i => n.find(a => a.column.id === i))
            .filter(Boolean)
            .map(i => ({
              ...i,
              position: 'left',
            })),
        {
          key: process.env.NODE_ENV === 'production' && 'row.getLeftVisibleCells',
          debug: () => {
            var n;
            return (n = t.options.debugAll) != null ? n : t.options.debugRows;
          },
        },
      ),
      getRightVisibleCells: _(
        () => [e._getAllVisibleCells(), t.getState().columnPinning.right],
        (n, r) =>
          (r ?? [])
            .map(i => n.find(a => a.column.id === i))
            .filter(Boolean)
            .map(i => ({
              ...i,
              position: 'right',
            })),
        {
          key: process.env.NODE_ENV === 'production' && 'row.getRightVisibleCells',
          debug: () => {
            var n;
            return (n = t.options.debugAll) != null ? n : t.options.debugRows;
          },
        },
      ),
    }),
    createTable: e => ({
      setColumnPinning: t =>
        e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(t),
      resetColumnPinning: t => {
        var n, r;
        return e.setColumnPinning(
          t
            ? de()
            : (n = (r = e.initialState) == null ? void 0 : r.columnPinning) != null
            ? n
            : de(),
        );
      },
      getIsSomeColumnsPinned: t => {
        var n;
        const r = e.getState().columnPinning;
        if (!t) {
          var o, i;
          return !!(((o = r.left) != null && o.length) || ((i = r.right) != null && i.length));
        }
        return !!((n = r[t]) != null && n.length);
      },
      getLeftLeafColumns: _(
        () => [e.getAllLeafColumns(), e.getState().columnPinning.left],
        (t, n) => (n ?? []).map(r => t.find(o => o.id === r)).filter(Boolean),
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftLeafColumns',
          debug: () => {
            var t;
            return (t = e.options.debugAll) != null ? t : e.options.debugColumns;
          },
        },
      ),
      getRightLeafColumns: _(
        () => [e.getAllLeafColumns(), e.getState().columnPinning.right],
        (t, n) => (n ?? []).map(r => t.find(o => o.id === r)).filter(Boolean),
        {
          key: process.env.NODE_ENV === 'development' && 'getRightLeafColumns',
          debug: () => {
            var t;
            return (t = e.options.debugAll) != null ? t : e.options.debugColumns;
          },
        },
      ),
      getCenterLeafColumns: _(
        () => [
          e.getAllLeafColumns(),
          e.getState().columnPinning.left,
          e.getState().columnPinning.right,
        ],
        (t, n, r) => {
          const o = [...(n ?? []), ...(r ?? [])];
          return t.filter(i => !o.includes(i.id));
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterLeafColumns',
          debug: () => {
            var t;
            return (t = e.options.debugAll) != null ? t : e.options.debugColumns;
          },
        },
      ),
    }),
  },
  Hn = {
    getInitialState: e => ({
      rowSelection: {},
      ...e,
    }),
    getDefaultOptions: e => ({
      onRowSelectionChange: R('rowSelection', e),
      enableRowSelection: !0,
      enableMultiRowSelection: !0,
      enableSubRowSelection: !0,
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    }),
    createTable: e => ({
      setRowSelection: t =>
        e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(t),
      resetRowSelection: t => {
        var n;
        return e.setRowSelection(t ? {} : (n = e.initialState.rowSelection) != null ? n : {});
      },
      toggleAllRowsSelected: t => {
        e.setRowSelection(n => {
          t = typeof t < 'u' ? t : !e.getIsAllRowsSelected();
          const r = {
              ...n,
            },
            o = e.getPreGroupedRowModel().flatRows;
          return (
            t
              ? o.forEach(i => {
                  i.getCanSelect() && (r[i.id] = !0);
                })
              : o.forEach(i => {
                  delete r[i.id];
                }),
            r
          );
        });
      },
      toggleAllPageRowsSelected: t =>
        e.setRowSelection(n => {
          const r = typeof t < 'u' ? t : !e.getIsAllPageRowsSelected(),
            o = {
              ...n,
            };
          return (
            e.getRowModel().rows.forEach(i => {
              $e(o, i.id, r, e);
            }),
            o
          );
        }),
      // addRowSelectionRange: rowId => {
      //   const {
      //     rows,
      //     rowsById,
      //     options: { selectGroupingRows, selectSubRows },
      //   } = table
      //   const findSelectedRow = (rows: Row[]) => {
      //     let found
      //     rows.find(d => {
      //       if (d.getIsSelected()) {
      //         found = d
      //         return true
      //       }
      //       const subFound = findSelectedRow(d.subRows || [])
      //       if (subFound) {
      //         found = subFound
      //         return true
      //       }
      //       return false
      //     })
      //     return found
      //   }
      //   const firstRow = findSelectedRow(rows) || rows[0]
      //   const lastRow = rowsById[rowId]
      //   let include = false
      //   const selectedRowIds = {}
      //   const addRow = (row: Row) => {
      //     mutateRowIsSelected(selectedRowIds, row.id, true, {
      //       rowsById,
      //       selectGroupingRows: selectGroupingRows!,
      //       selectSubRows: selectSubRows!,
      //     })
      //   }
      //   table.rows.forEach(row => {
      //     const isFirstRow = row.id === firstRow.id
      //     const isLastRow = row.id === lastRow.id
      //     if (isFirstRow || isLastRow) {
      //       if (!include) {
      //         include = true
      //       } else if (include) {
      //         addRow(row)
      //         include = false
      //       }
      //     }
      //     if (include) {
      //       addRow(row)
      //     }
      //   })
      //   table.setRowSelection(selectedRowIds)
      // },
      getPreSelectedRowModel: () => e.getCoreRowModel(),
      getSelectedRowModel: _(
        () => [e.getState().rowSelection, e.getCoreRowModel()],
        (t, n) =>
          Object.keys(t).length
            ? ce(e, n)
            : {
                rows: [],
                flatRows: [],
                rowsById: {},
              },
        {
          key: process.env.NODE_ENV === 'development' && 'getSelectedRowModel',
          debug: () => {
            var t;
            return (t = e.options.debugAll) != null ? t : e.options.debugTable;
          },
        },
      ),
      getFilteredSelectedRowModel: _(
        () => [e.getState().rowSelection, e.getFilteredRowModel()],
        (t, n) =>
          Object.keys(t).length
            ? ce(e, n)
            : {
                rows: [],
                flatRows: [],
                rowsById: {},
              },
        {
          key: process.env.NODE_ENV === 'production' && 'getFilteredSelectedRowModel',
          debug: () => {
            var t;
            return (t = e.options.debugAll) != null ? t : e.options.debugTable;
          },
        },
      ),
      getGroupedSelectedRowModel: _(
        () => [e.getState().rowSelection, e.getSortedRowModel()],
        (t, n) =>
          Object.keys(t).length
            ? ce(e, n)
            : {
                rows: [],
                flatRows: [],
                rowsById: {},
              },
        {
          key: process.env.NODE_ENV === 'production' && 'getGroupedSelectedRowModel',
          debug: () => {
            var t;
            return (t = e.options.debugAll) != null ? t : e.options.debugTable;
          },
        },
      ),
      ///
      // getGroupingRowCanSelect: rowId => {
      //   const row = table.getRow(rowId)
      //   if (!row) {
      //     throw new Error()
      //   }
      //   if (typeof table.options.enableGroupingRowSelection === 'function') {
      //     return table.options.enableGroupingRowSelection(row)
      //   }
      //   return table.options.enableGroupingRowSelection ?? false
      // },
      getIsAllRowsSelected: () => {
        const t = e.getFilteredRowModel().flatRows,
          { rowSelection: n } = e.getState();
        let r = !!(t.length && Object.keys(n).length);
        return r && t.some(o => o.getCanSelect() && !n[o.id]) && (r = !1), r;
      },
      getIsAllPageRowsSelected: () => {
        const t = e.getPaginationRowModel().flatRows.filter(o => o.getCanSelect()),
          { rowSelection: n } = e.getState();
        let r = !!t.length;
        return r && t.some(o => !n[o.id]) && (r = !1), r;
      },
      getIsSomeRowsSelected: () => {
        var t;
        const n = Object.keys((t = e.getState().rowSelection) != null ? t : {}).length;
        return n > 0 && n < e.getFilteredRowModel().flatRows.length;
      },
      getIsSomePageRowsSelected: () => {
        const t = e.getPaginationRowModel().flatRows;
        return e.getIsAllPageRowsSelected()
          ? !1
          : t.filter(n => n.getCanSelect()).some(n => n.getIsSelected() || n.getIsSomeSelected());
      },
      getToggleAllRowsSelectedHandler: () => t => {
        e.toggleAllRowsSelected(t.target.checked);
      },
      getToggleAllPageRowsSelectedHandler: () => t => {
        e.toggleAllPageRowsSelected(t.target.checked);
      },
    }),
    createRow: (e, t) => ({
      toggleSelected: n => {
        const r = e.getIsSelected();
        t.setRowSelection(o => {
          if (((n = typeof n < 'u' ? n : !r), r === n)) return o;
          const i = {
            ...o,
          };
          return $e(i, e.id, n, t), i;
        });
      },
      getIsSelected: () => {
        const { rowSelection: n } = t.getState();
        return Fe(e, n);
      },
      getIsSomeSelected: () => {
        const { rowSelection: n } = t.getState();
        return je(e, n) === 'some';
      },
      getIsAllSubRowsSelected: () => {
        const { rowSelection: n } = t.getState();
        return je(e, n) === 'all';
      },
      getCanSelect: () => {
        var n;
        return typeof t.options.enableRowSelection == 'function'
          ? t.options.enableRowSelection(e)
          : (n = t.options.enableRowSelection) != null
          ? n
          : !0;
      },
      getCanSelectSubRows: () => {
        var n;
        return typeof t.options.enableSubRowSelection == 'function'
          ? t.options.enableSubRowSelection(e)
          : (n = t.options.enableSubRowSelection) != null
          ? n
          : !0;
      },
      getCanMultiSelect: () => {
        var n;
        return typeof t.options.enableMultiRowSelection == 'function'
          ? t.options.enableMultiRowSelection(e)
          : (n = t.options.enableMultiRowSelection) != null
          ? n
          : !0;
      },
      getToggleSelectedHandler: () => {
        const n = e.getCanSelect();
        return r => {
          var o;
          n && e.toggleSelected((o = r.target) == null ? void 0 : o.checked);
        };
      },
    }),
  },
  $e = (e, t, n, r) => {
    var o;
    const i = r.getRow(t);
    n
      ? (i.getCanMultiSelect() || Object.keys(e).forEach(a => delete e[a]),
        i.getCanSelect() && (e[t] = !0))
      : delete e[t],
      (o = i.subRows) != null &&
        o.length &&
        i.getCanSelectSubRows() &&
        i.subRows.forEach(a => $e(e, a.id, n, r));
  };
function ce(e, t) {
  const n = e.getState().rowSelection,
    r = [],
    o = {},
    i = function (a, s) {
      return a
        .map(l => {
          var g;
          const u = Fe(l, n);
          if (
            (u && (r.push(l), (o[l.id] = l)),
            (g = l.subRows) != null &&
              g.length &&
              (l = {
                ...l,
                subRows: i(l.subRows),
              }),
            u)
          )
            return l;
        })
        .filter(Boolean);
    };
  return {
    rows: i(t.rows),
    flatRows: r,
    rowsById: o,
  };
}
function Fe(e, t) {
  var n;
  return (n = t[e.id]) != null ? n : !1;
}
function je(e, t, n) {
  if (e.subRows && e.subRows.length) {
    let r = !0,
      o = !1;
    return (
      e.subRows.forEach(i => {
        (o && !r) || (Fe(i, t) ? (o = !0) : (r = !1));
      }),
      r ? 'all' : o ? 'some' : !1
    );
  }
  return !1;
}
const Se = /([0-9]+)/gm,
  Nn = (e, t, n) => Pt(P(e.getValue(n)).toLowerCase(), P(t.getValue(n)).toLowerCase()),
  Gn = (e, t, n) => Pt(P(e.getValue(n)), P(t.getValue(n))),
  Ln = (e, t, n) => Ee(P(e.getValue(n)).toLowerCase(), P(t.getValue(n)).toLowerCase()),
  zn = (e, t, n) => Ee(P(e.getValue(n)), P(t.getValue(n))),
  jn = (e, t, n) => {
    const r = e.getValue(n),
      o = t.getValue(n);
    return r > o ? 1 : r < o ? -1 : 0;
  },
  kn = (e, t, n) => Ee(e.getValue(n), t.getValue(n));
function Ee(e, t) {
  return e === t ? 0 : e > t ? 1 : -1;
}
function P(e) {
  return typeof e == 'number'
    ? isNaN(e) || e === 1 / 0 || e === -1 / 0
      ? ''
      : String(e)
    : typeof e == 'string'
    ? e
    : '';
}
function Pt(e, t) {
  const n = e.split(Se).filter(Boolean),
    r = t.split(Se).filter(Boolean);
  for (; n.length && r.length; ) {
    const o = n.shift(),
      i = r.shift(),
      a = parseInt(o, 10),
      s = parseInt(i, 10),
      l = [a, s].sort();
    if (isNaN(l[0])) {
      if (o > i) return 1;
      if (i > o) return -1;
      continue;
    }
    if (isNaN(l[1])) return isNaN(a) ? -1 : 1;
    if (a > s) return 1;
    if (s > a) return -1;
  }
  return n.length - r.length;
}
const L = {
    alphanumeric: Nn,
    alphanumericCaseSensitive: Gn,
    text: Ln,
    textCaseSensitive: zn,
    datetime: jn,
    basic: kn,
  },
  Bn = {
    getInitialState: e => ({
      sorting: [],
      ...e,
    }),
    getDefaultColumnDef: () => ({
      sortingFn: 'auto',
    }),
    getDefaultOptions: e => ({
      onSortingChange: R('sorting', e),
      isMultiSortEvent: t => t.shiftKey,
    }),
    createColumn: (e, t) => ({
      getAutoSortingFn: () => {
        const n = t.getFilteredRowModel().flatRows.slice(10);
        let r = !1;
        for (const o of n) {
          const i = o == null ? void 0 : o.getValue(e.id);
          if (Object.prototype.toString.call(i) === '[object Date]') return L.datetime;
          if (typeof i == 'string' && ((r = !0), i.split(Se).length > 1)) return L.alphanumeric;
        }
        return r ? L.text : L.basic;
      },
      getAutoSortDir: () => {
        const n = t.getFilteredRowModel().flatRows[0];
        return typeof (n == null ? void 0 : n.getValue(e.id)) == 'string' ? 'asc' : 'desc';
      },
      getSortingFn: () => {
        var n, r;
        if (!e) throw new Error();
        return W(e.columnDef.sortingFn)
          ? e.columnDef.sortingFn
          : e.columnDef.sortingFn === 'auto'
          ? e.getAutoSortingFn()
          : (n = (r = t.options.sortingFns) == null ? void 0 : r[e.columnDef.sortingFn]) != null
          ? n
          : L[e.columnDef.sortingFn];
      },
      toggleSorting: (n, r) => {
        const o = e.getNextSortingOrder(),
          i = typeof n < 'u' && n !== null;
        t.setSorting(a => {
          const s = a == null ? void 0 : a.find(f => f.id === e.id),
            l = a == null ? void 0 : a.findIndex(f => f.id === e.id);
          let g = [],
            u,
            d = i ? n : o === 'desc';
          if (
            (a != null && a.length && e.getCanMultiSort() && r
              ? s
                ? (u = 'toggle')
                : (u = 'add')
              : a != null && a.length && l !== a.length - 1
              ? (u = 'replace')
              : s
              ? (u = 'toggle')
              : (u = 'replace'),
            u === 'toggle' && (i || o || (u = 'remove')),
            u === 'add')
          ) {
            var c;
            (g = [
              ...a,
              {
                id: e.id,
                desc: d,
              },
            ]),
              g.splice(
                0,
                g.length -
                  ((c = t.options.maxMultiSortColCount) != null ? c : Number.MAX_SAFE_INTEGER),
              );
          } else
            u === 'toggle'
              ? (g = a.map(f =>
                  f.id === e.id
                    ? {
                        ...f,
                        desc: d,
                      }
                    : f,
                ))
              : u === 'remove'
              ? (g = a.filter(f => f.id !== e.id))
              : (g = [
                  {
                    id: e.id,
                    desc: d,
                  },
                ]);
          return g;
        });
      },
      getFirstSortDir: () => {
        var n, r;
        return (
          (n = (r = e.columnDef.sortDescFirst) != null ? r : t.options.sortDescFirst) != null
            ? n
            : e.getAutoSortDir() === 'desc'
        )
          ? 'desc'
          : 'asc';
      },
      getNextSortingOrder: n => {
        var r, o;
        const i = e.getFirstSortDir(),
          a = e.getIsSorted();
        return a
          ? a !== i &&
            ((r = t.options.enableSortingRemoval) == null || r) && // If enableSortRemove, enable in general
            (!(n && (o = t.options.enableMultiRemove) != null) || o)
            ? !1
            : a === 'desc'
            ? 'asc'
            : 'desc'
          : i;
      },
      getCanSort: () => {
        var n, r;
        return (
          ((n = e.columnDef.enableSorting) != null ? n : !0) &&
          ((r = t.options.enableSorting) != null ? r : !0) &&
          !!e.accessorFn
        );
      },
      getCanMultiSort: () => {
        var n, r;
        return (n = (r = e.columnDef.enableMultiSort) != null ? r : t.options.enableMultiSort) !=
          null
          ? n
          : !!e.accessorFn;
      },
      getIsSorted: () => {
        var n;
        const r = (n = t.getState().sorting) == null ? void 0 : n.find(o => o.id === e.id);
        return r ? (r.desc ? 'desc' : 'asc') : !1;
      },
      getSortIndex: () => {
        var n, r;
        return (n =
          (r = t.getState().sorting) == null ? void 0 : r.findIndex(o => o.id === e.id)) != null
          ? n
          : -1;
      },
      clearSorting: () => {
        t.setSorting(n => (n != null && n.length ? n.filter(r => r.id !== e.id) : []));
      },
      getToggleSortingHandler: () => {
        const n = e.getCanSort();
        return r => {
          n &&
            (r.persist == null || r.persist(),
            e.toggleSorting == null ||
              e.toggleSorting(
                void 0,
                e.getCanMultiSort()
                  ? t.options.isMultiSortEvent == null
                    ? void 0
                    : t.options.isMultiSortEvent(r)
                  : !1,
              ));
        };
      },
    }),
    createTable: e => ({
      setSorting: t => (e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(t)),
      resetSorting: t => {
        var n, r;
        e.setSorting(
          t ? [] : (n = (r = e.initialState) == null ? void 0 : r.sorting) != null ? n : [],
        );
      },
      getPreSortedRowModel: () => e.getGroupedRowModel(),
      getSortedRowModel: () => (
        !e._getSortedRowModel &&
          e.options.getSortedRowModel &&
          (e._getSortedRowModel = e.options.getSortedRowModel(e)),
        e.options.manualSorting || !e._getSortedRowModel
          ? e.getPreSortedRowModel()
          : e._getSortedRowModel()
      ),
    }),
  },
  qn = {
    getInitialState: e => ({
      columnVisibility: {},
      ...e,
    }),
    getDefaultOptions: e => ({
      onColumnVisibilityChange: R('columnVisibility', e),
    }),
    createColumn: (e, t) => ({
      toggleVisibility: n => {
        e.getCanHide() &&
          t.setColumnVisibility(r => ({
            ...r,
            [e.id]: n ?? !e.getIsVisible(),
          }));
      },
      getIsVisible: () => {
        var n, r;
        return (n = (r = t.getState().columnVisibility) == null ? void 0 : r[e.id]) != null
          ? n
          : !0;
      },
      getCanHide: () => {
        var n, r;
        return (
          ((n = e.columnDef.enableHiding) != null ? n : !0) &&
          ((r = t.options.enableHiding) != null ? r : !0)
        );
      },
      getToggleVisibilityHandler: () => n => {
        e.toggleVisibility == null || e.toggleVisibility(n.target.checked);
      },
    }),
    createRow: (e, t) => ({
      _getAllVisibleCells: _(
        () => [e.getAllCells(), t.getState().columnVisibility],
        n => n.filter(r => r.column.getIsVisible()),
        {
          key: process.env.NODE_ENV === 'production' && 'row._getAllVisibleCells',
          debug: () => {
            var n;
            return (n = t.options.debugAll) != null ? n : t.options.debugRows;
          },
        },
      ),
      getVisibleCells: _(
        () => [e.getLeftVisibleCells(), e.getCenterVisibleCells(), e.getRightVisibleCells()],
        (n, r, o) => [...n, ...r, ...o],
        {
          key: process.env.NODE_ENV === 'development' && 'row.getVisibleCells',
          debug: () => {
            var n;
            return (n = t.options.debugAll) != null ? n : t.options.debugRows;
          },
        },
      ),
    }),
    createTable: e => {
      const t = (n, r) =>
        _(
          () => [
            r(),
            r()
              .filter(o => o.getIsVisible())
              .map(o => o.id)
              .join('_'),
          ],
          o => o.filter(i => (i.getIsVisible == null ? void 0 : i.getIsVisible())),
          {
            key: n,
            debug: () => {
              var o;
              return (o = e.options.debugAll) != null ? o : e.options.debugColumns;
            },
          },
        );
      return {
        getVisibleFlatColumns: t('getVisibleFlatColumns', () => e.getAllFlatColumns()),
        getVisibleLeafColumns: t('getVisibleLeafColumns', () => e.getAllLeafColumns()),
        getLeftVisibleLeafColumns: t('getLeftVisibleLeafColumns', () => e.getLeftLeafColumns()),
        getRightVisibleLeafColumns: t('getRightVisibleLeafColumns', () => e.getRightLeafColumns()),
        getCenterVisibleLeafColumns: t('getCenterVisibleLeafColumns', () =>
          e.getCenterLeafColumns(),
        ),
        setColumnVisibility: n =>
          e.options.onColumnVisibilityChange == null
            ? void 0
            : e.options.onColumnVisibilityChange(n),
        resetColumnVisibility: n => {
          var r;
          e.setColumnVisibility(n ? {} : (r = e.initialState.columnVisibility) != null ? r : {});
        },
        toggleAllColumnsVisible: n => {
          var r;
          (n = (r = n) != null ? r : !e.getIsAllColumnsVisible()),
            e.setColumnVisibility(
              e.getAllLeafColumns().reduce(
                (o, i) => ({
                  ...o,
                  [i.id]: n || !(i.getCanHide != null && i.getCanHide()),
                }),
                {},
              ),
            );
        },
        getIsAllColumnsVisible: () =>
          !e.getAllLeafColumns().some(n => !(n.getIsVisible != null && n.getIsVisible())),
        getIsSomeColumnsVisible: () =>
          e.getAllLeafColumns().some(n => (n.getIsVisible == null ? void 0 : n.getIsVisible())),
        getToggleAllColumnsVisibilityHandler: () => n => {
          var r;
          e.toggleAllColumnsVisible((r = n.target) == null ? void 0 : r.checked);
        },
      };
    },
  },
  ke = [hn, qn, In, Tn, wn, Bn, On, Cn, Dn, Hn, $n];
function Kn(e) {
  var t;
  (e.debugAll || e.debugTable) && console.info('Creating Table Instance...');
  let n = {
    _features: ke,
  };
  const r = n._features.reduce(
      (u, d) => Object.assign(u, d.getDefaultOptions == null ? void 0 : d.getDefaultOptions(n)),
      {},
    ),
    o = u =>
      n.options.mergeOptions
        ? n.options.mergeOptions(r, u)
        : {
            ...r,
            ...u,
          };
  let a = {
    ...{},
    ...((t = e.initialState) != null ? t : {}),
  };
  n._features.forEach(u => {
    var d;
    a = (d = u.getInitialState == null ? void 0 : u.getInitialState(a)) != null ? d : a;
  });
  const s = [];
  let l = !1;
  const g = {
    _features: ke,
    options: {
      ...r,
      ...e,
    },
    initialState: a,
    _queue: u => {
      s.push(u),
        l ||
          ((l = !0),
          Promise.resolve()
            .then(() => {
              for (; s.length; ) s.shift()();
              l = !1;
            })
            .catch(d =>
              setTimeout(() => {
                throw d;
              }),
            ));
    },
    reset: () => {
      n.setState(n.initialState);
    },
    setOptions: u => {
      const d = V(u, n.options);
      n.options = o(d);
    },
    getState: () => n.options.state,
    setState: u => {
      n.options.onStateChange == null || n.options.onStateChange(u);
    },
    _getRowId: (u, d, c) => {
      var f;
      return (f = n.options.getRowId == null ? void 0 : n.options.getRowId(u, d, c)) != null
        ? f
        : `${c ? [c.id, d].join('.') : d}`;
    },
    getCoreRowModel: () => (
      n._getCoreRowModel || (n._getCoreRowModel = n.options.getCoreRowModel(n)),
      n._getCoreRowModel()
    ),
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => n.getPaginationRowModel(),
    getRow: u => {
      const d = n.getRowModel().rowsById[u];
      if (!d)
        throw process.env.NODE_ENV !== 'production'
          ? new Error(`getRow expected an ID, but got ${u}`)
          : new Error();
      return d;
    },
    _getDefaultColumnDef: _(
      () => [n.options.defaultColumn],
      u => {
        var d;
        return (
          (u = (d = u) != null ? d : {}),
          {
            header: c => {
              const f = c.header.column.columnDef;
              return f.accessorKey ? f.accessorKey : f.accessorFn ? f.id : null;
            },
            // footer: props => props.header.column.id,
            cell: c => {
              var f, v;
              return (f =
                (v = c.renderValue()) == null || v.toString == null ? void 0 : v.toString()) != null
                ? f
                : null;
            },
            ...n._features.reduce(
              (c, f) =>
                Object.assign(c, f.getDefaultColumnDef == null ? void 0 : f.getDefaultColumnDef()),
              {},
            ),
            ...u,
          }
        );
      },
      {
        debug: () => {
          var u;
          return (u = n.options.debugAll) != null ? u : n.options.debugColumns;
        },
        key: process.env.NODE_ENV === 'development' && 'getDefaultColumnDef',
      },
    ),
    _getColumnDefs: () => n.options.columns,
    getAllColumns: _(
      () => [n._getColumnDefs()],
      u => {
        const d = function (c, f, v) {
          return (
            v === void 0 && (v = 0),
            c.map(p => {
              const m = mn(n, p, v, f),
                h = p;
              return (m.columns = h.columns ? d(h.columns, m, v + 1) : []), m;
            })
          );
        };
        return d(u);
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllColumns',
        debug: () => {
          var u;
          return (u = n.options.debugAll) != null ? u : n.options.debugColumns;
        },
      },
    ),
    getAllFlatColumns: _(
      () => [n.getAllColumns()],
      u => u.flatMap(d => d.getFlatColumns()),
      {
        key: process.env.NODE_ENV === 'development' && 'getAllFlatColumns',
        debug: () => {
          var u;
          return (u = n.options.debugAll) != null ? u : n.options.debugColumns;
        },
      },
    ),
    _getAllFlatColumnsById: _(
      () => [n.getAllFlatColumns()],
      u => u.reduce((d, c) => ((d[c.id] = c), d), {}),
      {
        key: process.env.NODE_ENV === 'development' && 'getAllFlatColumnsById',
        debug: () => {
          var u;
          return (u = n.options.debugAll) != null ? u : n.options.debugColumns;
        },
      },
    ),
    getAllLeafColumns: _(
      () => [n.getAllColumns(), n._getOrderColumnsFn()],
      (u, d) => {
        let c = u.flatMap(f => f.getLeafColumns());
        return d(c);
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllLeafColumns',
        debug: () => {
          var u;
          return (u = n.options.debugAll) != null ? u : n.options.debugColumns;
        },
      },
    ),
    getColumn: u => {
      const d = n._getAllFlatColumnsById()[u];
      return (
        process.env.NODE_ENV !== 'production' &&
          !d &&
          console.error(`[Table] Column with id '${u}' does not exist.`),
        d
      );
    },
  };
  return (
    Object.assign(n, g),
    n._features.forEach(u => Object.assign(n, u.createTable == null ? void 0 : u.createTable(n))),
    n
  );
}
function Un(e, t, n, r) {
  const o = () => {
      var a;
      return (a = i.getValue()) != null ? a : e.options.renderFallbackValue;
    },
    i = {
      id: `${t.id}_${n.id}`,
      row: t,
      column: n,
      getValue: () => t.getValue(r),
      renderValue: o,
      getContext: _(
        () => [e, n, t, i],
        (a, s, l, g) => ({
          table: a,
          column: s,
          row: l,
          cell: g,
          getValue: g.getValue,
          renderValue: g.renderValue,
        }),
        {
          key: process.env.NODE_ENV === 'development' && 'cell.getContext',
          debug: () => e.options.debugAll,
        },
      ),
    };
  return (
    e._features.forEach(a => {
      Object.assign(i, a.createCell == null ? void 0 : a.createCell(i, n, t, e));
    }, {}),
    i
  );
}
const Xn = (e, t, n, r, o, i, a) => {
  let s = {
    id: t,
    index: r,
    original: n,
    depth: o,
    parentId: a,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: l => {
      if (s._valuesCache.hasOwnProperty(l)) return s._valuesCache[l];
      const g = e.getColumn(l);
      if (g != null && g.accessorFn)
        return (s._valuesCache[l] = g.accessorFn(s.original, r)), s._valuesCache[l];
    },
    getUniqueValues: l => {
      if (s._uniqueValuesCache.hasOwnProperty(l)) return s._uniqueValuesCache[l];
      const g = e.getColumn(l);
      if (g != null && g.accessorFn)
        return g.columnDef.getUniqueValues
          ? ((s._uniqueValuesCache[l] = g.columnDef.getUniqueValues(s.original, r)),
            s._uniqueValuesCache[l])
          : ((s._uniqueValuesCache[l] = [s.getValue(l)]), s._uniqueValuesCache[l]);
    },
    renderValue: l => {
      var g;
      return (g = s.getValue(l)) != null ? g : e.options.renderFallbackValue;
    },
    subRows: i ?? [],
    getLeafRows: () => _n(s.subRows, l => l.subRows),
    getParentRow: () => (s.parentId ? e.getRow(s.parentId) : void 0),
    getParentRows: () => {
      let l = [],
        g = s;
      for (;;) {
        const u = g.getParentRow();
        if (!u) break;
        l.push(u), (g = u);
      }
      return l.reverse();
    },
    getAllCells: _(
      () => [e.getAllLeafColumns()],
      l => l.map(g => Un(e, s, g, g.id)),
      {
        key: process.env.NODE_ENV === 'development' && 'row.getAllCells',
        debug: () => {
          var l;
          return (l = e.options.debugAll) != null ? l : e.options.debugRows;
        },
      },
    ),
    _getAllCellsByColumnId: _(
      () => [s.getAllCells()],
      l => l.reduce((g, u) => ((g[u.column.id] = u), g), {}),
      {
        key: process.env.NODE_ENV === 'production' && 'row.getAllCellsByColumnId',
        debug: () => {
          var l;
          return (l = e.options.debugAll) != null ? l : e.options.debugRows;
        },
      },
    ),
  };
  for (let l = 0; l < e._features.length; l++) {
    const g = e._features[l];
    Object.assign(s, g == null || g.createRow == null ? void 0 : g.createRow(s, e));
  }
  return s;
};
function Wn() {
  return e =>
    _(
      () => [e.options.data],
      t => {
        const n = {
            rows: [],
            flatRows: [],
            rowsById: {},
          },
          r = function (o, i, a) {
            i === void 0 && (i = 0);
            const s = [];
            for (let g = 0; g < o.length; g++) {
              const u = Xn(
                e,
                e._getRowId(o[g], g, a),
                o[g],
                g,
                i,
                void 0,
                a == null ? void 0 : a.id,
              );
              if ((n.flatRows.push(u), (n.rowsById[u.id] = u), s.push(u), e.options.getSubRows)) {
                var l;
                (u.originalSubRows = e.options.getSubRows(o[g], g)),
                  (l = u.originalSubRows) != null &&
                    l.length &&
                    (u.subRows = r(u.originalSubRows, i + 1, u));
              }
            }
            return s;
          };
        return (n.rows = r(t)), n;
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getRowModel',
        debug: () => {
          var t;
          return (t = e.options.debugAll) != null ? t : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      },
    );
}
/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function Be(e, t) {
  return e ? (Jn(e) ? /* @__PURE__ */ _e.createElement(e, t) : e) : null;
}
function Jn(e) {
  return Yn(e) || typeof e == 'function' || Zn(e);
}
function Yn(e) {
  return (
    typeof e == 'function' &&
    (() => {
      const t = Object.getPrototypeOf(e);
      return t.prototype && t.prototype.isReactComponent;
    })()
  );
}
function Zn(e) {
  return (
    typeof e == 'object' &&
    typeof e.$$typeof == 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(e.$$typeof.description)
  );
}
function Qn(e) {
  const t = {
      state: {},
      // Dummy state
      onStateChange: () => {},
      // noop
      renderFallbackValue: null,
      ...e,
    },
    [n] = _e.useState(() => ({
      current: Kn(t),
    })),
    [r, o] = _e.useState(() => n.current.initialState);
  return (
    n.current.setOptions(i => ({
      ...i,
      ...e,
      state: {
        ...r,
        ...e.state,
      },
      // Similarly, we'll maintain both our internal state and any user-provided
      // state.
      onStateChange: a => {
        o(a), e.onStateChange == null || e.onStateChange(a);
      },
    })),
    n.current
  );
}
const qe = [
  {
    accessorKey: 'id',
    cell: e => e.getValue(),
    header: () => 'ID',
  },
  {
    accessorKey: 'workflowDefinitionName',
    cell: e => e.getValue(),
    header: ({ column: e }) =>
      /* @__PURE__ */ S(O, { column: e, title: 'Workflow Definition Name' }),
  },
  {
    accessorKey: 'status',
    cell: e =>
      /* @__PURE__ */ wt('div', {
        className: 'font-inter flex flex-row flex-nowrap gap-4 font-medium capitalize',
        children: [/* @__PURE__ */ S(un, { healthStatus: sn(e.row.original) }), e.getValue() || ''],
      }),
    header: ({ column: e }) => /* @__PURE__ */ S(O, { column: e, title: 'Status' }),
  },
  {
    accessorKey: 'state',
    cell: e => e.getValue(),
    header: ({ column: e }) => /* @__PURE__ */ S(O, { column: e, title: 'State' }),
  },
  {
    accessorKey: 'assignee',
    accessorFn: e => (e.assignee ? `${e.assignee.firstName} ${e.assignee.lastName}` : '-'),
    cell: e => e.getValue(),
    header: ({ column: e }) => /* @__PURE__ */ S(O, { column: e, title: 'Assign To' }),
  },
  {
    accessorKey: 'context',
    accessorFn: e => JSON.stringify(e.context),
    cell: e => /* @__PURE__ */ S(gn, { context: e.getValue() }),
    header: () => 'Context',
  },
  {
    accessorKey: 'view-workflow',
    accessorFn: e => e.id,
    cell: () => '-',
    header: () => 'Workflow',
  },
  {
    accessorKey: 'resolvedAt',
    cell: e => (e.getValue() ? Ge(e.getValue()) : '-'),
    header: ({ column: e }) => /* @__PURE__ */ S(O, { column: e, title: 'Resolved At' }),
  },
  {
    accessorKey: 'createdBy',
    cell: e => e.getValue(),
    header: ({ column: e }) => /* @__PURE__ */ S(O, { column: e, title: 'Created By' }),
  },
  {
    accessorKey: 'createdAt',
    cell: e => Ge(e.getValue()),
    header: ({ column: e }) => /* @__PURE__ */ S(O, { column: e, title: 'Created At' }),
  },
];
var er = typeof B == 'object' && B && B.Object === Object && B,
  Ot = er,
  tr = Ot,
  nr = typeof self == 'object' && self && self.Object === Object && self,
  rr = tr || nr || Function('return this')(),
  E = rr,
  or = E,
  ir = or.Symbol,
  Q = ir,
  Ke = Q,
  xt = Object.prototype,
  ar = xt.hasOwnProperty,
  lr = xt.toString,
  z = Ke ? Ke.toStringTag : void 0;
function sr(e) {
  var t = ar.call(e, z),
    n = e[z];
  try {
    e[z] = void 0;
    var r = !0;
  } catch {}
  var o = lr.call(e);
  return r && (t ? (e[z] = n) : delete e[z]), o;
}
var ur = sr,
  gr = Object.prototype,
  dr = gr.toString;
function cr(e) {
  return dr.call(e);
}
var fr = cr,
  Ue = Q,
  pr = ur,
  vr = fr,
  _r = '[object Null]',
  mr = '[object Undefined]',
  Xe = Ue ? Ue.toStringTag : void 0;
function hr(e) {
  return e == null ? (e === void 0 ? mr : _r) : Xe && Xe in Object(e) ? pr(e) : vr(e);
}
var j = hr;
function $r(e) {
  var t = typeof e;
  return e != null && (t == 'object' || t == 'function');
}
var Me = $r,
  Sr = j,
  Cr = Me,
  wr = '[object AsyncFunction]',
  yr = '[object Function]',
  br = '[object GeneratorFunction]',
  Rr = '[object Proxy]';
function Ar(e) {
  if (!Cr(e)) return !1;
  var t = Sr(e);
  return t == yr || t == br || t == wr || t == Rr;
}
var It = Ar,
  Fr = E,
  Er = Fr['__core-js_shared__'],
  Mr = Er,
  fe = Mr,
  We = (function () {
    var e = /[^.]+$/.exec((fe && fe.keys && fe.keys.IE_PROTO) || '');
    return e ? 'Symbol(src)_1.' + e : '';
  })();
function Vr(e) {
  return !!We && We in e;
}
var Pr = Vr,
  Or = Function.prototype,
  xr = Or.toString;
function Ir(e) {
  if (e != null) {
    try {
      return xr.call(e);
    } catch {}
    try {
      return e + '';
    } catch {}
  }
  return '';
}
var Dt = Ir,
  Dr = It,
  Tr = Pr,
  Hr = Me,
  Nr = Dt,
  Gr = /[\\^$.*+?()[\]{}|]/g,
  Lr = /^\[object .+?Constructor\]$/,
  zr = Function.prototype,
  jr = Object.prototype,
  kr = zr.toString,
  Br = jr.hasOwnProperty,
  qr = RegExp(
    '^' +
      kr
        .call(Br)
        .replace(Gr, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
      '$',
  );
function Kr(e) {
  if (!Hr(e) || Tr(e)) return !1;
  var t = Dr(e) ? qr : Lr;
  return t.test(Nr(e));
}
var Ur = Kr;
function Xr(e, t) {
  return e == null ? void 0 : e[t];
}
var Wr = Xr,
  Jr = Ur,
  Yr = Wr;
function Zr(e, t) {
  var n = Yr(e, t);
  return Jr(n) ? n : void 0;
}
var I = Zr,
  Qr = I,
  eo = (function () {
    try {
      var e = Qr(Object, 'defineProperty');
      return e({}, '', {}), e;
    } catch {}
  })(),
  to = eo,
  Je = to;
function no(e, t, n) {
  t == '__proto__' && Je
    ? Je(e, t, {
        configurable: !0,
        enumerable: !0,
        value: n,
        writable: !0,
      })
    : (e[t] = n);
}
var ro = no;
function oo(e, t, n, r) {
  for (var o = -1, i = e == null ? 0 : e.length; ++o < i; ) {
    var a = e[o];
    t(r, a, n(a), e);
  }
  return r;
}
var io = oo;
function ao(e) {
  return function (t, n, r) {
    for (var o = -1, i = Object(t), a = r(t), s = a.length; s--; ) {
      var l = a[e ? s : ++o];
      if (n(i[l], l, i) === !1) break;
    }
    return t;
  };
}
var lo = ao,
  so = lo,
  uo = so(),
  go = uo;
function co(e, t) {
  for (var n = -1, r = Array(e); ++n < e; ) r[n] = t(n);
  return r;
}
var fo = co;
function po(e) {
  return e != null && typeof e == 'object';
}
var k = po,
  vo = j,
  _o = k,
  mo = '[object Arguments]';
function ho(e) {
  return _o(e) && vo(e) == mo;
}
var $o = ho,
  Ye = $o,
  So = k,
  Tt = Object.prototype,
  Co = Tt.hasOwnProperty,
  wo = Tt.propertyIsEnumerable,
  yo = Ye(
    (function () {
      return arguments;
    })(),
  )
    ? Ye
    : function (e) {
        return So(e) && Co.call(e, 'callee') && !wo.call(e, 'callee');
      },
  Ht = yo,
  bo = Array.isArray,
  M = bo,
  J = { exports: {} };
function Ro() {
  return !1;
}
var Ao = Ro;
J.exports;
(function (e, t) {
  var n = E,
    r = Ao,
    o = t && !t.nodeType && t,
    i = o && !0 && e && !e.nodeType && e,
    a = i && i.exports === o,
    s = a ? n.Buffer : void 0,
    l = s ? s.isBuffer : void 0,
    g = l || r;
  e.exports = g;
})(J, J.exports);
var Nt = J.exports,
  Fo = 9007199254740991,
  Eo = /^(?:0|[1-9]\d*)$/;
function Mo(e, t) {
  var n = typeof e;
  return (
    (t = t ?? Fo),
    !!t && (n == 'number' || (n != 'symbol' && Eo.test(e))) && e > -1 && e % 1 == 0 && e < t
  );
}
var Gt = Mo,
  Vo = 9007199254740991;
function Po(e) {
  return typeof e == 'number' && e > -1 && e % 1 == 0 && e <= Vo;
}
var Ve = Po,
  Oo = j,
  xo = Ve,
  Io = k,
  Do = '[object Arguments]',
  To = '[object Array]',
  Ho = '[object Boolean]',
  No = '[object Date]',
  Go = '[object Error]',
  Lo = '[object Function]',
  zo = '[object Map]',
  jo = '[object Number]',
  ko = '[object Object]',
  Bo = '[object RegExp]',
  qo = '[object Set]',
  Ko = '[object String]',
  Uo = '[object WeakMap]',
  Xo = '[object ArrayBuffer]',
  Wo = '[object DataView]',
  Jo = '[object Float32Array]',
  Yo = '[object Float64Array]',
  Zo = '[object Int8Array]',
  Qo = '[object Int16Array]',
  ei = '[object Int32Array]',
  ti = '[object Uint8Array]',
  ni = '[object Uint8ClampedArray]',
  ri = '[object Uint16Array]',
  oi = '[object Uint32Array]',
  $ = {};
$[Jo] = $[Yo] = $[Zo] = $[Qo] = $[ei] = $[ti] = $[ni] = $[ri] = $[oi] = !0;
$[Do] =
  $[To] =
  $[Xo] =
  $[Ho] =
  $[Wo] =
  $[No] =
  $[Go] =
  $[Lo] =
  $[zo] =
  $[jo] =
  $[ko] =
  $[Bo] =
  $[qo] =
  $[Ko] =
  $[Uo] =
    !1;
function ii(e) {
  return Io(e) && xo(e.length) && !!$[Oo(e)];
}
var ai = ii;
function li(e) {
  return function (t) {
    return e(t);
  };
}
var si = li,
  Y = { exports: {} };
Y.exports;
(function (e, t) {
  var n = Ot,
    r = t && !t.nodeType && t,
    o = r && !0 && e && !e.nodeType && e,
    i = o && o.exports === r,
    a = i && n.process,
    s = (function () {
      try {
        var l = o && o.require && o.require('util').types;
        return l || (a && a.binding && a.binding('util'));
      } catch {}
    })();
  e.exports = s;
})(Y, Y.exports);
var ui = Y.exports,
  gi = ai,
  di = si,
  Ze = ui,
  Qe = Ze && Ze.isTypedArray,
  ci = Qe ? di(Qe) : gi,
  Lt = ci,
  fi = fo,
  pi = Ht,
  vi = M,
  _i = Nt,
  mi = Gt,
  hi = Lt,
  $i = Object.prototype,
  Si = $i.hasOwnProperty;
function Ci(e, t) {
  var n = vi(e),
    r = !n && pi(e),
    o = !n && !r && _i(e),
    i = !n && !r && !o && hi(e),
    a = n || r || o || i,
    s = a ? fi(e.length, String) : [],
    l = s.length;
  for (var g in e)
    (t || Si.call(e, g)) &&
      !(
        a && // Safari 9 has enumerable `arguments.length` in strict mode.
        (g == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
          (o && (g == 'offset' || g == 'parent')) || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          (i && (g == 'buffer' || g == 'byteLength' || g == 'byteOffset')) || // Skip index properties.
          mi(g, l))
      ) &&
      s.push(g);
  return s;
}
var wi = Ci,
  yi = Object.prototype;
function bi(e) {
  var t = e && e.constructor,
    n = (typeof t == 'function' && t.prototype) || yi;
  return e === n;
}
var Ri = bi;
function Ai(e, t) {
  return function (n) {
    return e(t(n));
  };
}
var Fi = Ai,
  Ei = Fi,
  Mi = Ei(Object.keys, Object),
  Vi = Mi,
  Pi = Ri,
  Oi = Vi,
  xi = Object.prototype,
  Ii = xi.hasOwnProperty;
function Di(e) {
  if (!Pi(e)) return Oi(e);
  var t = [];
  for (var n in Object(e)) Ii.call(e, n) && n != 'constructor' && t.push(n);
  return t;
}
var Ti = Di,
  Hi = It,
  Ni = Ve;
function Gi(e) {
  return e != null && Ni(e.length) && !Hi(e);
}
var zt = Gi,
  Li = wi,
  zi = Ti,
  ji = zt;
function ki(e) {
  return ji(e) ? Li(e) : zi(e);
}
var Pe = ki,
  Bi = go,
  qi = Pe;
function Ki(e, t) {
  return e && Bi(e, t, qi);
}
var Ui = Ki,
  Xi = zt;
function Wi(e, t) {
  return function (n, r) {
    if (n == null) return n;
    if (!Xi(n)) return e(n, r);
    for (
      var o = n.length, i = t ? o : -1, a = Object(n);
      (t ? i-- : ++i < o) && r(a[i], i, a) !== !1;

    );
    return n;
  };
}
var Ji = Wi,
  Yi = Ui,
  Zi = Ji,
  Qi = Zi(Yi),
  ea = Qi,
  ta = ea;
function na(e, t, n, r) {
  return (
    ta(e, function (o, i, a) {
      t(r, o, n(o), a);
    }),
    r
  );
}
var ra = na;
function oa() {
  (this.__data__ = []), (this.size = 0);
}
var ia = oa;
function aa(e, t) {
  return e === t || (e !== e && t !== t);
}
var jt = aa,
  la = jt;
function sa(e, t) {
  for (var n = e.length; n--; ) if (la(e[n][0], t)) return n;
  return -1;
}
var ee = sa,
  ua = ee,
  ga = Array.prototype,
  da = ga.splice;
function ca(e) {
  var t = this.__data__,
    n = ua(t, e);
  if (n < 0) return !1;
  var r = t.length - 1;
  return n == r ? t.pop() : da.call(t, n, 1), --this.size, !0;
}
var fa = ca,
  pa = ee;
function va(e) {
  var t = this.__data__,
    n = pa(t, e);
  return n < 0 ? void 0 : t[n][1];
}
var _a = va,
  ma = ee;
function ha(e) {
  return ma(this.__data__, e) > -1;
}
var $a = ha,
  Sa = ee;
function Ca(e, t) {
  var n = this.__data__,
    r = Sa(n, e);
  return r < 0 ? (++this.size, n.push([e, t])) : (n[r][1] = t), this;
}
var wa = Ca,
  ya = ia,
  ba = fa,
  Ra = _a,
  Aa = $a,
  Fa = wa;
function D(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
D.prototype.clear = ya;
D.prototype.delete = ba;
D.prototype.get = Ra;
D.prototype.has = Aa;
D.prototype.set = Fa;
var te = D,
  Ea = te;
function Ma() {
  (this.__data__ = new Ea()), (this.size = 0);
}
var Va = Ma;
function Pa(e) {
  var t = this.__data__,
    n = t.delete(e);
  return (this.size = t.size), n;
}
var Oa = Pa;
function xa(e) {
  return this.__data__.get(e);
}
var Ia = xa;
function Da(e) {
  return this.__data__.has(e);
}
var Ta = Da,
  Ha = I,
  Na = E,
  Ga = Ha(Na, 'Map'),
  Oe = Ga,
  La = I,
  za = La(Object, 'create'),
  ne = za,
  et = ne;
function ja() {
  (this.__data__ = et ? et(null) : {}), (this.size = 0);
}
var ka = ja;
function Ba(e) {
  var t = this.has(e) && delete this.__data__[e];
  return (this.size -= t ? 1 : 0), t;
}
var qa = Ba,
  Ka = ne,
  Ua = '__lodash_hash_undefined__',
  Xa = Object.prototype,
  Wa = Xa.hasOwnProperty;
function Ja(e) {
  var t = this.__data__;
  if (Ka) {
    var n = t[e];
    return n === Ua ? void 0 : n;
  }
  return Wa.call(t, e) ? t[e] : void 0;
}
var Ya = Ja,
  Za = ne,
  Qa = Object.prototype,
  el = Qa.hasOwnProperty;
function tl(e) {
  var t = this.__data__;
  return Za ? t[e] !== void 0 : el.call(t, e);
}
var nl = tl,
  rl = ne,
  ol = '__lodash_hash_undefined__';
function il(e, t) {
  var n = this.__data__;
  return (this.size += this.has(e) ? 0 : 1), (n[e] = rl && t === void 0 ? ol : t), this;
}
var al = il,
  ll = ka,
  sl = qa,
  ul = Ya,
  gl = nl,
  dl = al;
function T(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
T.prototype.clear = ll;
T.prototype.delete = sl;
T.prototype.get = ul;
T.prototype.has = gl;
T.prototype.set = dl;
var cl = T,
  tt = cl,
  fl = te,
  pl = Oe;
function vl() {
  (this.size = 0),
    (this.__data__ = {
      hash: new tt(),
      map: new (pl || fl)(),
      string: new tt(),
    });
}
var _l = vl;
function ml(e) {
  var t = typeof e;
  return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
    ? e !== '__proto__'
    : e === null;
}
var hl = ml,
  $l = hl;
function Sl(e, t) {
  var n = e.__data__;
  return $l(t) ? n[typeof t == 'string' ? 'string' : 'hash'] : n.map;
}
var re = Sl,
  Cl = re;
function wl(e) {
  var t = Cl(this, e).delete(e);
  return (this.size -= t ? 1 : 0), t;
}
var yl = wl,
  bl = re;
function Rl(e) {
  return bl(this, e).get(e);
}
var Al = Rl,
  Fl = re;
function El(e) {
  return Fl(this, e).has(e);
}
var Ml = El,
  Vl = re;
function Pl(e, t) {
  var n = Vl(this, e),
    r = n.size;
  return n.set(e, t), (this.size += n.size == r ? 0 : 1), this;
}
var Ol = Pl,
  xl = _l,
  Il = yl,
  Dl = Al,
  Tl = Ml,
  Hl = Ol;
function H(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var r = e[t];
    this.set(r[0], r[1]);
  }
}
H.prototype.clear = xl;
H.prototype.delete = Il;
H.prototype.get = Dl;
H.prototype.has = Tl;
H.prototype.set = Hl;
var xe = H,
  Nl = te,
  Gl = Oe,
  Ll = xe,
  zl = 200;
function jl(e, t) {
  var n = this.__data__;
  if (n instanceof Nl) {
    var r = n.__data__;
    if (!Gl || r.length < zl - 1) return r.push([e, t]), (this.size = ++n.size), this;
    n = this.__data__ = new Ll(r);
  }
  return n.set(e, t), (this.size = n.size), this;
}
var kl = jl,
  Bl = te,
  ql = Va,
  Kl = Oa,
  Ul = Ia,
  Xl = Ta,
  Wl = kl;
function N(e) {
  var t = (this.__data__ = new Bl(e));
  this.size = t.size;
}
N.prototype.clear = ql;
N.prototype.delete = Kl;
N.prototype.get = Ul;
N.prototype.has = Xl;
N.prototype.set = Wl;
var kt = N,
  Jl = '__lodash_hash_undefined__';
function Yl(e) {
  return this.__data__.set(e, Jl), this;
}
var Zl = Yl;
function Ql(e) {
  return this.__data__.has(e);
}
var es = Ql,
  ts = xe,
  ns = Zl,
  rs = es;
function Z(e) {
  var t = -1,
    n = e == null ? 0 : e.length;
  for (this.__data__ = new ts(); ++t < n; ) this.add(e[t]);
}
Z.prototype.add = Z.prototype.push = ns;
Z.prototype.has = rs;
var os = Z;
function is(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length; ++n < r; ) if (t(e[n], n, e)) return !0;
  return !1;
}
var as = is;
function ls(e, t) {
  return e.has(t);
}
var ss = ls,
  us = os,
  gs = as,
  ds = ss,
  cs = 1,
  fs = 2;
function ps(e, t, n, r, o, i) {
  var a = n & cs,
    s = e.length,
    l = t.length;
  if (s != l && !(a && l > s)) return !1;
  var g = i.get(e),
    u = i.get(t);
  if (g && u) return g == t && u == e;
  var d = -1,
    c = !0,
    f = n & fs ? new us() : void 0;
  for (i.set(e, t), i.set(t, e); ++d < s; ) {
    var v = e[d],
      p = t[d];
    if (r) var m = a ? r(p, v, d, t, e, i) : r(v, p, d, e, t, i);
    if (m !== void 0) {
      if (m) continue;
      c = !1;
      break;
    }
    if (f) {
      if (
        !gs(t, function (h, C) {
          if (!ds(f, C) && (v === h || o(v, h, n, r, i))) return f.push(C);
        })
      ) {
        c = !1;
        break;
      }
    } else if (!(v === p || o(v, p, n, r, i))) {
      c = !1;
      break;
    }
  }
  return i.delete(e), i.delete(t), c;
}
var Bt = ps,
  vs = E,
  _s = vs.Uint8Array,
  ms = _s;
function hs(e) {
  var t = -1,
    n = Array(e.size);
  return (
    e.forEach(function (r, o) {
      n[++t] = [o, r];
    }),
    n
  );
}
var $s = hs;
function Ss(e) {
  var t = -1,
    n = Array(e.size);
  return (
    e.forEach(function (r) {
      n[++t] = r;
    }),
    n
  );
}
var Cs = Ss,
  nt = Q,
  rt = ms,
  ws = jt,
  ys = Bt,
  bs = $s,
  Rs = Cs,
  As = 1,
  Fs = 2,
  Es = '[object Boolean]',
  Ms = '[object Date]',
  Vs = '[object Error]',
  Ps = '[object Map]',
  Os = '[object Number]',
  xs = '[object RegExp]',
  Is = '[object Set]',
  Ds = '[object String]',
  Ts = '[object Symbol]',
  Hs = '[object ArrayBuffer]',
  Ns = '[object DataView]',
  ot = nt ? nt.prototype : void 0,
  pe = ot ? ot.valueOf : void 0;
function Gs(e, t, n, r, o, i, a) {
  switch (n) {
    case Ns:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
      (e = e.buffer), (t = t.buffer);
    case Hs:
      return !(e.byteLength != t.byteLength || !i(new rt(e), new rt(t)));
    case Es:
    case Ms:
    case Os:
      return ws(+e, +t);
    case Vs:
      return e.name == t.name && e.message == t.message;
    case xs:
    case Ds:
      return e == t + '';
    case Ps:
      var s = bs;
    case Is:
      var l = r & As;
      if ((s || (s = Rs), e.size != t.size && !l)) return !1;
      var g = a.get(e);
      if (g) return g == t;
      (r |= Fs), a.set(e, t);
      var u = ys(s(e), s(t), r, o, i, a);
      return a.delete(e), u;
    case Ts:
      if (pe) return pe.call(e) == pe.call(t);
  }
  return !1;
}
var Ls = Gs;
function zs(e, t) {
  for (var n = -1, r = t.length, o = e.length; ++n < r; ) e[o + n] = t[n];
  return e;
}
var js = zs,
  ks = js,
  Bs = M;
function qs(e, t, n) {
  var r = t(e);
  return Bs(e) ? r : ks(r, n(e));
}
var Ks = qs;
function Us(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, o = 0, i = []; ++n < r; ) {
    var a = e[n];
    t(a, n, e) && (i[o++] = a);
  }
  return i;
}
var Xs = Us;
function Ws() {
  return [];
}
var Js = Ws,
  Ys = Xs,
  Zs = Js,
  Qs = Object.prototype,
  eu = Qs.propertyIsEnumerable,
  it = Object.getOwnPropertySymbols,
  tu = it
    ? function (e) {
        return e == null
          ? []
          : ((e = Object(e)),
            Ys(it(e), function (t) {
              return eu.call(e, t);
            }));
      }
    : Zs,
  nu = tu,
  ru = Ks,
  ou = nu,
  iu = Pe;
function au(e) {
  return ru(e, iu, ou);
}
var lu = au,
  at = lu,
  su = 1,
  uu = Object.prototype,
  gu = uu.hasOwnProperty;
function du(e, t, n, r, o, i) {
  var a = n & su,
    s = at(e),
    l = s.length,
    g = at(t),
    u = g.length;
  if (l != u && !a) return !1;
  for (var d = l; d--; ) {
    var c = s[d];
    if (!(a ? c in t : gu.call(t, c))) return !1;
  }
  var f = i.get(e),
    v = i.get(t);
  if (f && v) return f == t && v == e;
  var p = !0;
  i.set(e, t), i.set(t, e);
  for (var m = a; ++d < l; ) {
    c = s[d];
    var h = e[c],
      C = t[c];
    if (r) var w = a ? r(C, h, c, t, e, i) : r(h, C, c, e, t, i);
    if (!(w === void 0 ? h === C || o(h, C, n, r, i) : w)) {
      p = !1;
      break;
    }
    m || (m = c == 'constructor');
  }
  if (p && !m) {
    var y = e.constructor,
      b = t.constructor;
    y != b &&
      'constructor' in e &&
      'constructor' in t &&
      !(typeof y == 'function' && y instanceof y && typeof b == 'function' && b instanceof b) &&
      (p = !1);
  }
  return i.delete(e), i.delete(t), p;
}
var cu = du,
  fu = I,
  pu = E,
  vu = fu(pu, 'DataView'),
  _u = vu,
  mu = I,
  hu = E,
  $u = mu(hu, 'Promise'),
  Su = $u,
  Cu = I,
  wu = E,
  yu = Cu(wu, 'Set'),
  bu = yu,
  Ru = I,
  Au = E,
  Fu = Ru(Au, 'WeakMap'),
  Eu = Fu,
  Ce = _u,
  we = Oe,
  ye = Su,
  be = bu,
  Re = Eu,
  qt = j,
  G = Dt,
  lt = '[object Map]',
  Mu = '[object Object]',
  st = '[object Promise]',
  ut = '[object Set]',
  gt = '[object WeakMap]',
  dt = '[object DataView]',
  Vu = G(Ce),
  Pu = G(we),
  Ou = G(ye),
  xu = G(be),
  Iu = G(Re),
  x = qt;
((Ce && x(new Ce(new ArrayBuffer(1))) != dt) ||
  (we && x(new we()) != lt) ||
  (ye && x(ye.resolve()) != st) ||
  (be && x(new be()) != ut) ||
  (Re && x(new Re()) != gt)) &&
  (x = function (e) {
    var t = qt(e),
      n = t == Mu ? e.constructor : void 0,
      r = n ? G(n) : '';
    if (r)
      switch (r) {
        case Vu:
          return dt;
        case Pu:
          return lt;
        case Ou:
          return st;
        case xu:
          return ut;
        case Iu:
          return gt;
      }
    return t;
  });
var Du = x,
  ve = kt,
  Tu = Bt,
  Hu = Ls,
  Nu = cu,
  ct = Du,
  ft = M,
  pt = Nt,
  Gu = Lt,
  Lu = 1,
  vt = '[object Arguments]',
  _t = '[object Array]',
  X = '[object Object]',
  zu = Object.prototype,
  mt = zu.hasOwnProperty;
function ju(e, t, n, r, o, i) {
  var a = ft(e),
    s = ft(t),
    l = a ? _t : ct(e),
    g = s ? _t : ct(t);
  (l = l == vt ? X : l), (g = g == vt ? X : g);
  var u = l == X,
    d = g == X,
    c = l == g;
  if (c && pt(e)) {
    if (!pt(t)) return !1;
    (a = !0), (u = !1);
  }
  if (c && !u)
    return i || (i = new ve()), a || Gu(e) ? Tu(e, t, n, r, o, i) : Hu(e, t, l, n, r, o, i);
  if (!(n & Lu)) {
    var f = u && mt.call(e, '__wrapped__'),
      v = d && mt.call(t, '__wrapped__');
    if (f || v) {
      var p = f ? e.value() : e,
        m = v ? t.value() : t;
      return i || (i = new ve()), o(p, m, n, r, i);
    }
  }
  return c ? (i || (i = new ve()), Nu(e, t, n, r, o, i)) : !1;
}
var ku = ju,
  Bu = ku,
  ht = k;
function Kt(e, t, n, r, o) {
  return e === t
    ? !0
    : e == null || t == null || (!ht(e) && !ht(t))
    ? e !== e && t !== t
    : Bu(e, t, n, r, Kt, o);
}
var Ut = Kt,
  qu = kt,
  Ku = Ut,
  Uu = 1,
  Xu = 2;
function Wu(e, t, n, r) {
  var o = n.length,
    i = o,
    a = !r;
  if (e == null) return !i;
  for (e = Object(e); o--; ) {
    var s = n[o];
    if (a && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1;
  }
  for (; ++o < i; ) {
    s = n[o];
    var l = s[0],
      g = e[l],
      u = s[1];
    if (a && s[2]) {
      if (g === void 0 && !(l in e)) return !1;
    } else {
      var d = new qu();
      if (r) var c = r(g, u, l, e, t, d);
      if (!(c === void 0 ? Ku(u, g, Uu | Xu, r, d) : c)) return !1;
    }
  }
  return !0;
}
var Ju = Wu,
  Yu = Me;
function Zu(e) {
  return e === e && !Yu(e);
}
var Xt = Zu,
  Qu = Xt,
  eg = Pe;
function tg(e) {
  for (var t = eg(e), n = t.length; n--; ) {
    var r = t[n],
      o = e[r];
    t[n] = [r, o, Qu(o)];
  }
  return t;
}
var ng = tg;
function rg(e, t) {
  return function (n) {
    return n == null ? !1 : n[e] === t && (t !== void 0 || e in Object(n));
  };
}
var Wt = rg,
  og = Ju,
  ig = ng,
  ag = Wt;
function lg(e) {
  var t = ig(e);
  return t.length == 1 && t[0][2]
    ? ag(t[0][0], t[0][1])
    : function (n) {
        return n === e || og(n, e, t);
      };
}
var sg = lg,
  ug = j,
  gg = k,
  dg = '[object Symbol]';
function cg(e) {
  return typeof e == 'symbol' || (gg(e) && ug(e) == dg);
}
var Ie = cg,
  fg = M,
  pg = Ie,
  vg = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  _g = /^\w*$/;
function mg(e, t) {
  if (fg(e)) return !1;
  var n = typeof e;
  return n == 'number' || n == 'symbol' || n == 'boolean' || e == null || pg(e)
    ? !0
    : _g.test(e) || !vg.test(e) || (t != null && e in Object(t));
}
var De = mg,
  Jt = xe,
  hg = 'Expected a function';
function Te(e, t) {
  if (typeof e != 'function' || (t != null && typeof t != 'function')) throw new TypeError(hg);
  var n = function () {
    var r = arguments,
      o = t ? t.apply(this, r) : r[0],
      i = n.cache;
    if (i.has(o)) return i.get(o);
    var a = e.apply(this, r);
    return (n.cache = i.set(o, a) || i), a;
  };
  return (n.cache = new (Te.Cache || Jt)()), n;
}
Te.Cache = Jt;
var $g = Te,
  Sg = $g,
  Cg = 500;
function wg(e) {
  var t = Sg(e, function (r) {
      return n.size === Cg && n.clear(), r;
    }),
    n = t.cache;
  return t;
}
var yg = wg,
  bg = yg,
  Rg =
    /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  Ag = /\\(\\)?/g,
  Fg = bg(function (e) {
    var t = [];
    return (
      e.charCodeAt(0) === 46 && t.push(''),
      e.replace(Rg, function (n, r, o, i) {
        t.push(o ? i.replace(Ag, '$1') : r || n);
      }),
      t
    );
  }),
  Eg = Fg;
function Mg(e, t) {
  for (var n = -1, r = e == null ? 0 : e.length, o = Array(r); ++n < r; ) o[n] = t(e[n], n, e);
  return o;
}
var Vg = Mg,
  $t = Q,
  Pg = Vg,
  Og = M,
  xg = Ie,
  Ig = 1 / 0,
  St = $t ? $t.prototype : void 0,
  Ct = St ? St.toString : void 0;
function Yt(e) {
  if (typeof e == 'string') return e;
  if (Og(e)) return Pg(e, Yt) + '';
  if (xg(e)) return Ct ? Ct.call(e) : '';
  var t = e + '';
  return t == '0' && 1 / e == -Ig ? '-0' : t;
}
var Dg = Yt,
  Tg = Dg;
function Hg(e) {
  return e == null ? '' : Tg(e);
}
var Ng = Hg,
  Gg = M,
  Lg = De,
  zg = Eg,
  jg = Ng;
function kg(e, t) {
  return Gg(e) ? e : Lg(e, t) ? [e] : zg(jg(e));
}
var Zt = kg,
  Bg = Ie,
  qg = 1 / 0;
function Kg(e) {
  if (typeof e == 'string' || Bg(e)) return e;
  var t = e + '';
  return t == '0' && 1 / e == -qg ? '-0' : t;
}
var oe = Kg,
  Ug = Zt,
  Xg = oe;
function Wg(e, t) {
  t = Ug(t, e);
  for (var n = 0, r = t.length; e != null && n < r; ) e = e[Xg(t[n++])];
  return n && n == r ? e : void 0;
}
var Qt = Wg,
  Jg = Qt;
function Yg(e, t, n) {
  var r = e == null ? void 0 : Jg(e, t);
  return r === void 0 ? n : r;
}
var Zg = Yg;
function Qg(e, t) {
  return e != null && t in Object(e);
}
var ed = Qg,
  td = Zt,
  nd = Ht,
  rd = M,
  od = Gt,
  id = Ve,
  ad = oe;
function ld(e, t, n) {
  t = td(t, e);
  for (var r = -1, o = t.length, i = !1; ++r < o; ) {
    var a = ad(t[r]);
    if (!(i = e != null && n(e, a))) break;
    e = e[a];
  }
  return i || ++r != o
    ? i
    : ((o = e == null ? 0 : e.length), !!o && id(o) && od(a, o) && (rd(e) || nd(e)));
}
var sd = ld,
  ud = ed,
  gd = sd;
function dd(e, t) {
  return e != null && gd(e, t, ud);
}
var cd = dd,
  fd = Ut,
  pd = Zg,
  vd = cd,
  _d = De,
  md = Xt,
  hd = Wt,
  $d = oe,
  Sd = 1,
  Cd = 2;
function wd(e, t) {
  return _d(e) && md(t)
    ? hd($d(e), t)
    : function (n) {
        var r = pd(n, e);
        return r === void 0 && r === t ? vd(n, e) : fd(t, r, Sd | Cd);
      };
}
var yd = wd;
function bd(e) {
  return e;
}
var Rd = bd;
function Ad(e) {
  return function (t) {
    return t == null ? void 0 : t[e];
  };
}
var Fd = Ad,
  Ed = Qt;
function Md(e) {
  return function (t) {
    return Ed(t, e);
  };
}
var Vd = Md,
  Pd = Fd,
  Od = Vd,
  xd = De,
  Id = oe;
function Dd(e) {
  return xd(e) ? Pd(Id(e)) : Od(e);
}
var Td = Dd,
  Hd = sg,
  Nd = yd,
  Gd = Rd,
  Ld = M,
  zd = Td;
function jd(e) {
  return typeof e == 'function'
    ? e
    : e == null
    ? Gd
    : typeof e == 'object'
    ? Ld(e)
      ? Nd(e[0], e[1])
      : Hd(e)
    : zd(e);
}
var kd = jd,
  Bd = io,
  qd = ra,
  Kd = kd,
  Ud = M;
function Xd(e, t) {
  return function (n, r) {
    var o = Ud(n) ? Bd : qd,
      i = t ? t() : {};
    return o(n, e, Kd(r), i);
  };
}
var Wd = Xd,
  Jd = ro,
  Yd = Wd,
  Zd = Yd(function (e, t, n) {
    Jd(e, n, t);
  }),
  Qd = Zd;
const ec = /* @__PURE__ */ dn(Qd);
function en({ items: e, isFetching: t, sorting: n, columns: r, onSort: o }) {
  const i = ln(() => {
      if (!Array.isArray(r) || !r.length) return qe;
      const l = ec(r, 'id');
      return qe.map(g => {
        const u = l[g.accessorKey];
        return u ? cn(g, u) : g;
      });
    }, [r]),
    a = Qn({
      columns: i,
      data: e,
      enableColumnResizing: !0,
      manualSorting: !1,
      state: {
        sorting: n
          ? [
              {
                id: n.key,
                desc: n.direction === 'desc',
              },
            ]
          : [],
      },
      onSortingChange: l => {
        if (typeof l == 'function') {
          const g = l(a.getState().sorting);
          a.setSorting(g);
        } else {
          const g = l;
          o(g[0].id, g[0].desc ? 'desc' : 'asc');
        }
      },
      getCoreRowModel: Wn(),
    }),
    s = !e.length && !t;
  return /* @__PURE__ */ wt(nn, {
    children: [
      /* @__PURE__ */ S(rn, {
        children: a.getHeaderGroups().map(({ id: l, headers: g }) =>
          /* @__PURE__ */ S(
            ae,
            {
              children: g.map(u =>
                /* @__PURE__ */ S(
                  on,
                  {
                    className: 'font-inter sticky top-0 w-1/4 bg-white',
                    children: Be(u.column.columnDef.header, u.getContext()),
                  },
                  u.id,
                ),
              ),
            },
            l,
          ),
        ),
      }),
      /* @__PURE__ */ S(an, {
        children: s
          ? /* @__PURE__ */ S(ae, {
              children: /* @__PURE__ */ S(Ne, {
                colSpan: a.getAllColumns().length,
                className: 'font-inter text-center',
                children: 'Workflows not found.',
              }),
            })
          : a.getRowModel().rows.map(l =>
              /* @__PURE__ */ S(
                ae,
                {
                  children: l.getVisibleCells().map(g =>
                    /* @__PURE__ */ S(
                      Ne,
                      {
                        className: 'max-w-1/4 w-1/4 whitespace-nowrap',
                        title: String(g.getValue()),
                        style: {
                          minWidth: `${g.column.getSize()}px`,
                        },
                        children: /* @__PURE__ */ S('div', {
                          className: 'line-clamp-1 overflow-hidden text-ellipsis break-all',
                          children: Be(g.column.columnDef.cell, g.getContext()),
                        }),
                      },
                      g.id,
                    ),
                  ),
                },
                l.id,
              ),
            ),
      }),
    ],
  });
}
en.Container = fn;
en.ScrollContainer = pn;
export { en as WorkflowsTable };
