import { BoxProps, TextProps, TitleProps } from '@mantine/core';

export interface IDataFieldProps extends BoxProps {
  title: string;
  text: string;
  titleProps?: TitleProps;
  textProps?: TextProps;
}
