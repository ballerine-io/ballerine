import { Button, List } from '@mantine/core';
import { FunctionComponent } from 'react';
import { IImageItemProps } from './interfaces';
import { useImageViewerContext } from '../context/hooks/useImageViewerContext/useImageViewerContext';
import { BallerineImage } from '../../../atoms/BallerineImage/BallerineImage';

/**
 * @description To be used by ImageViewer, and be wrapped by ImageList. Uses Mantine's List.Item component with default styling to display a single image which sets the selected image on click.
 *
 * References:
 * - [List documentation](https://mantine.dev/core/list/)
 * - [Image documentation](https://mantine.dev/core/image/)
 * - [Button documentation](https://mantine.dev/core/button/)
 * @param props
 * @constructor
 */
export const ImageItem: FunctionComponent<IImageItemProps> = props => {
  const { src, caption, imageProps = {}, buttonProps = {}, sx = {}, alt, ...rest } = props;
  const { sx: buttonSx = {}, ...restButton } = buttonProps;
  const { sx: imageSx = {}, ...restImage } = imageProps;
  const { onSelectImage } = useImageViewerContext();
  return (
    <List.Item
      {...rest}
      sx={{
        '&:hover img, &:focus-within img': {
          borderColor: '#1540A8',
          boxShadow: '0px 4px 16px 0px #6574FF4D',
        },
        ...sx,
      }}
    >
      <Button
        unstyled
        sx={{
          cursor: 'pointer',
          padding: '0px',
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          '&:focus-visible': {
            outline: 'none',
          },
          '& .mantine-Button-label': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
          ...buttonSx,
        }}
        onClick={onSelectImage(src)}
        {...restButton}
      >
        <BallerineImage
          src={src}
          height={'4.375rem'}
          sx={{
            minWidth: '4rem',
            maxWidth: '4rem',
            aspectRatio: '57 / 70',
            '& img': {
              border: '2px solid transparent',
            },
            ...imageSx,
          }}
          alt={alt}
          {...restImage}
        />
        <span style={{ fontSize: '12px', color: '#000000' }}>{caption}</span>
      </Button>
    </List.Item>
  );
};
