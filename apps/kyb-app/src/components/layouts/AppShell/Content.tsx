import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Content = ({ children }: Props) => {
  return <div className="bg-accent h-full w-[100%] overflow-auto p-4">{children}</div>;
};
