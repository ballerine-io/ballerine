function e() {
  return (
    (e = Object.assign
      ? Object.assign.bind()
      : function (a) {
          for (var n = 1; n < arguments.length; n++) {
            var t = arguments[n];
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (a[r] = t[r]);
          }
          return a;
        }),
    e.apply(this, arguments)
  );
}
export { e as _ };
