try {
  var Ae = 'actions',
    z = 'storybook/actions',
    Ce = `${z}/panel`,
    j = `${z}/action-event`,
    Y = `${z}/action-clear`;
  var a = __REACT__,
    {
      Children: xe,
      Component: we,
      Fragment: Ne,
      Profiler: Wr,
      PureComponent: Yr,
      StrictMode: Jr,
      Suspense: qr,
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Xr,
      cloneElement: Zr,
      createContext: J,
      createElement: Kr,
      createFactory: Qr,
      createRef: en,
      forwardRef: tn,
      isValidElement: rn,
      lazy: nn,
      memo: H,
      useCallback: A,
      useContext: q,
      useDebugValue: an,
      useEffect: on,
      useImperativeHandle: sn,
      useLayoutEffect: Le,
      useMemo: Ie,
      useReducer: ln,
      useRef: un,
      useState: C,
      version: cn,
    } = __REACT__;
  var bn = __STORYBOOKAPI__,
    {
      ActiveTabs: gn,
      Consumer: hn,
      ManagerContext: En,
      Provider: yn,
      addons: re,
      combineParameters: On,
      controlOrMetaKey: vn,
      controlOrMetaSymbol: Tn,
      eventMatchesShortcut: _n,
      eventToShortcut: Rn,
      isMacLike: Sn,
      isShortcutTaken: An,
      keyToSymbol: Cn,
      merge: xn,
      mockChannel: wn,
      optionOrAltSymbol: Nn,
      shortcutMatchesShortcut: Ln,
      shortcutToHumanString: In,
      types: De,
      useAddonState: Dn,
      useArgTypes: Mn,
      useArgs: Pn,
      useChannel: Me,
      useGlobalTypes: Bn,
      useGlobals: Fn,
      useParameter: zn,
      useSharedState: jn,
      useStoryPrepared: Hn,
      useStorybookApi: Un,
      useStorybookState: kn,
    } = __STORYBOOKAPI__;
  var Yn = __STORYBOOKCOREEVENTS__,
    {
      CHANNEL_CREATED: Jn,
      CONFIG_ERROR: qn,
      CURRENT_STORY_WAS_SET: Xn,
      DOCS_PREPARED: Zn,
      DOCS_RENDERED: Kn,
      FORCE_REMOUNT: Qn,
      FORCE_RE_RENDER: ea,
      GLOBALS_UPDATED: ta,
      IGNORED_EXCEPTION: ra,
      NAVIGATE_URL: na,
      PLAY_FUNCTION_THREW_EXCEPTION: aa,
      PRELOAD_ENTRIES: oa,
      PREVIEW_BUILDER_PROGRESS: ia,
      PREVIEW_KEYDOWN: sa,
      REGISTER_SUBSCRIPTION: la,
      RESET_STORY_ARGS: ua,
      SELECT_STORY: ca,
      SET_CONFIG: fa,
      SET_CURRENT_STORY: pa,
      SET_GLOBALS: da,
      SET_INDEX: ma,
      SET_STORIES: ba,
      SHARED_STATE_CHANGED: ga,
      SHARED_STATE_SET: ha,
      STORIES_COLLAPSE_ALL: Ea,
      STORIES_EXPAND_ALL: ya,
      STORY_ARGS_UPDATED: Oa,
      STORY_CHANGED: U,
      STORY_ERRORED: va,
      STORY_INDEX_INVALIDATED: Ta,
      STORY_MISSING: _a,
      STORY_PREPARED: Ra,
      STORY_RENDERED: Sa,
      STORY_RENDER_PHASE_CHANGED: Aa,
      STORY_SPECIFIED: Ca,
      STORY_THREW_EXCEPTION: xa,
      STORY_UNCHANGED: wa,
      UPDATE_GLOBALS: Na,
      UPDATE_QUERY_PARAMS: La,
      UPDATE_STORY_ARGS: Ia,
    } = __STORYBOOKCOREEVENTS__;
  var Pe = Object.prototype.hasOwnProperty;
  function Be(e, t, r) {
    for (r of e.keys()) if (I(r, t)) return r;
  }
  function I(e, t) {
    var r, n, o;
    if (e === t) return !0;
    if (e && t && (r = e.constructor) === t.constructor) {
      if (r === Date) return e.getTime() === t.getTime();
      if (r === RegExp) return e.toString() === t.toString();
      if (r === Array) {
        if ((n = e.length) === t.length) for (; n-- && I(e[n], t[n]); );
        return n === -1;
      }
      if (r === Set) {
        if (e.size !== t.size) return !1;
        for (n of e)
          if (((o = n), (o && typeof o == 'object' && ((o = Be(t, o)), !o)) || !t.has(o)))
            return !1;
        return !0;
      }
      if (r === Map) {
        if (e.size !== t.size) return !1;
        for (n of e)
          if (
            ((o = n[0]), (o && typeof o == 'object' && ((o = Be(t, o)), !o)) || !I(n[1], t.get(o)))
          )
            return !1;
        return !0;
      }
      if (r === ArrayBuffer) (e = new Uint8Array(e)), (t = new Uint8Array(t));
      else if (r === DataView) {
        if ((n = e.byteLength) === t.byteLength) for (; n-- && e.getInt8(n) === t.getInt8(n); );
        return n === -1;
      }
      if (ArrayBuffer.isView(e)) {
        if ((n = e.byteLength) === t.byteLength) for (; n-- && e[n] === t[n]; );
        return n === -1;
      }
      if (!r || typeof e == 'object') {
        n = 0;
        for (r in e)
          if ((Pe.call(e, r) && ++n && !Pe.call(t, r)) || !(r in t) || !I(e[r], t[r])) return !1;
        return Object.keys(t).length === n;
      }
    }
    return e !== e && t !== t;
  }
  var Ua = __STORYBOOKTHEMING__,
    {
      CacheProvider: ka,
      ClassNames: Ga,
      Global: Va,
      ThemeProvider: $a,
      background: Wa,
      color: Ya,
      convert: Ja,
      create: qa,
      createCache: Xa,
      createGlobal: Za,
      createReset: Ka,
      css: Qa,
      darken: eo,
      ensure: to,
      ignoreSsrWarning: ro,
      isPropValid: no,
      jsx: ao,
      keyframes: oo,
      lighten: io,
      styled: k,
      themes: so,
      typography: lo,
      useTheme: uo,
      withTheme: Fe,
    } = __STORYBOOKTHEMING__;
  var st = Object.create,
    se = Object.defineProperty,
    lt = Object.getOwnPropertyDescriptor,
    ke = Object.getOwnPropertyNames,
    ut = Object.getPrototypeOf,
    ct = Object.prototype.hasOwnProperty,
    le = (e, t) =>
      function () {
        return t || (0, e[ke(e)[0]])((t = { exports: {} }).exports, t), t.exports;
      },
    ft = (e, t) => {
      for (var r in t) se(e, r, { get: t[r], enumerable: !0 });
    },
    pt = (e, t, r, n) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let o of ke(t))
          !ct.call(e, o) &&
            o !== r &&
            se(e, o, { get: () => t[o], enumerable: !(n = lt(t, o)) || n.enumerable });
      return e;
    },
    dt = (e, t, r) => (
      (r = e != null ? st(ut(e)) : {}),
      pt(t || !e || !e.__esModule ? se(r, 'default', { value: e, enumerable: !0 }) : r, e)
    ),
    mt = le({
      'node_modules/is-object/index.js'(e, t) {
        'use strict';
        t.exports = function (n) {
          return typeof n == 'object' && n !== null;
        };
      },
    }),
    bt = le({
      'node_modules/is-window/index.js'(e, t) {
        'use strict';
        t.exports = function (r) {
          if (r == null) return !1;
          var n = Object(r);
          return n === n.window;
        };
      },
    }),
    gt = le({
      'node_modules/is-dom/index.js'(e, t) {
        var r = mt(),
          n = bt();
        function o(i) {
          return !r(i) || !n(window) || typeof window.Node != 'function'
            ? !1
            : typeof i.nodeType == 'number' && typeof i.nodeName == 'string';
        }
        t.exports = o;
      },
    }),
    K = {};
  ft(K, { chromeDark: () => ht, chromeLight: () => Et });
  var ht = {
      BASE_FONT_FAMILY: 'Menlo, monospace',
      BASE_FONT_SIZE: '11px',
      BASE_LINE_HEIGHT: 1.2,
      BASE_BACKGROUND_COLOR: 'rgb(36, 36, 36)',
      BASE_COLOR: 'rgb(213, 213, 213)',
      OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
      OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
      OBJECT_NAME_COLOR: 'rgb(227, 110, 236)',
      OBJECT_VALUE_NULL_COLOR: 'rgb(127, 127, 127)',
      OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(127, 127, 127)',
      OBJECT_VALUE_REGEXP_COLOR: 'rgb(233, 63, 59)',
      OBJECT_VALUE_STRING_COLOR: 'rgb(233, 63, 59)',
      OBJECT_VALUE_SYMBOL_COLOR: 'rgb(233, 63, 59)',
      OBJECT_VALUE_NUMBER_COLOR: 'hsl(252, 100%, 75%)',
      OBJECT_VALUE_BOOLEAN_COLOR: 'hsl(252, 100%, 75%)',
      OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(85, 106, 242)',
      HTML_TAG_COLOR: 'rgb(93, 176, 215)',
      HTML_TAGNAME_COLOR: 'rgb(93, 176, 215)',
      HTML_TAGNAME_TEXT_TRANSFORM: 'lowercase',
      HTML_ATTRIBUTE_NAME_COLOR: 'rgb(155, 187, 220)',
      HTML_ATTRIBUTE_VALUE_COLOR: 'rgb(242, 151, 102)',
      HTML_COMMENT_COLOR: 'rgb(137, 137, 137)',
      HTML_DOCTYPE_COLOR: 'rgb(192, 192, 192)',
      ARROW_COLOR: 'rgb(145, 145, 145)',
      ARROW_MARGIN_RIGHT: 3,
      ARROW_FONT_SIZE: 12,
      ARROW_ANIMATION_DURATION: '0',
      TREENODE_FONT_FAMILY: 'Menlo, monospace',
      TREENODE_FONT_SIZE: '11px',
      TREENODE_LINE_HEIGHT: 1.2,
      TREENODE_PADDING_LEFT: 12,
      TABLE_BORDER_COLOR: 'rgb(85, 85, 85)',
      TABLE_TH_BACKGROUND_COLOR: 'rgb(44, 44, 44)',
      TABLE_TH_HOVER_COLOR: 'rgb(48, 48, 48)',
      TABLE_SORT_ICON_COLOR: 'black',
      TABLE_DATA_BACKGROUND_IMAGE:
        'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(51, 139, 255, 0.0980392) 50%, rgba(51, 139, 255, 0.0980392))',
      TABLE_DATA_BACKGROUND_SIZE: '128px 32px',
    },
    Et = {
      BASE_FONT_FAMILY: 'Menlo, monospace',
      BASE_FONT_SIZE: '11px',
      BASE_LINE_HEIGHT: 1.2,
      BASE_BACKGROUND_COLOR: 'white',
      BASE_COLOR: 'black',
      OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
      OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
      OBJECT_NAME_COLOR: 'rgb(136, 19, 145)',
      OBJECT_VALUE_NULL_COLOR: 'rgb(128, 128, 128)',
      OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(128, 128, 128)',
      OBJECT_VALUE_REGEXP_COLOR: 'rgb(196, 26, 22)',
      OBJECT_VALUE_STRING_COLOR: 'rgb(196, 26, 22)',
      OBJECT_VALUE_SYMBOL_COLOR: 'rgb(196, 26, 22)',
      OBJECT_VALUE_NUMBER_COLOR: 'rgb(28, 0, 207)',
      OBJECT_VALUE_BOOLEAN_COLOR: 'rgb(28, 0, 207)',
      OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(13, 34, 170)',
      HTML_TAG_COLOR: 'rgb(168, 148, 166)',
      HTML_TAGNAME_COLOR: 'rgb(136, 18, 128)',
      HTML_TAGNAME_TEXT_TRANSFORM: 'lowercase',
      HTML_ATTRIBUTE_NAME_COLOR: 'rgb(153, 69, 0)',
      HTML_ATTRIBUTE_VALUE_COLOR: 'rgb(26, 26, 166)',
      HTML_COMMENT_COLOR: 'rgb(35, 110, 37)',
      HTML_DOCTYPE_COLOR: 'rgb(192, 192, 192)',
      ARROW_COLOR: '#6e6e6e',
      ARROW_MARGIN_RIGHT: 3,
      ARROW_FONT_SIZE: 12,
      ARROW_ANIMATION_DURATION: '0',
      TREENODE_FONT_FAMILY: 'Menlo, monospace',
      TREENODE_FONT_SIZE: '11px',
      TREENODE_LINE_HEIGHT: 1.2,
      TREENODE_PADDING_LEFT: 12,
      TABLE_BORDER_COLOR: '#aaa',
      TABLE_TH_BACKGROUND_COLOR: '#eee',
      TABLE_TH_HOVER_COLOR: 'hsla(0, 0%, 90%, 1)',
      TABLE_SORT_ICON_COLOR: '#6e6e6e',
      TABLE_DATA_BACKGROUND_IMAGE:
        'linear-gradient(to bottom, white, white 50%, rgb(234, 243, 255) 50%, rgb(234, 243, 255))',
      TABLE_DATA_BACKGROUND_SIZE: '128px 32px',
    },
    Ge = J([{}, () => {}]),
    ne = {
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      OUserSelect: 'none',
      userSelect: 'none',
    },
    X = e => ({
      DOMNodePreview: {
        htmlOpenTag: {
          base: { color: e.HTML_TAG_COLOR },
          tagName: { color: e.HTML_TAGNAME_COLOR, textTransform: e.HTML_TAGNAME_TEXT_TRANSFORM },
          htmlAttributeName: { color: e.HTML_ATTRIBUTE_NAME_COLOR },
          htmlAttributeValue: { color: e.HTML_ATTRIBUTE_VALUE_COLOR },
        },
        htmlCloseTag: {
          base: { color: e.HTML_TAG_COLOR },
          offsetLeft: { marginLeft: -e.TREENODE_PADDING_LEFT },
          tagName: { color: e.HTML_TAGNAME_COLOR, textTransform: e.HTML_TAGNAME_TEXT_TRANSFORM },
        },
        htmlComment: { color: e.HTML_COMMENT_COLOR },
        htmlDoctype: { color: e.HTML_DOCTYPE_COLOR },
      },
      ObjectPreview: {
        objectDescription: { fontStyle: 'italic' },
        preview: { fontStyle: 'italic' },
        arrayMaxProperties: e.OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES,
        objectMaxProperties: e.OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES,
      },
      ObjectName: { base: { color: e.OBJECT_NAME_COLOR }, dimmed: { opacity: 0.6 } },
      ObjectValue: {
        objectValueNull: { color: e.OBJECT_VALUE_NULL_COLOR },
        objectValueUndefined: { color: e.OBJECT_VALUE_UNDEFINED_COLOR },
        objectValueRegExp: { color: e.OBJECT_VALUE_REGEXP_COLOR },
        objectValueString: { color: e.OBJECT_VALUE_STRING_COLOR },
        objectValueSymbol: { color: e.OBJECT_VALUE_SYMBOL_COLOR },
        objectValueNumber: { color: e.OBJECT_VALUE_NUMBER_COLOR },
        objectValueBoolean: { color: e.OBJECT_VALUE_BOOLEAN_COLOR },
        objectValueFunctionPrefix: {
          color: e.OBJECT_VALUE_FUNCTION_PREFIX_COLOR,
          fontStyle: 'italic',
        },
        objectValueFunctionName: { fontStyle: 'italic' },
      },
      TreeView: { treeViewOutline: { padding: 0, margin: 0, listStyleType: 'none' } },
      TreeNode: {
        treeNodeBase: {
          color: e.BASE_COLOR,
          backgroundColor: e.BASE_BACKGROUND_COLOR,
          lineHeight: e.TREENODE_LINE_HEIGHT,
          cursor: 'default',
          boxSizing: 'border-box',
          listStyle: 'none',
          fontFamily: e.TREENODE_FONT_FAMILY,
          fontSize: e.TREENODE_FONT_SIZE,
        },
        treeNodePreviewContainer: {},
        treeNodePlaceholder: {
          whiteSpace: 'pre',
          fontSize: e.ARROW_FONT_SIZE,
          marginRight: e.ARROW_MARGIN_RIGHT,
          ...ne,
        },
        treeNodeArrow: {
          base: {
            color: e.ARROW_COLOR,
            display: 'inline-block',
            fontSize: e.ARROW_FONT_SIZE,
            marginRight: e.ARROW_MARGIN_RIGHT,
            ...(parseFloat(e.ARROW_ANIMATION_DURATION) > 0
              ? { transition: `transform ${e.ARROW_ANIMATION_DURATION} ease 0s` }
              : {}),
            ...ne,
          },
          expanded: {
            WebkitTransform: 'rotateZ(90deg)',
            MozTransform: 'rotateZ(90deg)',
            transform: 'rotateZ(90deg)',
          },
          collapsed: {
            WebkitTransform: 'rotateZ(0deg)',
            MozTransform: 'rotateZ(0deg)',
            transform: 'rotateZ(0deg)',
          },
        },
        treeNodeChildNodesContainer: { margin: 0, paddingLeft: e.TREENODE_PADDING_LEFT },
      },
      TableInspector: {
        base: {
          color: e.BASE_COLOR,
          position: 'relative',
          border: `1px solid ${e.TABLE_BORDER_COLOR}`,
          fontFamily: e.BASE_FONT_FAMILY,
          fontSize: e.BASE_FONT_SIZE,
          lineHeight: '120%',
          boxSizing: 'border-box',
          cursor: 'default',
        },
      },
      TableInspectorHeaderContainer: {
        base: { top: 0, height: '17px', left: 0, right: 0, overflowX: 'hidden' },
        table: {
          tableLayout: 'fixed',
          borderSpacing: 0,
          borderCollapse: 'separate',
          height: '100%',
          width: '100%',
          margin: 0,
        },
      },
      TableInspectorDataContainer: {
        tr: { display: 'table-row' },
        td: {
          boxSizing: 'border-box',
          border: 'none',
          height: '16px',
          verticalAlign: 'top',
          padding: '1px 4px',
          WebkitUserSelect: 'text',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          lineHeight: '14px',
        },
        div: {
          position: 'static',
          top: '17px',
          bottom: 0,
          overflowY: 'overlay',
          transform: 'translateZ(0)',
          left: 0,
          right: 0,
          overflowX: 'hidden',
        },
        table: {
          positon: 'static',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          borderTop: '0 none transparent',
          margin: 0,
          backgroundImage: e.TABLE_DATA_BACKGROUND_IMAGE,
          backgroundSize: e.TABLE_DATA_BACKGROUND_SIZE,
          tableLayout: 'fixed',
          borderSpacing: 0,
          borderCollapse: 'separate',
          width: '100%',
          fontSize: e.BASE_FONT_SIZE,
          lineHeight: '120%',
        },
      },
      TableInspectorTH: {
        base: {
          position: 'relative',
          height: 'auto',
          textAlign: 'left',
          backgroundColor: e.TABLE_TH_BACKGROUND_COLOR,
          borderBottom: `1px solid ${e.TABLE_BORDER_COLOR}`,
          fontWeight: 'normal',
          verticalAlign: 'middle',
          padding: '0 4px',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          lineHeight: '14px',
          ':hover': { backgroundColor: e.TABLE_TH_HOVER_COLOR },
        },
        div: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          fontSize: e.BASE_FONT_SIZE,
          lineHeight: '120%',
        },
      },
      TableInspectorLeftBorder: {
        none: { borderLeft: 'none' },
        solid: { borderLeft: `1px solid ${e.TABLE_BORDER_COLOR}` },
      },
      TableInspectorSortIcon: {
        display: 'block',
        marginRight: 3,
        width: 8,
        height: 7,
        marginTop: -7,
        color: e.TABLE_SORT_ICON_COLOR,
        fontSize: 12,
        ...ne,
      },
    }),
    ae = 'chromeLight',
    Ve = J(X(K[ae])),
    _ = e => q(Ve)[e],
    ue =
      e =>
      ({ theme: r = ae, ...n }) => {
        let o = Ie(() => {
          switch (Object.prototype.toString.call(r)) {
            case '[object String]':
              return X(K[r]);
            case '[object Object]':
              return X(r);
            default:
              return X(K[ae]);
          }
        }, [r]);
        return a.createElement(Ve.Provider, { value: o }, a.createElement(e, { ...n }));
      },
    yt = ({ expanded: e, styles: t }) =>
      a.createElement(
        'span',
        { style: { ...t.base, ...(e ? t.expanded : t.collapsed) } },
        '\u25B6',
      ),
    Ot = H(e => {
      e = {
        expanded: !0,
        nodeRenderer: ({ name: f }) => a.createElement('span', null, f),
        onClick: () => {},
        shouldShowArrow: !1,
        shouldShowPlaceholder: !0,
        ...e,
      };
      let {
          expanded: t,
          onClick: r,
          children: n,
          nodeRenderer: o,
          title: i,
          shouldShowArrow: u,
          shouldShowPlaceholder: s,
        } = e,
        l = _('TreeNode'),
        c = o;
      return a.createElement(
        'li',
        { 'aria-expanded': t, role: 'treeitem', style: l.treeNodeBase, title: i },
        a.createElement(
          'div',
          { style: l.treeNodePreviewContainer, onClick: r },
          u || xe.count(n) > 0
            ? a.createElement(yt, { expanded: t, styles: l.treeNodeArrow })
            : s && a.createElement('span', { style: l.treeNodePlaceholder }, '\xA0'),
          a.createElement(c, { ...e }),
        ),
        a.createElement(
          'ol',
          { role: 'group', style: l.treeNodeChildNodesContainer },
          t ? n : void 0,
        ),
      );
    }),
    Q = '$',
    ze = '*';
  function Z(e, t) {
    return !t(e).next().done;
  }
  var vt = e =>
      Array.from({ length: e }, (t, r) =>
        [Q].concat(Array.from({ length: r }, () => '*')).join('.'),
      ),
    Tt = (e, t, r, n, o) => {
      let i = []
          .concat(vt(n))
          .concat(r)
          .filter(s => typeof s == 'string'),
        u = [];
      return (
        i.forEach(s => {
          let l = s.split('.'),
            c = (f, d, p) => {
              if (p === l.length) {
                u.push(d);
                return;
              }
              let E = l[p];
              if (p === 0) Z(f, t) && (E === Q || E === ze) && c(f, Q, p + 1);
              else if (E === ze)
                for (let { name: h, data: y } of t(f)) Z(y, t) && c(y, `${d}.${h}`, p + 1);
              else {
                let h = f[E];
                Z(h, t) && c(h, `${d}.${E}`, p + 1);
              }
            };
          c(e, '', 0);
        }),
        u.reduce((s, l) => ((s[l] = !0), s), { ...o })
      );
    },
    $e = H(e => {
      let { data: t, dataIterator: r, path: n, depth: o, nodeRenderer: i } = e,
        [u, s] = q(Ge),
        l = Z(t, r),
        c = !!u[n],
        f = A(() => l && s(d => ({ ...d, [n]: !c })), [l, s, n, c]);
      return a.createElement(
        Ot,
        {
          expanded: c,
          onClick: f,
          shouldShowArrow: l,
          shouldShowPlaceholder: o > 0,
          nodeRenderer: i,
          ...e,
        },
        c
          ? [...r(t)].map(({ name: d, data: p, ...E }) =>
              a.createElement($e, {
                name: d,
                data: p,
                depth: o + 1,
                path: `${n}.${d}`,
                key: d,
                dataIterator: r,
                nodeRenderer: i,
                ...E,
              }),
            )
          : null,
      );
    }),
    We = H(
      ({ name: e, data: t, dataIterator: r, nodeRenderer: n, expandPaths: o, expandLevel: i }) => {
        let u = _('TreeView'),
          s = C({}),
          [, l] = s;
        return (
          Le(() => l(c => Tt(t, r, o, i, c)), [t, r, o, i]),
          a.createElement(
            Ge.Provider,
            { value: s },
            a.createElement(
              'ol',
              { role: 'tree', style: u.treeViewOutline },
              a.createElement($e, {
                name: e,
                data: t,
                dataIterator: r,
                depth: 0,
                path: Q,
                nodeRenderer: n,
              }),
            ),
          )
        );
      },
    ),
    ce = ({ name: e, dimmed: t = !1, styles: r = {} }) => {
      let n = _('ObjectName'),
        o = { ...n.base, ...(t ? n.dimmed : {}), ...r };
      return a.createElement('span', { style: o }, e);
    },
    G = ({ object: e, styles: t }) => {
      let r = _('ObjectValue'),
        n = o => ({ ...r[o], ...t });
      switch (typeof e) {
        case 'bigint':
          return a.createElement('span', { style: n('objectValueNumber') }, String(e), 'n');
        case 'number':
          return a.createElement('span', { style: n('objectValueNumber') }, String(e));
        case 'string':
          return a.createElement('span', { style: n('objectValueString') }, '"', e, '"');
        case 'boolean':
          return a.createElement('span', { style: n('objectValueBoolean') }, String(e));
        case 'undefined':
          return a.createElement('span', { style: n('objectValueUndefined') }, 'undefined');
        case 'object':
          return e === null
            ? a.createElement('span', { style: n('objectValueNull') }, 'null')
            : e instanceof Date
            ? a.createElement('span', null, e.toString())
            : e instanceof RegExp
            ? a.createElement('span', { style: n('objectValueRegExp') }, e.toString())
            : Array.isArray(e)
            ? a.createElement('span', null, `Array(${e.length})`)
            : e.constructor
            ? typeof e.constructor.isBuffer == 'function' && e.constructor.isBuffer(e)
              ? a.createElement('span', null, `Buffer[${e.length}]`)
              : a.createElement('span', null, e.constructor.name)
            : a.createElement('span', null, 'Object');
        case 'function':
          return a.createElement(
            'span',
            null,
            a.createElement('span', { style: n('objectValueFunctionPrefix') }, '\u0192\xA0'),
            a.createElement('span', { style: n('objectValueFunctionName') }, e.name, '()'),
          );
        case 'symbol':
          return a.createElement('span', { style: n('objectValueSymbol') }, e.toString());
        default:
          return a.createElement('span', null);
      }
    },
    Ye = Object.prototype.hasOwnProperty,
    _t = Object.prototype.propertyIsEnumerable;
  function oe(e, t) {
    let r = Object.getOwnPropertyDescriptor(e, t);
    if (r.get)
      try {
        return r.get();
      } catch {
        return r.get;
      }
    return e[t];
  }
  function je(e, t) {
    return e.length === 0 ? [] : e.slice(1).reduce((r, n) => r.concat([t, n]), [e[0]]);
  }
  var ie = ({ data: e }) => {
      let t = _('ObjectPreview'),
        r = e;
      if (typeof r != 'object' || r === null || r instanceof Date || r instanceof RegExp)
        return a.createElement(G, { object: r });
      if (Array.isArray(r)) {
        let n = t.arrayMaxProperties,
          o = r.slice(0, n).map((u, s) => a.createElement(G, { key: s, object: u }));
        r.length > n && o.push(a.createElement('span', { key: 'ellipsis' }, '\u2026'));
        let i = r.length;
        return a.createElement(
          a.Fragment,
          null,
          a.createElement('span', { style: t.objectDescription }, i === 0 ? '' : `(${i})\xA0`),
          a.createElement('span', { style: t.preview }, '[', je(o, ', '), ']'),
        );
      } else {
        let n = t.objectMaxProperties,
          o = [];
        for (let u in r)
          if (Ye.call(r, u)) {
            let s;
            o.length === n - 1 &&
              Object.keys(r).length > n &&
              (s = a.createElement('span', { key: 'ellipsis' }, '\u2026'));
            let l = oe(r, u);
            if (
              (o.push(
                a.createElement(
                  'span',
                  { key: u },
                  a.createElement(ce, { name: u || '""' }),
                  ':\xA0',
                  a.createElement(G, { object: l }),
                  s,
                ),
              ),
              s)
            )
              break;
          }
        let i = r.constructor ? r.constructor.name : 'Object';
        return a.createElement(
          a.Fragment,
          null,
          a.createElement('span', { style: t.objectDescription }, i === 'Object' ? '' : `${i} `),
          a.createElement('span', { style: t.preview }, '{', je(o, ', '), '}'),
        );
      }
    },
    Rt = ({ name: e, data: t }) =>
      typeof e == 'string'
        ? a.createElement(
            'span',
            null,
            a.createElement(ce, { name: e }),
            a.createElement('span', null, ': '),
            a.createElement(ie, { data: t }),
          )
        : a.createElement(ie, { data: t }),
    St = ({ name: e, data: t, isNonenumerable: r = !1 }) => {
      let n = t;
      return a.createElement(
        'span',
        null,
        typeof e == 'string'
          ? a.createElement(ce, { name: e, dimmed: r })
          : a.createElement(ie, { data: e }),
        a.createElement('span', null, ': '),
        a.createElement(G, { object: n }),
      );
    },
    At = (e, t) =>
      function* (n) {
        if (!((typeof n == 'object' && n !== null) || typeof n == 'function')) return;
        let i = Array.isArray(n);
        if (!i && n[Symbol.iterator]) {
          let u = 0;
          for (let s of n) {
            if (Array.isArray(s) && s.length === 2) {
              let [l, c] = s;
              yield { name: l, data: c };
            } else yield { name: u.toString(), data: s };
            u++;
          }
        } else {
          let u = Object.getOwnPropertyNames(n);
          t === !0 && !i ? u.sort() : typeof t == 'function' && u.sort(t);
          for (let s of u)
            if (_t.call(n, s)) {
              let l = oe(n, s);
              yield { name: s || '""', data: l };
            } else if (e) {
              let l;
              try {
                l = oe(n, s);
              } catch {}
              l !== void 0 && (yield { name: s, data: l, isNonenumerable: !0 });
            }
          e &&
            n !== Object.prototype &&
            (yield { name: '__proto__', data: Object.getPrototypeOf(n), isNonenumerable: !0 });
        }
      },
    Ct = ({ depth: e, name: t, data: r, isNonenumerable: n }) =>
      e === 0
        ? a.createElement(Rt, { name: t, data: r })
        : a.createElement(St, { name: t, data: r, isNonenumerable: n }),
    xt = ({ showNonenumerable: e = !1, sortObjectKeys: t, nodeRenderer: r, ...n }) => {
      let o = At(e, t),
        i = r || Ct;
      return a.createElement(We, { nodeRenderer: i, dataIterator: o, ...n });
    },
    wt = ue(xt);
  function Nt(e) {
    if (typeof e == 'object') {
      let t = [];
      if (Array.isArray(e)) {
        let n = e.length;
        t = [...Array(n).keys()];
      } else e !== null && (t = Object.keys(e));
      let r = t.reduce((n, o) => {
        let i = e[o];
        return (
          typeof i == 'object' &&
            i !== null &&
            Object.keys(i).reduce((s, l) => (s.includes(l) || s.push(l), s), n),
          n
        );
      }, []);
      return { rowHeaders: t, colHeaders: r };
    }
  }
  var Lt = ({ rows: e, columns: t, rowsData: r }) => {
      let n = _('TableInspectorDataContainer'),
        o = _('TableInspectorLeftBorder');
      return a.createElement(
        'div',
        { style: n.div },
        a.createElement(
          'table',
          { style: n.table },
          a.createElement('colgroup', null),
          a.createElement(
            'tbody',
            null,
            e.map((i, u) =>
              a.createElement(
                'tr',
                { key: i, style: n.tr },
                a.createElement('td', { style: { ...n.td, ...o.none } }, i),
                t.map(s => {
                  let l = r[u];
                  return typeof l == 'object' && l !== null && Ye.call(l, s)
                    ? a.createElement(
                        'td',
                        { key: s, style: { ...n.td, ...o.solid } },
                        a.createElement(G, { object: l[s] }),
                      )
                    : a.createElement('td', { key: s, style: { ...n.td, ...o.solid } });
                }),
              ),
            ),
          ),
        ),
      );
    },
    It = e =>
      a.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: 1,
            right: 0,
            bottom: 1,
            display: 'flex',
            alignItems: 'center',
          },
        },
        e.children,
      ),
    Dt = ({ sortAscending: e }) => {
      let t = _('TableInspectorSortIcon'),
        r = e ? '\u25B2' : '\u25BC';
      return a.createElement('div', { style: t }, r);
    },
    He = ({
      sortAscending: e = !1,
      sorted: t = !1,
      onClick: r = void 0,
      borderStyle: n = {},
      children: o,
      ...i
    }) => {
      let u = _('TableInspectorTH'),
        [s, l] = C(!1),
        c = A(() => l(!0), []),
        f = A(() => l(!1), []);
      return a.createElement(
        'th',
        {
          ...i,
          style: { ...u.base, ...n, ...(s ? u.base[':hover'] : {}) },
          onMouseEnter: c,
          onMouseLeave: f,
          onClick: r,
        },
        a.createElement('div', { style: u.div }, o),
        t && a.createElement(It, null, a.createElement(Dt, { sortAscending: e })),
      );
    },
    Mt = ({
      indexColumnText: e = '(index)',
      columns: t = [],
      sorted: r,
      sortIndexColumn: n,
      sortColumn: o,
      sortAscending: i,
      onTHClick: u,
      onIndexTHClick: s,
    }) => {
      let l = _('TableInspectorHeaderContainer'),
        c = _('TableInspectorLeftBorder');
      return a.createElement(
        'div',
        { style: l.base },
        a.createElement(
          'table',
          { style: l.table },
          a.createElement(
            'tbody',
            null,
            a.createElement(
              'tr',
              null,
              a.createElement(
                He,
                { borderStyle: c.none, sorted: r && n, sortAscending: i, onClick: s },
                e,
              ),
              t.map(f =>
                a.createElement(
                  He,
                  {
                    borderStyle: c.solid,
                    key: f,
                    sorted: r && o === f,
                    sortAscending: i,
                    onClick: u.bind(null, f),
                  },
                  f,
                ),
              ),
            ),
          ),
        ),
      );
    },
    Pt = ({ data: e, columns: t }) => {
      let r = _('TableInspector'),
        [{ sorted: n, sortIndexColumn: o, sortColumn: i, sortAscending: u }, s] = C({
          sorted: !1,
          sortIndexColumn: !1,
          sortColumn: void 0,
          sortAscending: !1,
        }),
        l = A(() => {
          s(({ sortIndexColumn: h, sortAscending: y }) => ({
            sorted: !0,
            sortIndexColumn: !0,
            sortColumn: void 0,
            sortAscending: h ? !y : !0,
          }));
        }, []),
        c = A(h => {
          s(({ sortColumn: y, sortAscending: O }) => ({
            sorted: !0,
            sortIndexColumn: !1,
            sortColumn: h,
            sortAscending: h === y ? !O : !0,
          }));
        }, []);
      if (typeof e != 'object' || e === null) return a.createElement('div', null);
      let { rowHeaders: f, colHeaders: d } = Nt(e);
      t !== void 0 && (d = t);
      let p = f.map(h => e[h]),
        E;
      if (
        (i !== void 0
          ? (E = p.map((h, y) => (typeof h == 'object' && h !== null ? [h[i], y] : [void 0, y])))
          : o && (E = f.map((h, y) => [f[y], y])),
        E !== void 0)
      ) {
        let h = (O, L) => (ot, it) => {
            let Oe = O(ot),
              ve = O(it),
              Te = typeof Oe,
              _e = typeof ve,
              Re = (F, Se) => (F < Se ? -1 : F > Se ? 1 : 0),
              B;
            if (Te === _e) B = Re(Oe, ve);
            else {
              let F = {
                string: 0,
                number: 1,
                object: 2,
                symbol: 3,
                boolean: 4,
                undefined: 5,
                function: 6,
              };
              B = Re(F[Te], F[_e]);
            }
            return L || (B = -B), B;
          },
          y = E.sort(h(O => O[0], u)).map(O => O[1]);
        (f = y.map(O => f[O])), (p = y.map(O => p[O]));
      }
      return a.createElement(
        'div',
        { style: r.base },
        a.createElement(Mt, {
          columns: d,
          sorted: n,
          sortIndexColumn: o,
          sortColumn: i,
          sortAscending: u,
          onTHClick: c,
          onIndexTHClick: l,
        }),
        a.createElement(Lt, { rows: f, columns: d, rowsData: p }),
      );
    },
    Bt = ue(Pt),
    Ft = 80,
    Je = e =>
      e.childNodes.length === 0 ||
      (e.childNodes.length === 1 &&
        e.childNodes[0].nodeType === Node.TEXT_NODE &&
        e.textContent.length < Ft),
    zt = ({ tagName: e, attributes: t, styles: r }) =>
      a.createElement(
        'span',
        { style: r.base },
        '<',
        a.createElement('span', { style: r.tagName }, e),
        (() => {
          if (t) {
            let n = [];
            for (let o = 0; o < t.length; o++) {
              let i = t[o];
              n.push(
                a.createElement(
                  'span',
                  { key: o },
                  ' ',
                  a.createElement('span', { style: r.htmlAttributeName }, i.name),
                  '="',
                  a.createElement('span', { style: r.htmlAttributeValue }, i.value),
                  '"',
                ),
              );
            }
            return n;
          }
        })(),
        '>',
      ),
    Ue = ({ tagName: e, isChildNode: t = !1, styles: r }) =>
      a.createElement(
        'span',
        { style: Object.assign({}, r.base, t && r.offsetLeft) },
        '</',
        a.createElement('span', { style: r.tagName }, e),
        '>',
      ),
    jt = {
      1: 'ELEMENT_NODE',
      3: 'TEXT_NODE',
      7: 'PROCESSING_INSTRUCTION_NODE',
      8: 'COMMENT_NODE',
      9: 'DOCUMENT_NODE',
      10: 'DOCUMENT_TYPE_NODE',
      11: 'DOCUMENT_FRAGMENT_NODE',
    },
    Ht = ({ isCloseTag: e, data: t, expanded: r }) => {
      let n = _('DOMNodePreview');
      if (e)
        return a.createElement(Ue, { styles: n.htmlCloseTag, isChildNode: !0, tagName: t.tagName });
      switch (t.nodeType) {
        case Node.ELEMENT_NODE:
          return a.createElement(
            'span',
            null,
            a.createElement(zt, {
              tagName: t.tagName,
              attributes: t.attributes,
              styles: n.htmlOpenTag,
            }),
            Je(t) ? t.textContent : !r && '\u2026',
            !r && a.createElement(Ue, { tagName: t.tagName, styles: n.htmlCloseTag }),
          );
        case Node.TEXT_NODE:
          return a.createElement('span', null, t.textContent);
        case Node.CDATA_SECTION_NODE:
          return a.createElement('span', null, '<![CDATA[' + t.textContent + ']]>');
        case Node.COMMENT_NODE:
          return a.createElement('span', { style: n.htmlComment }, '<!--', t.textContent, '-->');
        case Node.PROCESSING_INSTRUCTION_NODE:
          return a.createElement('span', null, t.nodeName);
        case Node.DOCUMENT_TYPE_NODE:
          return a.createElement(
            'span',
            { style: n.htmlDoctype },
            '<!DOCTYPE ',
            t.name,
            t.publicId ? ` PUBLIC "${t.publicId}"` : '',
            !t.publicId && t.systemId ? ' SYSTEM' : '',
            t.systemId ? ` "${t.systemId}"` : '',
            '>',
          );
        case Node.DOCUMENT_NODE:
          return a.createElement('span', null, t.nodeName);
        case Node.DOCUMENT_FRAGMENT_NODE:
          return a.createElement('span', null, t.nodeName);
        default:
          return a.createElement('span', null, jt[t.nodeType]);
      }
    },
    Ut = function* (e) {
      if (e && e.childNodes) {
        if (Je(e)) return;
        for (let r = 0; r < e.childNodes.length; r++) {
          let n = e.childNodes[r];
          (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length === 0) ||
            (yield { name: `${n.tagName}[${r}]`, data: n });
        }
        e.tagName && (yield { name: 'CLOSE_TAG', data: { tagName: e.tagName }, isCloseTag: !0 });
      }
    },
    kt = e => a.createElement(We, { nodeRenderer: Ht, dataIterator: Ut, ...e }),
    Gt = ue(kt),
    Vt = dt(gt()),
    qe = ({ table: e = !1, data: t, ...r }) =>
      e
        ? a.createElement(Bt, { data: t, ...r })
        : (0, Vt.default)(t)
        ? a.createElement(Gt, { data: t, ...r })
        : a.createElement(wt, { data: t, ...r });
  var Bo = __STORYBOOKCOMPONENTS__,
    {
      A: Fo,
      ActionBar: Xe,
      AddonPanel: zo,
      Badge: jo,
      Bar: Ho,
      Blockquote: Uo,
      Button: ko,
      Code: Go,
      DL: Vo,
      Div: $o,
      DocumentWrapper: Wo,
      ErrorFormatter: Yo,
      FlexBar: Jo,
      Form: qo,
      H1: Xo,
      H2: Zo,
      H3: Ko,
      H4: Qo,
      H5: ei,
      H6: ti,
      HR: ri,
      IconButton: ni,
      IconButtonSkeleton: ai,
      Icons: oi,
      Img: ii,
      LI: si,
      Link: li,
      ListItem: ui,
      Loader: ci,
      OL: fi,
      P: pi,
      Placeholder: di,
      Pre: mi,
      ResetWrapper: bi,
      ScrollArea: Ze,
      Separator: gi,
      Spaced: hi,
      Span: Ei,
      StorybookIcon: yi,
      StorybookLogo: Oi,
      Symbols: vi,
      SyntaxHighlighter: Ti,
      TT: _i,
      TabBar: Ri,
      TabButton: Si,
      TabWrapper: Ai,
      Table: Ci,
      Tabs: xi,
      TabsState: wi,
      TooltipLinkList: Ni,
      TooltipMessage: Li,
      TooltipNote: Ii,
      UL: Di,
      WithTooltip: Mi,
      WithTooltipPure: Pi,
      Zoom: Bi,
      codeCommon: Fi,
      components: zi,
      createCopyToClipboardFunction: ji,
      getStoryHref: Hi,
      icons: Ui,
      interleaveSeparators: ki,
      nameSpaceClassNames: Gi,
      resetComponents: Vi,
      withReset: $i,
    } = __STORYBOOKCOMPONENTS__;
  function v() {
    return (
      (v = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = arguments[t];
              for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            }
            return e;
          }),
      v.apply(this, arguments)
    );
  }
  function fe(e) {
    if (e === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  function S(e, t) {
    return (
      (S = Object.setPrototypeOf
        ? Object.setPrototypeOf.bind()
        : function (n, o) {
            return (n.__proto__ = o), n;
          }),
      S(e, t)
    );
  }
  function pe(e, t) {
    (e.prototype = Object.create(t.prototype)), (e.prototype.constructor = e), S(e, t);
  }
  function V(e) {
    return (
      (V = Object.setPrototypeOf
        ? Object.getPrototypeOf.bind()
        : function (r) {
            return r.__proto__ || Object.getPrototypeOf(r);
          }),
      V(e)
    );
  }
  function de(e) {
    return Function.toString.call(e).indexOf('[native code]') !== -1;
  }
  function me() {
    if (typeof Reflect > 'u' || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == 'function') return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;
    } catch {
      return !1;
    }
  }
  function D(e, t, r) {
    return (
      me()
        ? (D = Reflect.construct.bind())
        : (D = function (o, i, u) {
            var s = [null];
            s.push.apply(s, i);
            var l = Function.bind.apply(o, s),
              c = new l();
            return u && S(c, u.prototype), c;
          }),
      D.apply(null, arguments)
    );
  }
  function $(e) {
    var t = typeof Map == 'function' ? new Map() : void 0;
    return (
      ($ = function (n) {
        if (n === null || !de(n)) return n;
        if (typeof n != 'function')
          throw new TypeError('Super expression must either be null or a function');
        if (typeof t < 'u') {
          if (t.has(n)) return t.get(n);
          t.set(n, o);
        }
        function o() {
          return D(n, arguments, V(this).constructor);
        }
        return (
          (o.prototype = Object.create(n.prototype, {
            constructor: { value: o, enumerable: !1, writable: !0, configurable: !0 },
          })),
          S(o, n)
        );
      }),
      $(e)
    );
  }
  var T = (function (e) {
    pe(t, e);
    function t(r) {
      var n;
      if (!0)
        n =
          e.call(
            this,
            'An error occurred. See https://github.com/styled-components/polished/blob/main/src/internalHelpers/errors.md#' +
              r +
              ' for more information.',
          ) || this;
      else for (var o, i, u; u < o; u++);
      return fe(n);
    }
    return t;
  })($(Error));
  function Ke(e, t) {
    return e.substr(-t.length) === t;
  }
  var $t = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
  function Qe(e) {
    if (typeof e != 'string') return e;
    var t = e.match($t);
    return t ? parseFloat(e) : e;
  }
  var Wt = function (t) {
      return function (r, n) {
        n === void 0 && (n = '16px');
        var o = r,
          i = n;
        if (typeof r == 'string') {
          if (!Ke(r, 'px')) throw new T(69, t, r);
          o = Qe(r);
        }
        if (typeof n == 'string') {
          if (!Ke(n, 'px')) throw new T(70, t, n);
          i = Qe(n);
        }
        if (typeof o == 'string') throw new T(71, r, t);
        if (typeof i == 'string') throw new T(72, n, t);
        return '' + o / i + t;
      };
    },
    tt = Wt,
    qs = tt('em');
  var Xs = tt('rem');
  function be(e) {
    return Math.round(e * 255);
  }
  function Yt(e, t, r) {
    return be(e) + ',' + be(t) + ',' + be(r);
  }
  function W(e, t, r, n) {
    if ((n === void 0 && (n = Yt), t === 0)) return n(r, r, r);
    var o = (((e % 360) + 360) % 360) / 60,
      i = (1 - Math.abs(2 * r - 1)) * t,
      u = i * (1 - Math.abs((o % 2) - 1)),
      s = 0,
      l = 0,
      c = 0;
    o >= 0 && o < 1
      ? ((s = i), (l = u))
      : o >= 1 && o < 2
      ? ((s = u), (l = i))
      : o >= 2 && o < 3
      ? ((l = i), (c = u))
      : o >= 3 && o < 4
      ? ((l = u), (c = i))
      : o >= 4 && o < 5
      ? ((s = u), (c = i))
      : o >= 5 && o < 6 && ((s = i), (c = u));
    var f = r - i / 2,
      d = s + f,
      p = l + f,
      E = c + f;
    return n(d, p, E);
  }
  var et = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '00ffff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000',
    blanchedalmond: 'ffebcd',
    blue: '0000ff',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '00ffff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkgrey: 'a9a9a9',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'ff00ff',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    grey: '808080',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgray: 'd3d3d3',
    lightgreen: '90ee90',
    lightgrey: 'd3d3d3',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '789',
    lightslategrey: '789',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '0f0',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'f0f',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370db',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'db7093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    rebeccapurple: '639',
    red: 'f00',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    wheat: 'f5deb3',
    white: 'fff',
    whitesmoke: 'f5f5f5',
    yellow: 'ff0',
    yellowgreen: '9acd32',
  };
  function Jt(e) {
    if (typeof e != 'string') return e;
    var t = e.toLowerCase();
    return et[t] ? '#' + et[t] : e;
  }
  var qt = /^#[a-fA-F0-9]{6}$/,
    Xt = /^#[a-fA-F0-9]{8}$/,
    Zt = /^#[a-fA-F0-9]{3}$/,
    Kt = /^#[a-fA-F0-9]{4}$/,
    ge = /^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,
    Qt =
      /^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,
    er =
      /^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,
    tr =
      /^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
  function M(e) {
    if (typeof e != 'string') throw new T(3);
    var t = Jt(e);
    if (t.match(qt))
      return {
        red: parseInt('' + t[1] + t[2], 16),
        green: parseInt('' + t[3] + t[4], 16),
        blue: parseInt('' + t[5] + t[6], 16),
      };
    if (t.match(Xt)) {
      var r = parseFloat((parseInt('' + t[7] + t[8], 16) / 255).toFixed(2));
      return {
        red: parseInt('' + t[1] + t[2], 16),
        green: parseInt('' + t[3] + t[4], 16),
        blue: parseInt('' + t[5] + t[6], 16),
        alpha: r,
      };
    }
    if (t.match(Zt))
      return {
        red: parseInt('' + t[1] + t[1], 16),
        green: parseInt('' + t[2] + t[2], 16),
        blue: parseInt('' + t[3] + t[3], 16),
      };
    if (t.match(Kt)) {
      var n = parseFloat((parseInt('' + t[4] + t[4], 16) / 255).toFixed(2));
      return {
        red: parseInt('' + t[1] + t[1], 16),
        green: parseInt('' + t[2] + t[2], 16),
        blue: parseInt('' + t[3] + t[3], 16),
        alpha: n,
      };
    }
    var o = ge.exec(t);
    if (o)
      return {
        red: parseInt('' + o[1], 10),
        green: parseInt('' + o[2], 10),
        blue: parseInt('' + o[3], 10),
      };
    var i = Qt.exec(t.substring(0, 50));
    if (i)
      return {
        red: parseInt('' + i[1], 10),
        green: parseInt('' + i[2], 10),
        blue: parseInt('' + i[3], 10),
        alpha: parseFloat('' + i[4]) > 1 ? parseFloat('' + i[4]) / 100 : parseFloat('' + i[4]),
      };
    var u = er.exec(t);
    if (u) {
      var s = parseInt('' + u[1], 10),
        l = parseInt('' + u[2], 10) / 100,
        c = parseInt('' + u[3], 10) / 100,
        f = 'rgb(' + W(s, l, c) + ')',
        d = ge.exec(f);
      if (!d) throw new T(4, t, f);
      return {
        red: parseInt('' + d[1], 10),
        green: parseInt('' + d[2], 10),
        blue: parseInt('' + d[3], 10),
      };
    }
    var p = tr.exec(t.substring(0, 50));
    if (p) {
      var E = parseInt('' + p[1], 10),
        h = parseInt('' + p[2], 10) / 100,
        y = parseInt('' + p[3], 10) / 100,
        O = 'rgb(' + W(E, h, y) + ')',
        L = ge.exec(O);
      if (!L) throw new T(4, t, O);
      return {
        red: parseInt('' + L[1], 10),
        green: parseInt('' + L[2], 10),
        blue: parseInt('' + L[3], 10),
        alpha: parseFloat('' + p[4]) > 1 ? parseFloat('' + p[4]) / 100 : parseFloat('' + p[4]),
      };
    }
    throw new T(5);
  }
  function rr(e) {
    var t = e.red / 255,
      r = e.green / 255,
      n = e.blue / 255,
      o = Math.max(t, r, n),
      i = Math.min(t, r, n),
      u = (o + i) / 2;
    if (o === i)
      return e.alpha !== void 0
        ? { hue: 0, saturation: 0, lightness: u, alpha: e.alpha }
        : { hue: 0, saturation: 0, lightness: u };
    var s,
      l = o - i,
      c = u > 0.5 ? l / (2 - o - i) : l / (o + i);
    switch (o) {
      case t:
        s = (r - n) / l + (r < n ? 6 : 0);
        break;
      case r:
        s = (n - t) / l + 2;
        break;
      default:
        s = (t - r) / l + 4;
        break;
    }
    return (
      (s *= 60),
      e.alpha !== void 0
        ? { hue: s, saturation: c, lightness: u, alpha: e.alpha }
        : { hue: s, saturation: c, lightness: u }
    );
  }
  function x(e) {
    return rr(M(e));
  }
  var nr = function (t) {
      return t.length === 7 && t[1] === t[2] && t[3] === t[4] && t[5] === t[6]
        ? '#' + t[1] + t[3] + t[5]
        : t;
    },
    Ee = nr;
  function N(e) {
    var t = e.toString(16);
    return t.length === 1 ? '0' + t : t;
  }
  function he(e) {
    return N(Math.round(e * 255));
  }
  function ar(e, t, r) {
    return Ee('#' + he(e) + he(t) + he(r));
  }
  function ee(e, t, r) {
    return W(e, t, r, ar);
  }
  function or(e, t, r) {
    if (typeof e == 'number' && typeof t == 'number' && typeof r == 'number') return ee(e, t, r);
    if (typeof e == 'object' && t === void 0 && r === void 0)
      return ee(e.hue, e.saturation, e.lightness);
    throw new T(1);
  }
  function ir(e, t, r, n) {
    if (
      typeof e == 'number' &&
      typeof t == 'number' &&
      typeof r == 'number' &&
      typeof n == 'number'
    )
      return n >= 1 ? ee(e, t, r) : 'rgba(' + W(e, t, r) + ',' + n + ')';
    if (typeof e == 'object' && t === void 0 && r === void 0 && n === void 0)
      return e.alpha >= 1
        ? ee(e.hue, e.saturation, e.lightness)
        : 'rgba(' + W(e.hue, e.saturation, e.lightness) + ',' + e.alpha + ')';
    throw new T(2);
  }
  function ye(e, t, r) {
    if (typeof e == 'number' && typeof t == 'number' && typeof r == 'number')
      return Ee('#' + N(e) + N(t) + N(r));
    if (typeof e == 'object' && t === void 0 && r === void 0)
      return Ee('#' + N(e.red) + N(e.green) + N(e.blue));
    throw new T(6);
  }
  function te(e, t, r, n) {
    if (typeof e == 'string' && typeof t == 'number') {
      var o = M(e);
      return 'rgba(' + o.red + ',' + o.green + ',' + o.blue + ',' + t + ')';
    } else {
      if (
        typeof e == 'number' &&
        typeof t == 'number' &&
        typeof r == 'number' &&
        typeof n == 'number'
      )
        return n >= 1 ? ye(e, t, r) : 'rgba(' + e + ',' + t + ',' + r + ',' + n + ')';
      if (typeof e == 'object' && t === void 0 && r === void 0 && n === void 0)
        return e.alpha >= 1
          ? ye(e.red, e.green, e.blue)
          : 'rgba(' + e.red + ',' + e.green + ',' + e.blue + ',' + e.alpha + ')';
    }
    throw new T(7);
  }
  var sr = function (t) {
      return (
        typeof t.red == 'number' &&
        typeof t.green == 'number' &&
        typeof t.blue == 'number' &&
        (typeof t.alpha != 'number' || typeof t.alpha > 'u')
      );
    },
    lr = function (t) {
      return (
        typeof t.red == 'number' &&
        typeof t.green == 'number' &&
        typeof t.blue == 'number' &&
        typeof t.alpha == 'number'
      );
    },
    ur = function (t) {
      return (
        typeof t.hue == 'number' &&
        typeof t.saturation == 'number' &&
        typeof t.lightness == 'number' &&
        (typeof t.alpha != 'number' || typeof t.alpha > 'u')
      );
    },
    cr = function (t) {
      return (
        typeof t.hue == 'number' &&
        typeof t.saturation == 'number' &&
        typeof t.lightness == 'number' &&
        typeof t.alpha == 'number'
      );
    };
  function w(e) {
    if (typeof e != 'object') throw new T(8);
    if (lr(e)) return te(e);
    if (sr(e)) return ye(e);
    if (cr(e)) return ir(e);
    if (ur(e)) return or(e);
    throw new T(8);
  }
  function rt(e, t, r) {
    return function () {
      var o = r.concat(Array.prototype.slice.call(arguments));
      return o.length >= t ? e.apply(this, o) : rt(e, t, o);
    };
  }
  function R(e) {
    return rt(e, e.length, []);
  }
  function fr(e, t) {
    if (t === 'transparent') return t;
    var r = x(t);
    return w(v({}, r, { hue: r.hue + parseFloat(e) }));
  }
  var Zs = R(fr);
  function P(e, t, r) {
    return Math.max(e, Math.min(t, r));
  }
  function pr(e, t) {
    if (t === 'transparent') return t;
    var r = x(t);
    return w(v({}, r, { lightness: P(0, 1, r.lightness - parseFloat(e)) }));
  }
  var Ks = R(pr);
  function dr(e, t) {
    if (t === 'transparent') return t;
    var r = x(t);
    return w(v({}, r, { saturation: P(0, 1, r.saturation - parseFloat(e)) }));
  }
  var Qs = R(dr);
  function mr(e, t) {
    if (t === 'transparent') return t;
    var r = x(t);
    return w(v({}, r, { lightness: P(0, 1, r.lightness + parseFloat(e)) }));
  }
  var el = R(mr);
  function br(e, t, r) {
    if (t === 'transparent') return r;
    if (r === 'transparent') return t;
    if (e === 0) return r;
    var n = M(t),
      o = v({}, n, { alpha: typeof n.alpha == 'number' ? n.alpha : 1 }),
      i = M(r),
      u = v({}, i, { alpha: typeof i.alpha == 'number' ? i.alpha : 1 }),
      s = o.alpha - u.alpha,
      l = parseFloat(e) * 2 - 1,
      c = l * s === -1 ? l : l + s,
      f = 1 + l * s,
      d = (c / f + 1) / 2,
      p = 1 - d,
      E = {
        red: Math.floor(o.red * d + u.red * p),
        green: Math.floor(o.green * d + u.green * p),
        blue: Math.floor(o.blue * d + u.blue * p),
        alpha: o.alpha * parseFloat(e) + u.alpha * (1 - parseFloat(e)),
      };
    return te(E);
  }
  var gr = R(br),
    nt = gr;
  function hr(e, t) {
    if (t === 'transparent') return t;
    var r = M(t),
      n = typeof r.alpha == 'number' ? r.alpha : 1,
      o = v({}, r, { alpha: P(0, 1, (n * 100 + parseFloat(e) * 100) / 100) });
    return te(o);
  }
  var Er = R(hr),
    at = Er;
  function yr(e, t) {
    if (t === 'transparent') return t;
    var r = x(t);
    return w(v({}, r, { saturation: P(0, 1, r.saturation + parseFloat(e)) }));
  }
  var tl = R(yr);
  function Or(e, t) {
    return t === 'transparent' ? t : w(v({}, x(t), { hue: parseFloat(e) }));
  }
  var rl = R(Or);
  function vr(e, t) {
    return t === 'transparent' ? t : w(v({}, x(t), { lightness: parseFloat(e) }));
  }
  var nl = R(vr);
  function Tr(e, t) {
    return t === 'transparent' ? t : w(v({}, x(t), { saturation: parseFloat(e) }));
  }
  var al = R(Tr);
  function _r(e, t) {
    return t === 'transparent' ? t : nt(parseFloat(e), 'rgb(0, 0, 0)', t);
  }
  var ol = R(_r);
  function Rr(e, t) {
    return t === 'transparent' ? t : nt(parseFloat(e), 'rgb(255, 255, 255)', t);
  }
  var il = R(Rr);
  function Sr(e, t) {
    if (t === 'transparent') return t;
    var r = M(t),
      n = typeof r.alpha == 'number' ? r.alpha : 1,
      o = v({}, r, { alpha: P(0, 1, +(n * 100 - parseFloat(e) * 100).toFixed(2) / 100) });
    return te(o);
  }
  var sl = R(Sr);
  var Ar = k.div({
      display: 'flex',
      padding: 0,
      borderLeft: '5px solid transparent',
      borderBottom: '1px solid transparent',
      transition: 'all 0.1s',
      alignItems: 'flex-start',
      whiteSpace: 'pre',
    }),
    Cr = k.div(({ theme: e }) => ({
      backgroundColor: at(0.5, e.appBorderColor),
      color: e.color.inverseText,
      fontSize: e.typography.size.s1,
      fontWeight: e.typography.weight.bold,
      lineHeight: 1,
      padding: '1px 5px',
      borderRadius: 20,
      margin: '2px 0px',
    })),
    xr = k.div({ flex: 1, padding: '0 0 0 5px' }),
    wr = ({ children: e, className: t }) =>
      a.createElement(Ze, { horizontal: !0, vertical: !0, className: t }, e),
    Nr = k(wr)({ margin: 0, padding: '10px 5px 20px' }),
    Lr = Fe(({ theme: e, ...t }) =>
      a.createElement(qe, { theme: e.addonActionsTheme || 'chromeLight', table: !1, ...t }),
    ),
    Ir = ({ actions: e, onClear: t }) =>
      a.createElement(
        Ne,
        null,
        a.createElement(
          Nr,
          null,
          e.map(r =>
            a.createElement(
              Ar,
              { key: r.id },
              r.count > 1 && a.createElement(Cr, null, r.count),
              a.createElement(
                xr,
                null,
                a.createElement(Lr, {
                  sortObjectKeys: !0,
                  showNonenumerable: !1,
                  name: r.data.name,
                  data: r.data.args || r.data,
                }),
              ),
            ),
          ),
        ),
        a.createElement(Xe, { actionItems: [{ title: 'Clear', onClick: t }] }),
      ),
    Dr = (e, t) => {
      try {
        return I(e, t);
      } catch {
        return !1;
      }
    },
    Mr = class extends we {
      constructor(e) {
        super(e),
          (this.handleStoryChange = () => {
            let { actions: t } = this.state;
            t.length > 0 && t[0].options.clearOnStoryChange && this.clearActions();
          }),
          (this.addAction = t => {
            this.setState(r => {
              let n = [...r.actions],
                o = n.length && n[0];
              return (
                o && Dr(o.data, t.data) ? o.count++ : ((t.count = 1), n.unshift(t)),
                { actions: n.slice(0, t.options.limit) }
              );
            });
          }),
          (this.clearActions = () => {
            let { api: t } = this.props;
            t.emit(Y), this.setState({ actions: [] });
          }),
          (this.mounted = !1),
          (this.state = { actions: [] });
      }
      componentDidMount() {
        this.mounted = !0;
        let { api: e } = this.props;
        e.on(j, this.addAction), e.on(U, this.handleStoryChange);
      }
      componentWillUnmount() {
        this.mounted = !1;
        let { api: e } = this.props;
        e.off(U, this.handleStoryChange), e.off(j, this.addAction);
      }
      render() {
        let { actions: e = [] } = this.state,
          { active: t } = this.props,
          r = { actions: e, onClear: this.clearActions };
        return t ? a.createElement(Ir, { ...r }) : null;
      }
    };
  function Pr({ count: e }) {
    let [t, r] = C(!1);
    Me({
      [j]: () => {
        r(o => !o);
      },
      [U]: () => {
        r(o => !o);
      },
      [Y]: () => {
        r(o => !o);
      },
    });
    let n = e.current === 0 ? '' : ` (${e.current})`;
    return a.createElement(a.Fragment, null, 'Actions', n);
  }
  re.register(z, e => {
    let t = { current: 0 };
    e.on(U, r => {
      t.current = 0;
    }),
      e.on(j, () => {
        t.current += 1;
      }),
      e.on(Y, () => {
        t.current = 0;
      }),
      re.addPanel(Ce, {
        title: a.createElement(Pr, { count: t }),
        id: 'actions',
        type: De.PANEL,
        render: ({ active: r, key: n }) => a.createElement(Mr, { key: n, api: e, active: !!r }),
        paramKey: Ae,
      });
  });
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
//# sourceMappingURL=manager-bundle.js.map
