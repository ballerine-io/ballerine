import React, { ComponentProps, createContext, FunctionComponent, ReactNode, useMemo } from 'react';
import { Accordion } from '@/components/molecules/Accordion/Accordion';

export const AccordionCardContext = createContext<
  | {
      value: ComponentProps<typeof Accordion>['value'];
      onValueChange: ComponentProps<typeof Accordion>['onValueChange'];
    }
  | undefined
>(undefined);

export const AccordionCardProvider: FunctionComponent<{
  value: ComponentProps<typeof Accordion>['value'];
  onValueChange: ComponentProps<typeof Accordion>['onValueChange'];
  children: ReactNode | ReactNode[];
}> = ({ value, onValueChange, children }) => {
  const contextValues = useMemo(
    () => ({
      value,
      onValueChange,
    }),
    [value, onValueChange],
  );

  return (
    <AccordionCardContext.Provider value={contextValues}>{children}</AccordionCardContext.Provider>
  );
};
