import { ReactNode } from 'react';

export type TRouteWithoutChildren = {
  filterId?: string;
  text: ReactNode | ReactNode[];
  href: string;
  key: string;
  icon: JSX.Element;
};

export type TRouteWithChildren = {
  text: ReactNode | ReactNode[];
  children: Array<Omit<TRouteWithoutChildren, 'icon'>>;
  key: string;
};

export type TRoute = TRouteWithChildren | TRouteWithoutChildren;

export type TRoutes = TRoute[];
