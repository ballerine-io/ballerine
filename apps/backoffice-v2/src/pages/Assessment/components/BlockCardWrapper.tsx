import React, { ReactNode } from 'react';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

interface BlockCardWrapperProps {
  status?: string;
  errorMessage: string;
  emptyMessage: string;
  showContent: boolean;
  children: ReactNode;
}

export const BlockCardWrapper: React.FC<BlockCardWrapperProps> = ({
  status,
  errorMessage,
  emptyMessage,
  showContent,
  children,
}) => {
  if (!showContent) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-700">{status === 'failed' ? errorMessage : emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
