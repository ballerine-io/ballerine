import { FunctionComponent } from 'react';
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton';
import { ctw } from '../../../utils/ctw/ctw';

export const SkeletonItem: FunctionComponent = () => {
  return (
    <li className={`flex justify-center`}>
      <PrimaryButton className={ctw(`group flex-col hover:bg-transparent active:!ring-0`)}>
        <div
          className={`mb-1
            h-[4.15rem]
            w-[4rem]
            animate-pulse
            rounded-md
            bg-gray-200 theme-dark:bg-neutral-focus
       `}
        />
        <span
          className={`h-[1.375rem] w-[12ch] rounded-md bg-gray-200 theme-dark:bg-neutral-focus`}
        ></span>
      </PrimaryButton>
    </li>
  );
};
