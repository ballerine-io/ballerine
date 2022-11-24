import { FC } from 'react';
import { EState } from 'mock-service-worker/users/enums';
import { ActionIcon, Transition } from '@mantine/core';
import styles from './StateStatusIcons.module.css';
import classNames from 'classnames';
import { IconCheck, IconX, IconMinus } from '@tabler/icons';

interface Props {
  state: EState;
}

const getColor = (state: EState) => {
  if (state === EState.REJECTED) {
    return 'red';
  }
  return 'green';
};

export const StateStatusIcons: FC<Props> = ({ state }) => {
  return (
    <Transition
      mounted={state === EState.APPROVED || state === EState.REJECTED}
      transition="fade"
      duration={400}
      timingFunction="ease"
    >
      {transitionStyles => (
        <ActionIcon style={transitionStyles} className={styles.icon} variant="filled" color={getColor(state)} size="xs">
          {state === EState.APPROVED && <IconCheck size={12} />}
          {state === EState.REJECTED && <IconX size={12} />}
        </ActionIcon>
      )}
    </Transition>
  );
};
