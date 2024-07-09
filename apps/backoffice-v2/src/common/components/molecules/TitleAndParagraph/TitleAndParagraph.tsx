import React, { ComponentProps, FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';

export const TitleAndParagraph: FunctionComponent<{
  title: string;
  paragraph: string;
  cardHeaderProps?: ComponentProps<typeof CardHeader>;
  cardContentProps?: ComponentProps<typeof CardContent>;
}> = ({ title, paragraph, cardHeaderProps, cardContentProps }) => {
  return (
    <Card>
      <CardHeader
        {...cardHeaderProps}
        className={ctw('pt-4 font-bold', cardHeaderProps?.className)}
      >
        {title}
      </CardHeader>
      <CardContent {...cardContentProps}>{paragraph}</CardContent>
    </Card>
  );
};
