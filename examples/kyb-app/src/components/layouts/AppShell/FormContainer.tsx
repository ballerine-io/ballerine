import { AnyChildren, ScrollArea } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
}

export const FormContainer = ({ children }: Props) => {
  return (
    <ScrollArea orientation="both" className="h-full">
      <div className="pl-40 pt-20">{children}</div>
    </ScrollArea>
  );
};
