try {
  var e = 'storybook/links';
  var s = { NAVIGATE: `${e}/navigate`, REQUEST: `${e}/request`, RECEIVE: `${e}/receive` };
  var p = __STORYBOOKAPI__,
    {
      ActiveTabs: O,
      Consumer: b,
      ManagerContext: k,
      Provider: g,
      addons: a,
      combineParameters: I,
      controlOrMetaKey: v,
      controlOrMetaSymbol: C,
      eventMatchesShortcut: M,
      eventToShortcut: P,
      isMacLike: R,
      isShortcutTaken: D,
      keyToSymbol: f,
      merge: x,
      mockChannel: K,
      optionOrAltSymbol: G,
      shortcutMatchesShortcut: N,
      shortcutToHumanString: V,
      types: Y,
      useAddonState: $,
      useArgTypes: B,
      useArgs: Q,
      useChannel: U,
      useGlobalTypes: q,
      useGlobals: H,
      useParameter: L,
      useSharedState: j,
      useStoryPrepared: w,
      useStorybookApi: z,
      useStorybookState: F,
    } = __STORYBOOKAPI__;
  a.register(e, n => {
    a.getChannel().on(s.REQUEST, ({ kind: u, name: l }) => {
      let S = n.storyId(u, l);
      n.emit(s.RECEIVE, S);
    });
  });
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
//# sourceMappingURL=manager-bundle.js.map
