import { View } from '@react-pdf/renderer';
import { tw } from '@/theme';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';
import { BaseComponentProps } from '@/types/base-component-props';
import { mergeStyles } from '@/utils/merge-styles';

export interface WrapperProps extends BaseComponentProps {
  children: AnyChildren;
}

export const Wrapper: FunctionComponent<WrapperProps> = ({ children, styles = [] }) => (
  <View style={mergeStyles([tw('p-4 bg-[#EFF4FD] '), ...styles])}>{children}</View>
);
