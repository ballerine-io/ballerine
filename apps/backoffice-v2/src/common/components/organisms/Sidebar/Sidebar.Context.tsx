import * as React from 'react';

import type { TSidebarContext } from '@/common/components/organisms/Sidebar/types';

export const SidebarContext = React.createContext<TSidebarContext | null>(null);
