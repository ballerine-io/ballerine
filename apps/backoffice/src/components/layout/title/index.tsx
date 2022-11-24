import React from 'react';
import { useRouterContext, TitleProps } from '@pankod/refine-core';
import { Box, Center } from '@pankod/refine-mantine';

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Link to="/">
      <Box p="xs" pl={0} style={{ textAlign: 'center' }}>
        {collapsed ? (
          <img src="/ballerine-collapsed.svg" alt="Ballerine" />
        ) : (
          <img src="/ballerine.svg" alt="Ballerine" width="140px" />
        )}
      </Box>
    </Link>
  );
};
