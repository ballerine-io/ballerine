export type SignupConfig =
  | {
      email?: {
        verification: boolean;
      };
    }
  | null
  | undefined;
