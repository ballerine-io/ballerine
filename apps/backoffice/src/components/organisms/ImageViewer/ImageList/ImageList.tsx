import { FunctionComponent } from 'react';
import { List } from '@mantine/core';
import { IImageListProps } from './interfaces';

/**
 * @description To be used by ImageViewer. Uses Mantine's List component to display a list of images with default styling.
 *
 * References:
 * - [List documentation](https://mantine.dev/core/list/)
 * @param props
 * @constructor
 */
export const ImageList: FunctionComponent<IImageListProps> = props => {
  const { children, sx, ...rest } = props;

  return (
    <List
      listStyleType={'none'}
      sx={{
        display: 'flex',
        columnGap: '24px',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </List>
  );
};
