import { AnyChildren } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const Stepper = ({ children }: Props) => {
  return <div className="flex h-full w-full">{children}</div>;
};
