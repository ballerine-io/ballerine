import React, { FunctionComponent } from 'react';
import { Box, Sx, Text, Title } from '@pankod/refine-mantine';
import { IDataFieldProps } from './interfaces';

/**
 * @description A component which uses Mantine's Box component to wrap a Title and Text component in order to display data.
 *
 * References:
 * - [Box documentation](https://mantine.dev/core/box/)
 * - [Title documentation](https://mantine.dev/core/title/)
 * - [Text documentation](https://mantine.dev/core/text/)
 *
 * @param props - Props to pass to the root Box component.
 * @param props.title - The content to display within the Title component.
 * @param props.text - The content to display within the Text component.
 * @param props.titleProps - Props to pass to the Title component.
 * @param props.textProps - Props to pass to the Text component.
 * @constructor
 */
export const DataField: FunctionComponent<IDataFieldProps> = props => {
  const { title, text, titleProps = {}, textProps = {}, ...rest } = props;
  const { sx: titleSx, ...titleRest } = titleProps;
  const { sx: textSx, ...textRest } = textProps;
  const sharedStyles: Sx = {
    fontSize: '0.875rem',
    color: '#4D4D4D',
    fontWeight: 700,
    lineHeight: '1.5rem',
    wordWrap: 'break-word',
  };

  return (
    <Box {...rest}>
      <Title
        order={4}
        sx={{
          opacity: '0.35',
          ...sharedStyles,
          ...titleSx,
        }}
        {...titleRest}
      >
        {title}
      </Title>
      <Text
        sx={{
          ...sharedStyles,
          ...textSx,
        }}
        {...textRest}
      >
        {text ?? ''}
      </Text>
    </Box>
  );
};
