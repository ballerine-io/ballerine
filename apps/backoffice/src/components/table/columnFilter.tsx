import React, { FunctionComponent, useState } from 'react';
import { ActionIcon, Group, Menu, Stack, TextInput } from '@pankod/refine-mantine';
import { IconCheck, IconFilter, IconX } from '@tabler/icons';

import { ColumnButtonProps } from 'interfaces';

export const ColumnFilter: React.FC<ColumnButtonProps> = ({ column }) => {
  const [state, setState] = useState<null | { value: string }>(null);

  if (!column.getCanFilter()) {
    return null;
  }

  const open = () => {
    const value = column.getFilterValue();

    if (typeof value !== 'string') return;

    setState({
      value,
    });
  };

  const close = () => setState(null);

  const change = (value: string) => setState({ value });

  const clear = () => {
    column.setFilterValue(undefined);
    close();
  };

  const save = () => {
    if (!state) return;
    column.setFilterValue(state.value);
    close();
  };

  const renderFilterElement = () => {
    const FilterComponent = (
      column.columnDef?.meta as {
        filterElement: FunctionComponent<{ value: string; onChange: (value: string) => void }>;
      }
    )?.filterElement;

    if (!FilterComponent && !!state) {
      return <TextInput autoComplete="off" value={state.value} onChange={e => change(e.target.value)} />;
    }

    return <FilterComponent value={state?.value ?? ''} onChange={change} />;
  };

  return (
    <Menu
      opened={!!state}
      position="bottom"
      withArrow
      transition="scale-y"
      shadow="xl"
      onClose={close}
      width="256px"
      withinPortal
    >
      <Menu.Target>
        <ActionIcon
          size="xs"
          onClick={open}
          variant={column.getIsFiltered() ? 'light' : 'transparent'}
          color={column.getIsFiltered() ? 'primary' : 'gray'}
        >
          <IconFilter size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {!!state && (
          <Stack p="xs" spacing="xs">
            {renderFilterElement()}
            <Group position="right" spacing={6} noWrap>
              <ActionIcon size="md" color="gray" variant="outline" onClick={clear}>
                <IconX size={18} />
              </ActionIcon>
              <ActionIcon size="md" onClick={save} color="primary" variant="outline">
                <IconCheck size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
