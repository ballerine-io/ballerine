import { Fragment, PropsWithRef } from 'react';
import { ChevronDownSvg } from '../../atoms/icons';
import { useDetailsGrid } from './hooks/useDetailsGrid/useDetailsGrid';
import { IDetailsGridProps } from './interfaces';
import { AnyRecord } from '../../../types';
import { DataField } from '../DataField/DataField';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description Displays a title and a collapsable 3 columns grid of DataField with an option of passing a component next to the title or to the bottom of the grid.
 *
 *
 * @param props - Props to pass to the root grid element.
 * @param props.data - The data to pass to the DataField - expects an object, coverts its keys to Start case to be used as a title.
 * @param props.header - An optional component to display next to the title.
 * @param props.footer - An optional component to display at the bottom of the grid.
 * @constructor
 */
export const DetailsGrid = <TRecord extends AnyRecord>({
  data,
  title,
  header,
  footer,
  children,
  loading,
  ...rest
}: PropsWithRef<IDetailsGridProps<TRecord>>) => {
  const { dataFields, skeletons } = useDetailsGrid(data ?? {});

  return (
    <>
      <details open className={`group`}>
        <summary
          className={`mb-6 inline-flex cursor-pointer  list-none items-center gap-x-3 rounded-md p-1 pl-0 text-2xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
        >
          <span
            className={ctw({
              'h-8 w-[18ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus':
                loading?.title,
            })}
          >
            {loading?.title ? '' : title}
          </span>
          <ChevronDownSvg className={`rotate-180 d-5 group-open:rotate-0`} />
          {!!header && header}
        </summary>
        <div
          className={ctw(`grid grid-cols-12 gap-x-2 gap-y-6`, {
            [`
                            last:children:col-span-full
                            not-last:children:col-span-6
                            xl:not-last:children:col-span-4
                            `]: footer,
            [`
                            children:col-span-6
                            xl:children:col-span-4
                            `]: !footer,
          })}
          {...rest}
        >
          {loading?.data ? (
            <>
              {skeletons.map(i => (
                <DataField
                  title={''}
                  text={''}
                  loading={{ title: true, text: true }}
                  key={`data-grid-skeleton-${i}`}
                />
              ))}
            </>
          ) : (
            dataFields?.map(({ title, text }, index) => (
              <Fragment key={`${title}-${text}`}>{children({ title, text, index })}</Fragment>
            ))
          )}
          {!!footer && footer}
        </div>
      </details>
    </>
  );
};
