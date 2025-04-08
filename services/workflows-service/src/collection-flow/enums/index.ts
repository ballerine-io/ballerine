export const EntityType = {
  business: 'business',
  director: 'director',
  ubo: 'ubo',
} as const;

export type TEntityType = (typeof EntityType)[keyof typeof EntityType];
