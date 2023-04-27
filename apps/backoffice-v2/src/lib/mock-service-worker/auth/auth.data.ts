export const auth = {
  __user: undefined,

  get user() {
    return this.__user;
  },

  set user(
    next:
      | {
          username: string;
        }
      | undefined,
  ) {
    this.__user = next;
  },
};
