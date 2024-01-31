import { DotIconProps } from '@/components/icons/DotIcon/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const DotIcon: FunctionComponent<DotIconProps> = ({ size, color = '#000' }) => (
  <View
    style={mergeStyles([
      tw('rounded-full'),
      { width: `${size}px`, height: `${size}px`, backgroundColor: color },
    ])}
  />
);
