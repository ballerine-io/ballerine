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
        text: 'Individuals',
        href: '/$locale/case-management/individuals',
        key: 'nav-item-individuals',
      },
      {
        text: 'Companies - Soon',
        href: '/$locale/case-management/companies',
        key: 'nav-item-companies',
      },
      {
        text: 'Transactions - Soon',
        href: '/$locale/case-management/transactions',
        key: 'nav-item-transactions',
      },
    ],
    key: 'nav-item-case-management',
  },
] satisfies TRoutes;
