import { ImageProps, SkeletonProps } from '@pankod/refine-mantine';

export interface IBallerineImageProps extends ImageProps {
  src: string;
  alt: string;
  skeletonProps?: SkeletonProps;
}
