import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Sidebar = ({ children }: Props) => {
  return (
    <div className="bg-primary text-primary-foreground col-span-2 flex h-screen w-[24%] max-w-[418px] flex-col px-14 pb-4 pt-14">
      {children}
    </div>
  );
};
