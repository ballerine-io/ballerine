export const Tab = {
  LEARN: `learn`,
  API: `api`,
} as const;

export const Tabs = [Tab.LEARN, Tab.API] as const;

export type TTab = (typeof Tab)[keyof typeof Tab];
