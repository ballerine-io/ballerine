import React from 'react';
import { LayoutProps } from '@pankod/refine-core';
import { Box } from '@pankod/refine-mantine';

import { Sider as DefaultSider } from '../sider';
import { Header as DefaultHeader } from '../header';

export const Layout: React.FC<LayoutProps> = ({ Sider, Header, Footer, OffLayoutArea, children }) => {
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;

  return (
    <Box sx={{ display: 'flex', padding: 0 }}>
      <SiderToRender />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* <HeaderToRender /> */}
        <Box
          component="main"
          sx={theme => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : '#fff',
            minHeight: '100vh',
          })}
        >
          {children}
        </Box>
        {Footer && <Footer />}
      </Box>
      {OffLayoutArea && <OffLayoutArea />}
    </Box>
  );
};
