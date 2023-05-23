import { FunctionComponent } from 'react';
import { FilterSvg, MagnifyingGlassSvg, SortSvg } from 'components/atoms/icons';
import { Item } from './SubjectsList.Item';
import { List } from './SubjectsList.List';
import {
  ISubjectsListChildren,
  ISubjectsListProps,
} from 'components/organisms/SubjectsList/interfaces';
import { Checkbox } from 'components/atoms/Checkbox/Checkbox';
import { useSubjectsList } from 'components/organisms/SubjectsList/hooks/useSubjectsList/useSubjectsList';
import { TEndUser } from '../../../api/types';
import { SkeletonItem } from 'components/organisms/SubjectsList/SubjectsList.SkeletonItem';

/**
 * @description A vertical sidebar for the subjects list, with search, filter, and sort.
 * Uses dot notation for its API (i.e. SubjectsList.List), where the root component acts as a container.
 *
 * Children:
 *  - {@link SubjectsList.List} - Wraps multiple {@link SubjectsList.Item} with a ul element.
 *  - {@link SubjectsList.Item} - An li which displays a single subject's data.
 *
 * @see {@link https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type|React dot notation}
 *
 * @param children
 * @param onPaginate
 * @param onSearch
 * @param onFilter
 * @param onSortBy
 * @param onSortDir
 * @param routeId
 * @param props
 * @constructor
 */
export const SubjectsList: FunctionComponent<ISubjectsListProps> & ISubjectsListChildren = ({
  children,
  onSearch,
  onFilter,
  onSortBy,
  onSortDir,
  search,
  routerId,
  ...props
}) => {
  const {
    sortByOptions,
    filterByOptions,
    filter,
    sortBy,
    searchRef,
    sortRef,
    filterRef,
    handleDropdown,
  } = useSubjectsList(routerId);

  return (
    <div id={`subjects-list`} {...props}>
      <div className={`border-neutral/10 p-4 theme-dark:border-neutral/60`}>
        <div className="form-control mb-2 rounded-md border border-neutral/10 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary theme-dark:border-neutral/60">
          <div className="input-group">
            <div className={`btn-ghost btn-square btn pointer-events-none`}>
              <MagnifyingGlassSvg className={`!d-5`} />
            </div>
            <input
              type="text"
              className="input input-md w-full !border-0 !outline-none !ring-0 placeholder:text-base-content"
              placeholder={`Search by user info`}
              onChange={onSearch}
              value={search}
              ref={searchRef}
            />
          </div>
        </div>
        <div className={`flex items-center justify-between`}>
          <div className="dropdown dropdown-bottom dropdown-hover z-[60]">
            <button
              className={`btn-ghost btn-sm btn h-[2.125rem] gap-2 border-neutral/10 text-xs focus-visible:outline-primary theme-dark:border-neutral/50`}
              tabIndex={0}
              ref={filterRef}
              onMouseEnter={handleDropdown}
            >
              <FilterSvg className={`!d-4`} />
              Filter
            </button>
            <div
              className={`dropdown-content space-y-2 rounded-md  border border-neutral/10 bg-base-100 p-2 theme-dark:border-neutral/60`}
            >
              {filterByOptions.map(({ label, value, options }) => {
                return (
                  <Checkbox.Group
                    key={label}
                    label={label}
                    values={filter?.[value]}
                    onChange={onFilter(value as keyof TEndUser)}
                    titleProps={{
                      className: `text-base-content`,
                    }}
                    innerContainerProps={{
                      className: `w-96 flex-wrap`,
                    }}
                  >
                    {options.map(({ label, value, key }) => (
                      <Checkbox.Item
                        key={`${label}${key ?? ''}`}
                        value={value}
                        className={`text-sm  text-base-content`}
                        checkboxProps={{
                          className: 'd-4',
                        }}
                      >
                        {label}
                      </Checkbox.Item>
                    ))}
                  </Checkbox.Group>
                );
              })}
            </div>
          </div>
          <div
            className={`form-control rounded-md border border-neutral/10 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary theme-dark:border-neutral/60`}
          >
            <div className={`input-group flex items-center`}>
              <button
                className={`btn-ghost btn-square btn-sm btn !rounded-md focus-visible:border-none focus-visible:bg-neutral/10 focus-visible:outline-none focus-visible:ring-0 focus-visible:theme-dark:bg-neutral`}
                onClick={onSortDir}
                ref={sortRef}
              >
                <SortSvg />
              </button>
              <select
                className={`select-bordered select select-sm w-[7.5rem] !border-0 text-xs leading-snug !outline-none !ring-0`}
                onChange={onSortBy}
                value={sortBy}
              >
                <option value="" hidden disabled>
                  Sort by
                </option>
                {sortByOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

SubjectsList.List = List;
SubjectsList.Item = Item;
SubjectsList.SkeletonItem = SkeletonItem;
