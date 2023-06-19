export const auth = {
  __user: undefined,

  get user() {
    return this.__user;
  },

  set user(
    next:
      | {
          email: string;
        }
      | undefined,
  ) {
    this.__user = next;
  },
};
