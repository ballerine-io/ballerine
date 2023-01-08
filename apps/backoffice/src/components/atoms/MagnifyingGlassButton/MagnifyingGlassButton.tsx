import { ActionIcon } from '@mantine/core';
import { FunctionComponent } from 'react';
import { IMagnifyingGlassButtonProps } from './interfaces';
import { MagnifyingGlassSvg } from '../MagnifyingGlassSvg/MagnifyingGlassSvg';

export const MagnifyingGlassButton: FunctionComponent<IMagnifyingGlassButtonProps> = props => {
  const { onClick, sx, ...rest } = props;

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
        width: '2rem',
        height: '2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        ...sx,
      }}
      onClick={onClick}
      {...rest}
    >
      <MagnifyingGlassSvg />
    </ActionIcon>
  );
};
