export type TRouteWithoutChildren = {
  text: string;
  href: string;
  key: string;
  icon: JSX.Element;
};

export type TRouteWithChildren = {
  text: string;
  children: Array<Omit<TRouteWithoutChildren, 'icon'>>;
  key: string;
};

export type TRoute = TRouteWithChildren | TRouteWithoutChildren;

export type TRoutes = Array<TRoute>;
