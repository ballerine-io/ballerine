import type { LucideIcon } from 'lucide-react';

export type TRouteBase = {
  text: string;
  key: string;
  premium?: {
    caption: string;
    checkList: string[];
    videoLink?: string;
    href?: string;
  };
};

export type TRouteWithoutChildrenBase = TRouteBase & {
  filterId?: string;
  href?: string;
};

export type TRouteWithoutChildren = TRouteWithoutChildrenBase & {
  icon: LucideIcon;
};

export type TRouteWithChildren = TRouteBase & {
  children: TRouteWithoutChildrenBase[];
};

export type TRoute = TRouteWithChildren | TRouteWithoutChildren;
export type TRouteWithOptionalIcon = Omit<TRoute, 'icon'> & {
  icon?: TRouteWithoutChildren['icon'];
};
