import { ActionIcon, CheckIcon } from '@mantine/core';
import { FunctionComponent } from 'react';
import { IOcrButtonProps } from './interfaces';

export const OcrButton: FunctionComponent<IOcrButtonProps> = props => {
  const { onClick, isSubmittable, sx, ...rest } = props;

  return (
    <ActionIcon
      unstyled
      sx={{
        '&:focus, &:hover': {
          outline: 'none',
          borderColor: '#1540A8',
        },
        cursor: 'pointer',
        border: '2px solid transparent',
        borderRadius: '100vh',
        fontSize: 11,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '2rem',
        height: '2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        ...sx,
      }}
      onClick={onClick}
      {...rest}
    >
      {isSubmittable ? <CheckIcon /> : 'OCR'}
    </ActionIcon>
  );
};
