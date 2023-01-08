import React, { ChangeEvent, useCallback } from 'react';
import { Group } from '@pankod/refine-mantine';

import { SubjectList } from './components/SubjectList';
import { SubjectContent } from './components/SubjectContent';
import { useHandleSelectedUser, useUsersQuery } from './hooks';
import routerProvider from '@pankod/refine-react-router-v6';
import { useSearch } from '../../hooks/useSearch/useSearch';
import { useFilter } from '../../hooks/useFilter/useFilter';
import { IUser } from '../../mock-service-worker/users/interfaces';
import { useSort } from '../../hooks/useSort/useSort';
import { usePagination } from '../../hooks/usePagination/usePagination';
import { wordsToSnakeCase } from '../../utils/words-to-snake-case/words-to-snake-case';

/**
 * @description Handles the state and logic of UsersList and returns data consumed by UsersList's children.
 */
export const useUsersList = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const { id = '' } = routerProvider.useParams() as {
    id: string;
  };
  const { data: { data } = {} } = useUsersQuery();

  // Apply search, filter, sort, and pagination on the users array
  const { searched, onSearch } = useSearch({
    data: data ?? [],
    searchBy: ['first_name', 'last_name', 'email', 'phone'],
  });

  const { filtered, onFilter, filter } = useFilter({
    data: searched,
  });

  const { sorted, onSortBy } = useSort<IUser>({
    data: filtered,
    initialState: {
      sortBy: ['created_at'],
    },
  });

  const { paginated, pagesCount, currentPage, onPaginate } = usePagination<IUser>({
    data: sorted,
    pageSize: 20,
  });

  // Handles the active user state after approve/reject
  const selectedUserIndex = paginated.findIndex(user => user.id === id);
  const nextId = paginated[selectedUserIndex + 1]?.id;

  // Callbacks
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch],
  );

  const handleSortBy = useCallback(
    (value: string | null) => {
      if (!value) return;

      const nextSortBy = wordsToSnakeCase(value) as keyof IUser;

      onSortBy([nextSortBy]);
    },
    [onSortBy],
  );

  const handleFilter = useCallback(
    (key: keyof IUser) => (value: Array<string>) => {
      onFilter({
        [key]: value,
      });
    },
    [onSearch],
  );

  useHandleSelectedUser(paginated);

  return {
    handleSearch,
    handleFilter,
    handleSortBy,
    onPaginate,
    filter,
    paginated,
    currentPage,
    pagesCount,
    nextId,
  };
};

export const UsersList: React.FC = () => {
  const { handleSearch, handleFilter, handleSortBy, onPaginate, filter, paginated, currentPage, pagesCount, nextId } =
    useUsersList();

  return (
    <Group noWrap spacing={3} position="apart" style={{ height: '100%' }}>
      <SubjectList
        handleSearch={handleSearch}
        handleFilter={handleFilter}
        handleSortBy={handleSortBy}
        onPaginate={onPaginate}
        filter={filter}
        data={paginated}
        currentPage={currentPage}
        pagesCount={pagesCount}
      />
      <SubjectContent nextId={nextId} />
    </Group>
  );
};
