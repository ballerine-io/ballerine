import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

export const TitleAndParagraph: FunctionComponent<{
  title: string;
  paragraph: string;
}> = ({ title, paragraph }) => {
  return (
    <Card>
      <CardHeader className={'pt-4 font-bold'}>{title}</CardHeader>
      <CardContent>{paragraph}</CardContent>
    </Card>
  );
};
