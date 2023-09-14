import { AnyChildren } from '@common/types';

interface Props {
  children: AnyChildren;
}

export const Column = ({ children }: Props) => {
  return <div className="flex-1">{children}</div>;
};
