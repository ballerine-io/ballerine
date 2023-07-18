import '../sb-preview/runtime.js';
(function () {
  const n = document.createElement('link').relList;
  if (n && n.supports && n.supports('modulepreload')) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) a(e);
  new MutationObserver(e => {
    for (const t of e)
      if (t.type === 'childList')
        for (const o of t.addedNodes) o.tagName === 'LINK' && o.rel === 'modulepreload' && a(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(e) {
    const t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === 'use-credentials'
        ? (t.credentials = 'include')
        : e.crossOrigin === 'anonymous'
        ? (t.credentials = 'omit')
        : (t.credentials = 'same-origin'),
      t
    );
  }
  function a(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = s(e);
    fetch(e.href, t);
  }
})();
const p = 'modulepreload',
  R = function (_, n) {
    return new URL(_, n).href;
  },
  m = {},
  r = function (n, s, a) {
    if (!s || s.length === 0) return n();
    const e = document.getElementsByTagName('link');
    return Promise.all(
      s.map(t => {
        if (((t = R(t, a)), t in m)) return;
        m[t] = !0;
        const o = t.endsWith('.css'),
          d = o ? '[rel="stylesheet"]' : '';
        if (!!a)
          for (let c = e.length - 1; c >= 0; c--) {
            const l = e[c];
            if (l.href === t && (!o || l.rel === 'stylesheet')) return;
          }
        else if (document.querySelector(`link[href="${t}"]${d}`)) return;
        const i = document.createElement('link');
        if (
          ((i.rel = o ? 'stylesheet' : p),
          o || ((i.as = 'script'), (i.crossOrigin = '')),
          (i.href = t),
          document.head.appendChild(i),
          o)
        )
          return new Promise((c, l) => {
            i.addEventListener('load', c),
              i.addEventListener('error', () => l(new Error(`Unable to preload CSS for ${t}`)));
          });
      }),
    )
      .then(() => n())
      .catch(t => {
        const o = new Event('vite:preloadError', { cancelable: !0 });
        if (((o.payload = t), window.dispatchEvent(o), !o.defaultPrevented)) throw t;
      });
  },
  { createChannel: f } = __STORYBOOK_MODULE_CHANNEL_POSTMESSAGE__,
  { createChannel: T } = __STORYBOOK_MODULE_CHANNEL_WEBSOCKET__,
  { addons: u } = __STORYBOOK_MODULE_PREVIEW_API__,
  O = f({ page: 'preview' });
u.setChannel(O);
window.__STORYBOOK_ADDONS_CHANNEL__ = O;
if (window.CONFIG_TYPE === 'DEVELOPMENT') {
  const _ = T({});
  u.setServerChannel(_), (window.__STORYBOOK_SERVER_CHANNEL__ = _);
}
const P = {
  './src/components/atoms/Button/Button.stories.tsx': async () =>
    r(
      () => import('./Button.stories-22bfdc00.js'),
      [
        './Button.stories-22bfdc00.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
        './Button-b285b1af.js',
        './index.module-1a92c487.js',
        './extends-98964cd2.js',
        './index-bf785725.js',
      ],
      import.meta.url,
    ),
  './src/components/atoms/Dialog/Dialog.stories.tsx': async () =>
    r(
      () => import('./Dialog.stories-acd7bf52.js'),
      [
        './Dialog.stories-acd7bf52.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
        './Dialog-cde66561.js',
        './extends-98964cd2.js',
        './index.module-1a92c487.js',
        './index.module-1078e6dd.js',
        './index-8ce4a492.js',
      ],
      import.meta.url,
    ),
  './src/components/atoms/HealthIndicator/HealthIndicator.stories.tsx': async () =>
    r(
      () => import('./HealthIndicator.stories-64ade77a.js'),
      [
        './HealthIndicator.stories-64ade77a.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
        './HealthIndicator-4a424b9f.js',
      ],
      import.meta.url,
    ),
  './src/components/atoms/Image/Image.stories.tsx': async () =>
    r(
      () => import('./Image.stories-80e1ff5a.js'),
      [
        './Image.stories-80e1ff5a.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
      ],
      import.meta.url,
    ),
  './src/components/atoms/Input/Input.stories.tsx': async () =>
    r(
      () => import('./Input.stories-066951a2.js'),
      [
        './Input.stories-066951a2.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
      ],
      import.meta.url,
    ),
  './src/components/atoms/Label/Label.stories.tsx': async () =>
    r(
      () => import('./Label.stories-a1e18536.js'),
      [
        './Label.stories-a1e18536.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
        './extends-98964cd2.js',
        './index.module-1078e6dd.js',
        './index-8ce4a492.js',
        './index.module-1a92c487.js',
        './index-bf785725.js',
      ],
      import.meta.url,
    ),
  './src/components/organisms/WorkflowsTable/WorkflowsTable.stories.tsx': async () =>
    r(
      () => import('./WorkflowsTable.stories-852658cd.js'),
      [
        './WorkflowsTable.stories-852658cd.js',
        './ctw-409c05e4.js',
        './index-8db94870.js',
        './_commonjsHelpers-042e6b4d.js',
        './HealthIndicator-4a424b9f.js',
        './Button-b285b1af.js',
        './index.module-1a92c487.js',
        './extends-98964cd2.js',
        './index-bf785725.js',
        './index-8ce4a492.js',
        './Dialog-cde66561.js',
        './index.module-1078e6dd.js',
        './_baseIteratee-6b4700d7.js',
      ],
      import.meta.url,
    ),
};
async function E(_) {
  return P[_]();
}
E.__docgenInfo = { description: '', methods: [], displayName: 'importFn' };
const { composeConfigs: I, PreviewWeb: L, ClientApi: w } = __STORYBOOK_MODULE_PREVIEW_API__,
  S = async () => {
    const _ = await Promise.all([
      r(
        () => import('./config-0477d0c2.js'),
        [
          './config-0477d0c2.js',
          './index-d475d2ea.js',
          './index-8db94870.js',
          './_commonjsHelpers-042e6b4d.js',
          './_getPrototype-f17fb99d.js',
          './index-8ce4a492.js',
          './_baseIteratee-6b4700d7.js',
          './index-356e4a49.js',
        ],
        import.meta.url,
      ),
      r(
        () => import('./preview-5ef354f3.js'),
        ['./preview-5ef354f3.js', './index-d475d2ea.js', './index-d37d4223.js'],
        import.meta.url,
      ),
      r(() => import('./preview-891d8a0a.js'), [], import.meta.url),
      r(() => import('./preview-a60aa466.js'), [], import.meta.url),
      r(
        () => import('./preview-770cc08b.js'),
        ['./preview-770cc08b.js', './index-d475d2ea.js', './index-356e4a49.js'],
        import.meta.url,
      ),
      r(
        () => import('./preview-2cd4e1a1.js'),
        ['./preview-2cd4e1a1.js', './index-d475d2ea.js'],
        import.meta.url,
      ),
      r(
        () => import('./preview-d8c963a4.js'),
        ['./preview-d8c963a4.js', './index-d475d2ea.js', './index-356e4a49.js'],
        import.meta.url,
      ),
      r(
        () => import('./preview-b1164a2e.js'),
        ['./preview-b1164a2e.js', './index-d475d2ea.js'],
        import.meta.url,
      ),
      r(
        () => import('./preview-0b573777.js'),
        ['./preview-0b573777.js', './index-d475d2ea.js', './_commonjsHelpers-042e6b4d.js'],
        import.meta.url,
      ),
      r(() => import('./preview-0b293f2a.js'), [], import.meta.url),
      r(
        () => import('./preview-97b44ce5.js'),
        ['./preview-97b44ce5.js', './preview-c9c3b7c8.css'],
        import.meta.url,
      ),
    ]);
    return I(_);
  };
window.__STORYBOOK_PREVIEW__ = window.__STORYBOOK_PREVIEW__ || new L();
window.__STORYBOOK_STORY_STORE__ =
  window.__STORYBOOK_STORY_STORE__ || window.__STORYBOOK_PREVIEW__.storyStore;
window.__STORYBOOK_CLIENT_API__ =
  window.__STORYBOOK_CLIENT_API__ || new w({ storyStore: window.__STORYBOOK_PREVIEW__.storyStore });
window.__STORYBOOK_PREVIEW__.initialize({ importFn: E, getProjectAnnotations: S });
export { r as _ };
//# sourceMappingURL=iframe-61b2ba7f.js.map
