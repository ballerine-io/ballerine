import React, { FunctionComponent } from 'react';
import { buttonVariants, Image } from '@/components';

export const AdExample: FunctionComponent<{
  src: string;
  link: string;
  alt: string;
}> = ({ src, link, alt }) => {
  return (
    <div className={'flex h-full flex-col justify-between'}>
      <div>
        <h4 className={'mb-4 font-semibold'}>Ad Example</h4>
        <Image key={src} src={src} alt={alt} width={'369px'} height={'369px'} />
      </div>
      <a
        className={buttonVariants({
          variant: 'link',
          className: 'h-[unset] cursor-pointer !p-0 !text-[#14203D] underline decoration-[1.5px]',
        })}
        href={link}
      >
        {link}
      </a>
    </div>
  );
};
