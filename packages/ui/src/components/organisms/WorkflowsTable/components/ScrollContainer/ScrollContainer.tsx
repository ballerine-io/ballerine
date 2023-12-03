// import Scrollbars from 'react-custom-scrollbars';

import { ScrollArea } from '@/components/atoms/ScrollArea';

interface Props {
  children: React.ReactNode;
}

export function ScrollContainer({ children }: Props) {
  return (
    <ScrollArea className="h-full" orientation="both">
      {children}
    </ScrollArea>
  );
}

ScrollContainer.displayName = 'ScrollContainer';
