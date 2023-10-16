import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Content = ({ children }: Props) => {
  return <div className="h-full w-[100%] overflow-auto bg-[#F2F5FF] p-4">{children}</div>;
};
