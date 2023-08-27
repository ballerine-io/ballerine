import { Avatar } from '../../../../common/components/atoms/Avatar';
import { FunctionComponent } from 'react';
import { ctw } from '../../../../common/utils/ctw/ctw';

export const SkeletonItem: FunctionComponent = () => {
  return (
    <li
      className={ctw(
        `focus-within:ring-ballerine h-[4.75rem] rounded-md p-2 hover:bg-primary/10 [&:has(.active)]:bg-primary/10`,
      )}
    >
      <div className={`flex items-center gap-x-4 outline-none`}>
        <div className={`indicator`}>
          <div
            className={`indicator-item indicator-bottom h-4 w-4 animate-pulse rounded-full bg-gray-200 theme-dark:bg-neutral-focus`}
          ></div>
          <Avatar src={''} alt={`User's avatar - loading`} className={`h-8 w-8`} isLoading />
        </div>
        <div>
          <span
            className={`mb-1 block h-2 w-[14ch] animate-pulse rounded-md bg-gray-200 theme-dark:bg-neutral-focus`}
          ></span>
          <span
            className={`block h-2 w-[10ch] animate-pulse rounded-md bg-gray-200 text-sm text-base-content/30 theme-dark:bg-neutral-focus`}
          ></span>
        </div>
        <div className={`ml-auto mr-2 flex -space-x-2 overflow-hidden`}>
          <Avatar src={''} alt={`Operator's avatar  - loading`} className={`h-4 w-4`} isLoading />
        </div>
      </div>
    </li>
  );
};
