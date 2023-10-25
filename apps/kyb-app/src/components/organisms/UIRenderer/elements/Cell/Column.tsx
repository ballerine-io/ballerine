import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Column = ({ children }: Props) => {
  return <>{children}</>;
};
