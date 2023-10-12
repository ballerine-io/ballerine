import { AnyChildren, ScrollArea } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
  header?: AnyChildren;
}

export const FormContainer = ({ children, header }: Props) => {
  return (
    <ScrollArea orientation="both" className="h-full">
      <div className="flex flex-col gap-5 pl-40 pt-20 box-content">
        {header ? <div>{header}</div> : null}
        <div className="w-full max-w-[385px] flex-flex-col">{children}</div>
      </div>
    </ScrollArea>
  );
};
