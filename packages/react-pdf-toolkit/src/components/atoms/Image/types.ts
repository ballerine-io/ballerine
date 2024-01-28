import { BaseComponentProps } from '@/types/base-component-props';

export interface ImageProps extends BaseComponentProps {
  width: number;
  height: number;
  src: string;
}
