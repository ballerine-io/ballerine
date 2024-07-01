import { Fragment, FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { ctw } from '../../../utils/ctw/ctw';
import { ChevronDown } from 'lucide-react';
import { Collapsible } from '@/common/components/molecules/Collapsible/Collapsible';
import { CollapsibleTrigger } from '@/common/components/molecules/Collapsible/Collapsible.Trigger';
import { CollapsibleContent } from '@/common/components/molecules/Collapsible/Collapsible.Content';
import { useNavbarLogic } from '@/common/components/organisms/Header/hooks/useNavbarLogic/useNavbarLogic';

/**
 * @description A nav element which wraps {@link NavItem} components of the app's routes. Supports nested routes.
 *
 * @see {@link NavItem}
 *
 * @constructor
 */
export const Navbar: FunctionComponent = () => {
  const { navItems, filterId, checkIsActiveFilterGroup } = useNavbarLogic();

  return (
    <nav className={`space-y-3`}>
      {navItems.map(navItem => {
        const isActiveFilterGroup = checkIsActiveFilterGroup(navItem);

        return (
          <Fragment key={`${navItem.key}-${isActiveFilterGroup}`}>
            {!!navItem.children && (
              <Collapsible defaultOpen={isActiveFilterGroup} className={`space-y-2`}>
                <CollapsibleTrigger
                  className={ctw(
                    `flex w-full items-center justify-between gap-x-2 rounded-lg p-2 text-sm font-semibold text-[#8990AC] hover:bg-[#EBEEF9] [&[data-state=open]>svg]:rotate-0`,
                    {
                      'bg-white text-[#20232E]': isActiveFilterGroup,
                    },
                  )}
                >
                  <div
                    className={ctw(`flex items-center gap-x-3 text-left`, {
                      '[&>svg]:stroke-[#8990AC]': !isActiveFilterGroup,
                    })}
                  >
                    {navItem.icon}
                    {navItem.text}
                  </div>
                  <ChevronDown
                    size={10}
                    className={`rotate-[-90deg] transition-transform duration-200 ease-in-out`}
                  />
                  <span className="sr-only">Toggle</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className={`w-full space-y-2 ps-[1.9rem]`}>
                    {!!navItem.children?.length &&
                      navItem.children?.map(childNavItem => (
                        <NavItem
                          href={childNavItem.href}
                          key={childNavItem.key}
                          className={({ isActive }) =>
                            ctw(
                              `gap-x-1 px-1.5 py-2 text-xs capitalize hover:bg-[#EBEEF9] hover:text-[#5E688E] active:bg-[#e0e4f6] [&:not([aria-current=page])]:text-[#8990AC]`,
                              {
                                'font-semibold text-[#20232E]':
                                  (childNavItem.filterId && childNavItem.filterId === filterId) ||
                                  (!childNavItem.filterId && isActive),
                                'text-[#8990AC] aria-[current=page]:font-normal':
                                  childNavItem.filterId && childNavItem.filterId !== filterId,
                              },
                            )
                          }
                        >
                          <span>{childNavItem.icon}</span>
                          {childNavItem.text}
                        </NavItem>
                      ))}
                    {!navItem.children?.length && (
                      <li className={`pe-1.5 ps-2.5 text-xs text-[#8990AC]`}>No items found</li>
                    )}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            )}
            {!navItem.children && (
              <ul className={`w-full space-y-2`} key={navItem.key}>
                <NavItem
                  href={navItem.href}
                  key={navItem.key}
                  className={({ isActive }) =>
                    ctw(
                      `flex items-center gap-x-1 p-2 text-sm font-semibold capitalize hover:bg-[#EBEEF9] hover:text-[#5E688E] active:bg-[#e0e4f6] [&:not([aria-current=page])]:text-[#8990AC]`,
                      {
                        'bg-white text-[#20232E]': isActive,
                      },
                    )
                  }
                >
                  <div className={`flex items-center gap-x-3 text-left`}>
                    {navItem.icon}
                    {navItem.text}
                  </div>
                </NavItem>
              </ul>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};
