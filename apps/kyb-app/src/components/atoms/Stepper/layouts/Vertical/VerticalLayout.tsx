import React from 'react';
import { ChildrenList } from '@ballerine/ui';
import { Children, useMemo } from 'react';
import { VerticalDivider } from '@app/components/atoms/Stepper/layouts/Vertical/VerticalDivider';

interface Props {
  children: ChildrenList;
  divider?: React.ComponentType<unknown>;
}

export const VerticalLayout = ({ children, divider }: Props) => {
  const Divider = divider ? divider : null;

  const childsList = useMemo(() => Children.toArray(children as React.ReactNode[]), [children]);

  return (
    <div className="items-between flex flex-col justify-between">
      {childsList.map((child, index) => {
        const isLast = childsList.length - 1 === index;

        return (
          <React.Fragment key={`vertical-layout-item-${index}`}>
            {child}
            {isLast ? null : Divider ? <Divider /> : <VerticalDivider />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
