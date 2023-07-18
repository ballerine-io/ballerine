import { BlocksProps } from '@ballerine/blocks';
import { ComponentProps } from 'react';
import { Card } from '../../common/components/atoms/Card/Card';
import { CardContent } from '../../common/components/atoms/Card/Card.Content';
import { ctw } from '../../common/utils/ctw/ctw';
import { TCell } from './hooks/useEntity/blocks';

export const TaskContainer = ({ children, block }: ComponentProps<BlocksProps<TCell>['Block']>) => {
  return (
    <Card className={`me-4`}>
      <CardContent
        className={ctw('grid gap-2', {
          'grid-cols-2': block?.some(cell => cell?.type === 'multiDocuments'),
        })}
      >
        {children}
      </CardContent>
    </Card>
  );
};
