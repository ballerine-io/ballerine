import { ComponentProps, FunctionComponent } from 'react';
import { CardHeader, CardTitle } from '@/components';

interface IAccordionTitle {
  children: ComponentProps<typeof CardTitle>['children'];
}

export const AccordionTitle: FunctionComponent<IAccordionTitle> = ({ children }) => {
  return (
    <CardHeader>
      <CardTitle className={`text-xl`}>{children}</CardTitle>
    </CardHeader>
  );
};
AccordionTitle.displayName = 'Accordion.Title';
