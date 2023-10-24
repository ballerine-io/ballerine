import { AnyChildren, ScrollArea } from '@ballerine/ui';

interface Props {
  children: AnyChildren;
  header?: AnyChildren;
}

export const FormContainer = ({ children, header }: Props) => {
  return (
    <ScrollArea orientation="both" className="h-full">
      <div className="box-content flex flex-col gap-5 pl-40 pt-20">
        {header ? <div>{header}</div> : null}
        <div className="flex-flex-col w-full max-w-[385px]">{children}</div>
      </div>
    </ScrollArea>
  );
};
