import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Sidebar = ({ children }: Props) => {
  return (
    <div
      className="bg-primary text-primary-foreground flex h-screen w-[24rem] flex-col p-10"
      id="sidebar"
    >
      {children}
    </div>
  );
};
