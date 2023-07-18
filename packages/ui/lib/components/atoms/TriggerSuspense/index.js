const e = ({ throwPromise: r = !0 }) => {
  if (!r) return null;
  throw new Promise(() => {});
};
export { e as TriggerSuspense };
