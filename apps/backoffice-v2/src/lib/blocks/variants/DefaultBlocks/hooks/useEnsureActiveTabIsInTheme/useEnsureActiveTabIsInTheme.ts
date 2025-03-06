import { Blocks } from '@ballerine/blocks';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toScreamingSnakeCase } from '@/common/utils/to-screaming-snake-case/to-screaming-snake-case';
import { camelCase } from 'string-ts';

export const useEnsureActiveTabIsInTheme = ({
  tabBlocks,
  activeTab,
}: {
  tabBlocks: Record<string, Blocks>;
  activeTab: string;
}) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tabBlocksKeys = Object.keys(tabBlocks);

    if (tabBlocksKeys.includes(toScreamingSnakeCase(activeTab)) || !tabBlocksKeys[0]) {
      return;
    }

    const searchParams = new URLSearchParams(search);

    searchParams.set('activeTab', camelCase(tabBlocksKeys[0]));

    navigate({
      search: searchParams.toString(),
    });
  }, [activeTab, navigate, search, tabBlocks]);
};
