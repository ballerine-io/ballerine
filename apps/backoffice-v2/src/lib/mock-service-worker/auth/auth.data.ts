export const auth = {
  __session: false,

  get session() {
    return this.__session;
  },

  set session(next: boolean) {
    this.__session = next;
  },
};
