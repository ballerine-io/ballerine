import { useGetIdentity, useGetLocale, useSetLocale } from '@pankod/refine-core';
import { ActionIcon, Avatar, Group, MantineHeader, Menu, Title, useMantineColorScheme } from '@pankod/refine-mantine';
import { IconLanguage, IconMoonStars, IconSun } from '@tabler/icons';

import i18n from 'i18n';

export interface IAuthUser {
  name?: string;
  avatar?: string;
}

export const Header: React.FC = () => {
  const { data: user } = useGetIdentity<IAuthUser>();
  const showUserInfo = !!user?.name || !!user?.avatar;

  const mantineColorScheme = useMantineColorScheme();
  const dark = mantineColorScheme.colorScheme === 'dark';

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
                onClick={void (async () => changeLanguage(lang))}
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
          onClick={() => mantineColorScheme.toggleColorScheme()}
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
