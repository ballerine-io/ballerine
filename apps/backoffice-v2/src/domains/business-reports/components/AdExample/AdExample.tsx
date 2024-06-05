import React, { FunctionComponent } from 'react';
import { BallerineImage } from '@/common/components/atoms/BallerineImage';

export const AdExample: FunctionComponent<{
  src: string;
  alt: string;
}> = ({ src, alt }) => {
  return (
    <div>
      <h4 className={'mb-4 font-semibold'}>Ad Example</h4>
      <BallerineImage src={src} alt={alt} />
    </div>
  );
};
