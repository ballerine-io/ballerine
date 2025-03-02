import { Settings2Icon } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { LogOutSvg } from '@/common/components/atoms/icons';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/common/components/organisms/Sidebar/Sidebar';
import { useAuthContext } from '@/domains/auth/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useSignOutMutation } from '@/domains/auth/hooks/mutations/useSignOutMutation/useSignOutMutation';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { NavItem } from './NavItem';

export const NavFooter = () => {
  const { mutate: signOut } = useSignOutMutation();
  const { signOutOptions } = useAuthContext();
  const onSignOut = useCallback(
    () =>
      signOut({
        redirect: signOutOptions?.redirect,
        callbackUrl: signOutOptions?.callbackUrl,
      }),
    [signOutOptions?.redirect, signOutOptions?.callbackUrl, signOut],
  );
  const { data: customer, isLoading: isCustomerLoading } = useCustomerQuery();
  const { data: session } = useAuthenticatedUserQuery();
  const fullName = useMemo(
    () => `${session?.user?.firstName} ${session?.user?.lastName}`,
    [session?.user?.firstName, session?.user?.lastName],
  );

  return (
    <SidebarMenu>
      {customer?.config?.isDemoAccount && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavItem
              navItem={{
                text: 'Configurations',
                icon: Settings2Icon,
                premium: {
                  caption: 'Configure your risk tools to perform according to your risk appetite',
                  checkList: [
                    'Assign risk weights',
                    'Align with your policies',
                    'Request new categories',
                  ],
                  videoLink:
                    'https://www.loom.com/embed/aa86729a657140c1988f0769ce8a29f8?sid=b22db479-b6c8-46e9-93be-c4e00751d8a8',
                },
                key: 'nav-item-documents-verifications',
              }}
              className="mb-6 cursor-default group-data-[collapsible=icon]:!px-0"
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      <SidebarMenuItem className="mb-2 mt-auto flex flex-col space-y-2 px-2 group-data-[collapsible=icon]:px-0">
        <SidebarMenuButton className="-ml-0.5 flex h-9 items-center gap-x-2 rounded-md text-sm font-medium normal-case">
          <UserAvatar fullName={fullName} avatarUrl={session?.user?.avatarUrl} />
          <div className="text-sm">{fullName}</div>
        </SidebarMenuButton>

        <SidebarMenuButton
          className="flex h-9 items-center gap-x-2 rounded-md py-0 text-sm font-medium normal-case"
          onClick={onSignOut}
        >
          <LogOutSvg className="h-4 w-4" />
          Log out
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
