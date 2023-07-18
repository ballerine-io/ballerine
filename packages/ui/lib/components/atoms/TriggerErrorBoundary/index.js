const o = ({ throwError: r = !0 }) => {
  if (!r) return null;
  throw new Error('TriggerErrorBoundary');
};
export { o as TriggerErrorBoundary };
