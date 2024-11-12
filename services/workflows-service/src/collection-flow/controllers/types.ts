export type SignupConfig =
  | {
      email?: {
        validation: boolean;
      };
    }
  | null
  | undefined;
