import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Sidebar = ({ children }: Props) => {
  return (
    <div className="bg-primary col-span-2 h-full w-[24%] max-w-[418px] px-14 pb-4 pt-14">
      {children}
    </div>
  );
};
