import { FunctionComponent } from 'react';
import { IItemProps } from './interfaces';
import { useImageViewerContext } from './hooks/useImageViewerContext/useImageViewerContext';
import { BallerineImage } from '../../atoms/BallerineImage';
import { PrimaryButton } from '../../atoms/PrimaryButton/PrimaryButton';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description To be used by {@link ImageViewer}, and be wrapped by {@link ImageViewer.List}. Uses an li element with default styling to display a single image which sets the selected image on click.
 *
 * @see {@link ImageViewer.List}
 * @see {@link BallerineImage}
 *
 * @param props
 * @param props.src - A string url to pass into the {@link BallerineImage}'s src attribute.
 * @param props.alt - A string to pass into the {@link BallerineImage}'s alt attribute.
 * @param props.caption - A string to display under the image.
 * @param props.buttonProps - Props to pass to the button element.
 * @param props.imageProps - Props to pass to the {@link BallerineImage} component.
 *
 * @constructor
 */
export const Item: FunctionComponent<IItemProps> = ({
  id,
  src,
  fileType,
  fileName,
  alt,
  caption,
  imageProps = {},
  buttonProps = {},
  className,
  ...rest
}) => {
  const { className: buttonClassName = {}, ...restButton } = buttonProps;
  const { className: imageClassName = {}, ...restImage } = imageProps;
  const { onSelectImage } = useImageViewerContext();

  return (
    <li className={ctw(`flex justify-center`, className)} {...rest}>
      <PrimaryButton
        className={ctw(
          `group flex-col space-y-2  hover:bg-transparent focus-visible:!ring-0 active:!ring-0`,
          buttonClassName,
        )}
        onClick={onSelectImage({
          id,
          imageUrl: src,
          fileType,
          fileName,
        })}
        {...restButton}
      >
        <div className={`flex h-[4.375rem] w-[4rem]`}>
          <BallerineImage
            withPlaceholder
            src={src}
            className={ctw(
              `
            object-cover
            group-hover:outline
            group-focus:outline
            group-hover:outline-2
            group-hover:outline-primary
            group-focus:shadow
            group-focus:outline-2
            group-focus:outline-primary`,
              imageClassName,
            )}
            alt={alt}
            {...restImage}
          />
        </div>
        <span className={`capitalize`}>{caption}</span>
      </PrimaryButton>
    </li>
  );
};
