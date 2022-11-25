// import React from 'react';
import { Refine } from '@pankod/refine-core';
import {
  ColorScheme,
  ColorSchemeProvider,
  DarkTheme,
  ErrorComponent,
  Global,
  LightTheme,
  MantineProvider,
  notificationProvider,
  NotificationsProvider,
  ReadyPage,
  useLocalStorage,
} from '@pankod/refine-mantine';

import routerProvider from '@pankod/refine-react-router-v6';
import dataProvider from '@pankod/refine-simple-rest';
import { RefineKbarProvider } from '@pankod/refine-kbar';
import { useTranslation } from 'react-i18next';
import { Header, Layout, Sider, Title } from 'components/layout';
import { OffLayoutArea } from 'components/offLayoutArea';
// import { authProvider } from './authProvider';
import { UsersCreate, UsersEdit, UsersList } from 'pages/users';
import { newEnforcer } from 'casbin';
import { adapter, model } from './access-control';
import { CommingSoon } from 'pages/common';
import { IconBuilding, IconCheckbox, IconReceipt2, IconUserCheck } from '@tabler/icons';

LightTheme.colors!.primary = [
  '#e9f5f9',
  '#d3eaf2',
  '#bee0ec',
  '#a8d5e5',
  '#92cbdf',
  '#7cc0d8',
  '#66b6d2',
  '#51abcb',
  '#3ba1c5',
  '#2596be',
];
function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const { t, i18n } = useTranslation();

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={colorScheme === 'dark' ? DarkTheme : LightTheme} withNormalizeCSS withGlobalStyles>
        <Global styles={{ body: { WebkitFontSmoothing: 'auto' } }} />
        <NotificationsProvider position="top-center">
          <RefineKbarProvider>
            <Refine
              accessControlProvider={{
                async can({ resource, params, action }) {
                  const enforcer = await newEnforcer(model, adapter);

                  if (action === 'field') {
                    const field = typeof params?.field === 'string' ? `/${params?.field}` : '';
                    const can = await enforcer.enforce('admin', `${resource}${field}`, action);

                    return Promise.resolve({ can });
                  }

                  const can = await enforcer.enforce('admin', resource, action);

                  return Promise.resolve({ can });
                },
              }}
              notificationProvider={notificationProvider}
              ReadyPage={ReadyPage}
              catchAll={<ErrorComponent />}
              routerProvider={routerProvider}
              dataProvider={dataProvider(window.location.origin)}
              // authProvider={authProvider}
              // LoginPage={AuthPage}
              disableTelemetry={true}
              resources={[
                // {
                //   name: 'home',
                //   options: { label: 'Home' },
                //   list: CommingSoon,
                //   show: CommingSoon,
                //   create: CommingSoon,
                //   edit: CommingSoon,
                // },
                {
                  name: 'case-management',
                  options: { label: 'Case Management' },
                  icon: <IconCheckbox size={20} strokeWidth={1.5} />,
                },
                {
                  parentName: 'case-management',
                  name: 'users',
                  options: { label: 'Users' },
                  list: UsersList,
                  create: UsersCreate,
                  edit: UsersEdit,
                  show: UsersList,
                  icon: <IconUserCheck size={18} />,
                },
                {
                  parentName: 'case-management',
                  name: 'companies',
                  options: { label: 'Companies - Soon' },
                  list: CommingSoon,
                  create: CommingSoon,
                  edit: CommingSoon,
                  show: CommingSoon,
                  icon: <IconBuilding size={18} />,
                },
                {
                  parentName: 'case-management',
                  name: 'transactions',
                  options: { label: 'Transactions - Soon' },
                  list: CommingSoon,
                  create: CommingSoon,
                  edit: CommingSoon,
                  show: CommingSoon,
                  icon: <IconReceipt2 size={18} />,
                },
              ]}
              Title={Title}
              Sider={Sider}
              Layout={Layout}
              Header={Header}
              OffLayoutArea={OffLayoutArea}
              i18nProvider={i18nProvider}
            />
          </RefineKbarProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
