import { FunctionComponent, useLayoutEffect, useRef } from 'react';
import { Avatar, Box, CSSObject, Group, Stack, Text, UnstyledButton } from '@pankod/refine-mantine';
import ReactAvatar from 'react-avatar';
import { TextProps, Transition } from '@mantine/core';

import { IUser } from '../../../mock-service-worker/users/interfaces';
import dayjs from 'dayjs';
import { StateStatusIcons } from 'components/atoms/StateStatusIcons';

export const useEllipsesWithTitle = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const childOffsetWidth = ref.current?.offsetWidth;
  const parentOffsetWidth = ref.current?.parentElement?.offsetWidth;
  const styles: CSSObject = {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  };

  useLayoutEffect(() => {
    if (childOffsetWidth !== parentOffsetWidth) {
      ref.current?.removeAttribute('title');

      return;
    }

    ref.current?.setAttribute('title', ref.current?.textContent ?? '');
  }, [childOffsetWidth, parentOffsetWidth]);

  return {
    ref,
    styles,
  };
};

interface ITextWithEllipsesProps extends TextProps {
  width: CSSObject['width'];
}

export const TextWithEllipses: FunctionComponent<ITextWithEllipsesProps> = props => {
  const { width, children, sx, ...rest } = props;
  const { ref, styles } = useEllipsesWithTitle();

  return (
    <Text
      sx={{
        width,
        ...sx,
      }}
      {...rest}
    >
      <Box component={'span'} ref={ref} sx={styles}>
        {children}
      </Box>
    </Text>
  );
};
export const SubjectListItem = ({ itemData, operator }: { itemData: IUser; operator: string }) => {
  const timePast = dayjs(itemData.created_at)
    .fromNow()
    // Change 'Waiting a day ago' to 'Waiting a day'.
    .replace('ago', '');
  const fullName = `${itemData.first_name} ${itemData.last_name}`;

  return (
    <Stack spacing={0}>
      <UnstyledButton>
        <Group style={{ padding: '0 10px' }} position="apart">
          <Group spacing={20}>
            <div style={{ position: 'relative', width: '32px', height: '32px' }}>
              <ReactAvatar size="32px" round name={fullName} />
              <StateStatusIcons state={itemData.state} />
            </div>
            <Stack spacing={0}>
              <TextWithEllipses weight={500} size={14} width={'15ch'}>
                {fullName}
              </TextWithEllipses>
              <Text mt={2} weight={300} size="xs" color="#d5d6d4">
                Waiting {timePast}
              </Text>
            </Stack>
          </Group>
          <Transition mounted={!!operator} transition="fade" duration={400} timingFunction="ease">
            {transitionStyles => (
              <Avatar.Group spacing="xs" style={transitionStyles}>
                <ReactAvatar size="20px" round src={operator} />
              </Avatar.Group>
            )}
          </Transition>
        </Group>
      </UnstyledButton>
    </Stack>
  );
};
