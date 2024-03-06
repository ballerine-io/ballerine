import { FunctionComponent } from 'react';
import { NavItem } from './Header.NavItem';
import { ctw } from '../../../utils/ctw/ctw';
import { ChevronDown } from 'lucide-react';
import { Collapsible } from '@/common/components/molecules/Collapsible/Collapsible';
import { CollapsibleTrigger } from '@/common/components/molecules/Collapsible/Collapsible.Trigger';
import { CollapsibleContent } from '@/common/components/molecules/Collapsible/Collapsible.Content';
import { useNavbarLogic } from '@/common/components/organisms/Header/hooks/useNavbarLogic/useNavbarLogic';
import { Fragment } from 'react';

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
                    `flex w-full items-center gap-x-2 rounded-lg p-2 text-sm font-semibold text-[#8D93A5] [&[data-state=open]>svg]:rotate-0`,
                    {
                      'bg-white text-[#20232E]': isActiveFilterGroup,
                    },
                  )}
                >
                  <div
                    className={ctw(`flex items-center gap-x-3 text-left`, {
                      '[&>svg]:stroke-[#B7BDCD]': !isActiveFilterGroup,
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
                  <ul className={`w-full space-y-4 ps-[1.9rem]`}>
                    {!!navItem.children?.length &&
                      navItem.children?.map(childNavItem => (
                        <NavItem
                          href={childNavItem.href}
                          key={childNavItem.key}
                          className={ctw(
                            `gap-x-1 px-1.5 text-xs capitalize text-[#8D93A5] active:border`,
                            {
                              'font-semibold text-[#20232E]': childNavItem.filterId === filterId,
                              'aria-[current=page]:font-normal': childNavItem.filterId !== filterId,
                            },
                          )}
                        >
                          <span>{childNavItem.icon}</span>
                          {childNavItem.text}
                        </NavItem>
                      ))}
                    {!navItem.children?.length && (
                      <li className={`pe-1.5 ps-2.5 text-xs text-[#8D93A5]`}>No items found</li>
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
                  className={ctw(
                    `flex items-center gap-x-1 px-1.5 py-1 text-sm font-semibold capitalize text-[#8D93A5] active:border`,
                    {
                      'bg-white text-[#20232E]': navItem.filterId === filterId,
                    },
                  )}
                >
                  <span>{navItem.icon}</span>
                  {navItem.text}
                </NavItem>
              </ul>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};
