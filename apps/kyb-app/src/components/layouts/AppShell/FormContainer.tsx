import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { AnyChildren, ScrollArea } from '@ballerine/ui';
import { useEffect, useRef } from 'react';

interface Props {
  children: AnyChildren;
  header?: AnyChildren;
}

export const FormContainer = ({ children, header }: Props) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { currentPage } = usePageResolverContext();

  // Scrolls to top of the page when page changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        scrollAreaRef.current!.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [currentPage]);

  return (
    //@ts-ignore
    <ScrollArea orientation="both" className="h-full" ref={scrollAreaRef}>
      <div className="text-secondary-foreground box-content flex flex-col gap-5 pl-40 pt-20">
        {header ? <div>{header}</div> : null}
        <div className="flex-flex-col w-full max-w-[385px]">{children}</div>
      </div>
    </ScrollArea>
  );
};
