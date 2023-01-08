import { ActionIcon, Box, Collapse, Divider, Flex, Title } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { ChevronDownSvg } from 'atoms/ChevronDownSvg/ChevronDownSvg';
import { useCallback } from 'react';

export const OcrToggle = ({ ocrText }: { ocrText: string }) => {
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
          Document OCR:
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
      </Flex>
      <Collapse in={!isCollapsed}>
        <Box style={{ maxWidth: 300 }}>Doc OCR: {ocrText}</Box>
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
