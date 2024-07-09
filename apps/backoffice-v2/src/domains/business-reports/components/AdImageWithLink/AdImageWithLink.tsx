import React, { FunctionComponent } from 'react';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import { Image } from '@/common/components/atoms/Image';

export const AdImageWithLink: FunctionComponent<{
  title: string;
  src: string;
  alt: string;
  link: string;
}> = ({ title, src, alt, link }) => {
  return (
    <div>
      <h4 className={'mb-4 font-semibold'}>{title}</h4>
      <Image key={src} src={src} alt={alt} width={'369px'} height={'369px'} className={'mb-4'} />
      <a
        className={buttonVariants({
          variant: 'link',
          className: 'h-[unset] cursor-pointer !p-0 !text-[#14203D] underline decoration-[1.5px]',
        })}
        href={src}
      >
        {link}
      </a>
    </div>
  );
};
