import { FunctionComponent } from 'react';
import { Checkbox } from '@/common/components/atoms/Checkbox/Checkbox';
import { FilterSvg, MagnifyingGlassSvg, SortSvg } from '@/common/components/atoms/icons';
import { TIndividual } from '@/domains/individuals/types';
import { Item } from './Cases.Item';
import { List } from './Cases.List';
import { SkeletonItem } from './Cases.SkeletonItem';
import { useCases } from './hooks/useCases/useCases';
import { ICasesChildren, ICasesProps } from './interfaces';

/**
 * @description A vertical sidebar for the cases list, with search, filter, and sort.
 * Uses dot notation for its API (i.e. Cases.List), where the root component acts as a container.
 *
 * Children:
 *  - {@link Cases.List} - Wraps multiple {@link Cases.Item} with a ul element.
 *  - {@link Cases.Item} - An li which displays a single case's data.
 *
 * @see {@link https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type|React dot notation}
 *
 * @param children
 * @param onPaginate
 * @param onSearch
 * @param onFilter
 * @param onSortBy
 * @param onSortDirToggle
 * @param props
 * @constructor
 */
export const Cases: FunctionComponent<ICasesProps> & ICasesChildren = ({
  children,
  onSearch,
  onFilter,
  onSortBy,
  onSortDirToggle,
  search,
  count,
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
  } = useCases();

  return (
    <div
      id={`cases-list`}
      className="flex min-h-0 min-w-[300px] flex-col justify-between pb-4"
      {...props}
    >
      <div className={`border-neutral/10 p-4 theme-dark:border-neutral/60`}>
        <div className="form-control mb-2 rounded-md border border-neutral/10 focus-within:shadow-[0_1px_1px_0_rgba(0,0,0,0.15)] theme-dark:border-neutral/60">
          <div className="input-group">
            <div className={`btn btn-square btn-ghost pointer-events-none`}>
              <MagnifyingGlassSvg className={`!d-5`} />
            </div>
            <input
              type="text"
              className="input input-md w-full !border-0 text-base !outline-none !ring-0 placeholder:text-base-content"
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
              className={`btn btn-ghost btn-sm h-8 gap-2 border-neutral/10 px-4 text-sm capitalize hover:!bg-muted focus-visible:outline-primary theme-dark:border-neutral/50`}
              tabIndex={0}
              ref={filterRef}
              onMouseEnter={handleDropdown}
            >
              <FilterSvg className={`!d-4`} />
              Filter
            </button>
            <div
              className={`dropdown-content space-y-4 rounded-md border border-neutral/10 bg-base-100 p-2 theme-dark:border-neutral/60`}
            >
              {filterByOptions.map(({ label, value, options }) => {
                return (
                  <Checkbox.Group
                    key={label}
                    label={label}
                    values={filter?.[value]}
                    onChange={onFilter(value as keyof TIndividual)}
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
                        className={`text-sm text-base-content`}
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
            className={`form-control rounded-md border border-neutral/10 theme-dark:border-neutral/60`}
          >
            <div className={`input-group flex items-center`}>
              <button
                className={`btn btn-square btn-ghost btn-sm !rounded-l-md hover:!bg-muted focus-visible:border-none focus-visible:bg-neutral/10 focus-visible:outline-none focus-visible:ring-0 focus-visible:theme-dark:bg-neutral`}
                onClick={onSortDirToggle}
                ref={sortRef}
              >
                <SortSvg />
              </button>
              <select
                className={`select select-bordered select-sm w-[7.5rem] !border-0 pl-2 text-sm leading-snug !outline-none !ring-0 hover:bg-muted/50`}
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
        <div className="mt-4 text-sm font-semibold text-[#999999]">
          {Intl.NumberFormat().format(count)} {count === 1 ? 'case' : 'cases'}
        </div>
      </div>
      {children}
    </div>
  );
};

Cases.List = List;
Cases.Item = Item;
Cases.SkeletonItem = SkeletonItem;
