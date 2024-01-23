import { GenericAsyncFunction, GenericFunction } from '@/common/types';
import { ComponentProps } from 'react';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';

export interface ICallToActionProps {
  value: {
    text: string;
    onClick: GenericFunction | GenericAsyncFunction;
    props?: ComponentProps<typeof MotionButton>;
  };
}
