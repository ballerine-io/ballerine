import { TRoutes } from './types';

export const navItems = [
  // {
  //     text: 'Home',
  //     href: '/',
  //     icon: <HomeSvg/>,
  //     key: 'nav-item-home'
  // },
  {
    text: 'Case Management',
    children: [
      {
        text: '',
        href: '',
        key: '',
      },
    ],
    key: 'nav-item-case-management',
  },
] satisfies TRoutes;
