import { FunctionComponent } from 'react';
import { IAvatarProps } from './interfaces';
import { BallerineImage } from '../BallerineImage';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description A max border-radius version of {@link BallerineImage}.
 *
 * @param props
 *
 * @see {@link BallerineImage}
 *
 * @constructor
 */
export const Avatar: FunctionComponent<IAvatarProps> = ({
  className,
  src,
  alt,
  placeholder,
  isLoading,
  ...props
}) => {
  return (
    <div
      className={ctw(`avatar`, {
        placeholder: !src || placeholder,
      })}
    >
      <div
        className={ctw(
          `rounded-full text-base-100 theme-dark:text-base-content`,
          {
            'bg-neutral theme-dark:bg-neutral-focus': !isLoading && !src,
            'animate-pulse bg-gray-200 theme-dark:bg-neutral-focus': isLoading,
          },
          className,
        )}
        {...props}
      >
        <BallerineImage
          alt={alt}
          src={src}
          isLoading={isLoading}
          placeholder={placeholder}
          withPlaceholder
          className={ctw({
            'bg-transparent': !src,
          })}
        />
      </div>
    </div>
  );
};
