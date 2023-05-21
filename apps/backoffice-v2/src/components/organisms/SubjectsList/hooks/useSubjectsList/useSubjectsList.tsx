import { useSearch } from '@tanstack/react-router';
import { useDocumentListener } from 'hooks/useDocumentListener/useDocumentListener';
import { useCallback, useRef } from 'react';
import { TRouteId } from '../../../../../types';
import { useUsersQuery } from '../../../../../lib/react-query/queries/useUsersQuery/useUsersQuery';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';

export const useSubjectsList = (routerId: TRouteId) => {
  const { filter, sortBy } = useSearch({ from: routerId, strict: false });
  const entity = useFilterEntity();
  const sharedSortByOptions = [
    {
      label: 'Created At',
      value: 'caseCreatedAt',
    },
  ];
  const individualsSortByOptions = [
    ...sharedSortByOptions,
    {
      label: 'First Name',
      value: 'firstName',
    },
    {
      label: 'Last Name',
      value: 'lastName',
    },
    {
      label: 'Email',
      value: 'email',
    },
  ] as const;
  const { data: users } = useUsersQuery();
  const businessesSortByOptions = [
    ...sharedSortByOptions,
    {
      label: 'Business Name',
      value: 'companyName',
    },
  ];
  const sortByOptions =
    entity === 'individuals' ? individualsSortByOptions : businessesSortByOptions;
  const filterByOptions = [
    {
      label: 'Assignee',
      value: 'assigneeId',
      options: [
        ...users.map(({ id, fullName }) => ({
          label: fullName,
          value: id,
          key: id,
        })),
        {
          label: 'Unassigned',
          value: null,
        },
      ],
    },
  ] as const;
  const searchRef = useRef<HTMLInputElement>();
  const sortRef = useRef<HTMLButtonElement>();
  const filterRef = useRef<HTMLButtonElement>();
  const handleDropdown = useCallback(e => {
    const dropdown = e.target.closest('.dropdown');

    if (dropdown.classList.contains('dropdown-hover')) return;

    dropdown.classList.add('dropdown-hover');
    dropdown.classList.remove('dropdown-open');
  }, []);

  useDocumentListener('keydown', event => {
    if (!event.ctrlKey) return;

    event.preventDefault();

    switch (event.key) {
      case 'k':
        if (!searchRef.current) break;

        searchRef.current.focus();
        break;
      case 's':
        if (!sortRef.current) break;

        sortRef.current.focus();
      case 'f':
        if (!filterRef.current) break;

        const dropdown = filterRef.current.closest('.dropdown');

        dropdown.classList.toggle('dropdown-open');
        dropdown.classList.toggle('dropdown-hover');

        if (!dropdown.classList.contains('dropdown-hover')) {
          filterRef.current.click();
        }

        break;
    }
  });

  return {
    entity,
    sortByOptions,
    filterByOptions,
    filter,
    sortBy,
    searchRef,
    sortRef,
    filterRef,
    handleDropdown,
  };
};
