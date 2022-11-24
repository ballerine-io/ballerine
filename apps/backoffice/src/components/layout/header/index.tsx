import { useGetIdentity, useGetLocale, useSetLocale } from '@pankod/refine-core';
import { ActionIcon, Group, MantineHeader, Title, Avatar, useMantineColorScheme, Menu } from '@pankod/refine-mantine';
import { IconSun, IconMoonStars, IconLanguage } from '@tabler/icons';

import i18n from 'i18n';

export const Header: React.FC = () => {
  const { data: user } = useGetIdentity();
  const showUserInfo = user && (user.name || user.avatar);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const changeLanguage = useSetLocale();
  const locale = useGetLocale();
  const currentLocale = locale();

  return (
    <MantineHeader height={50} p="xs">
      <Group position="right">
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconLanguage size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {[...(i18n.languages ?? [])].sort().map((lang: string) => (
              <Menu.Item
                key={lang}
                onClick={() => {
                  changeLanguage(lang);
                }}
                value={lang}
                color={lang === currentLocale ? 'primary' : undefined}
                icon={<Avatar src={`/images/flags/${lang}.svg`} size={18} radius="lg" />}
              >
                {lang === 'en' ? 'English' : 'German'}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'primary'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
        {showUserInfo && (
          <Group spacing="xs">
            <Title order={6}>{user?.name}</Title>
            <Avatar src={user?.avatar} alt={user?.name} radius="xl" />
          </Group>
        )}
      </Group>
    </MantineHeader>
  );
};
