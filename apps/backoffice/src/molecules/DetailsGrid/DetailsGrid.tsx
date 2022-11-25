import React, { PropsWithRef, useCallback } from 'react';
import { Collapse, Divider, Grid, Title, useToggle } from '@pankod/refine-mantine';
import { ActionIcon, Flex } from '@mantine/core';
import type { IDetailsGridProps } from './interfaces';
import { useDetailsGrid } from './hooks/useDetailsGrid/useDetailsGrid';
import { ChevronDownSvg } from '../../atoms/ChevronDownSvg/ChevronDownSvg';

/**
 * @description Displays a title and a collapsable 3 columns grid of DataField with an option of passing a component next to the title or to the bottom of the grid.
 *
 * References:
 * - [Grid documentation](https://mantine.dev/core/grid/)
 *
 * @param props - Props to pass to the root Grid component.
 * @param props.data - The data to pass to the DataField - expects an object, coverts its keys to Start case to be used as a title.
 * @param props.Header - An optional component to display next to the title.
 * @param props.Footer - An optional component to display at the bottom of the grid.
 * @constructor
 */
export const DetailsGrid = <TRecord extends Record<PropertyKey, any>>(
  props: PropsWithRef<IDetailsGridProps<TRecord>>,
) => {
  const { data = {}, title, Header, Footer, children, ...rest } = props;
  const { dataFields } = useDetailsGrid(data);
  const [isCollapsed, toggleIsCollapsed] = useToggle();
  // Not using toggleIsCollapsed directly to avoid passing in the event.
  const onToggleIsCollapsed = useCallback(() => toggleIsCollapsed(), [toggleIsCollapsed]);

  return (
    <>
      <Flex
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Title
          order={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: '1.5rem',
            fontSize: '1.5rem',
          }}
        >
          {title}
          <ActionIcon
            onClick={onToggleIsCollapsed}
            size={12}
            sx={{
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ChevronDownSvg />
          </ActionIcon>
        </Title>
        {!!Header && Header}
      </Flex>
      <Collapse in={!isCollapsed}>
        <Grid {...rest}>
          {dataFields?.map(({ title, text }) => (
            <Grid.Col span={6} xl={4} key={`${title}-${text}`}>
              {children({ title, text })}
            </Grid.Col>
          ))}
          {!!Footer && <Grid.Col span={12}>{Footer}</Grid.Col>}
        </Grid>
      </Collapse>
      <Divider
        sx={{
          borderRadius: '49px',
          borderColor: '#F2F2F2',
        }}
      />
    </>
  );
};
