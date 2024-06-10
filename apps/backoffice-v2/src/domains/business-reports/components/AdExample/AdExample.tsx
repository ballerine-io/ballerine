import React, { FunctionComponent } from 'react';
import { Image } from '@/common/components/atoms/Image';

export const AdExample: FunctionComponent<{
  src: string;
  alt: string;
}> = ({ src, alt }) => {
  return (
    <div>
      <h4 className={'mb-4 font-semibold'}>Ad Example</h4>
      <Image key={src} src={src} alt={alt} width={'369px'} height={'369px'} />
    </div>
  );
};
