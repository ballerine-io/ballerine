import { useSearch } from '@tanstack/react-router';
import { useDocumentListener } from 'hooks/useDocumentListener/useDocumentListener';
import { useCallback, useRef } from 'react';
import { TRouteId } from '../../../../../types';
import { useUsersQuery } from '../../../../../lib/react-query/queries/useUsersQuery/useUsersQuery';

export const useSubjectsList = (routerId: TRouteId) => {
  const { filter, sortBy } = useSearch({ from: routerId, strict: false });
  const sortByOptions = [
    {
      label: 'Created At',
      value: 'createdAt',
    },
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
  const filterByOptions = [
    {
      label: 'User status',
      value: 'approvalState',
      options: [
        {
          label: 'Rejected',
          value: 'REJECTED',
        },
        {
          label: 'Approved',
          value: 'APPROVED',
        },
        {
          label: 'Processing',
          value: 'PROCESSING',
        },
        {
          label: 'New',
          value: 'NEW',
        },
      ],
    },
    {
      label: 'User type',
      value: 'endUserType',
      options: [
        {
          label: 'Individual',
          value: 'individual',
        },
        {
          label: 'Business',
          value: 'business',
        },
      ],
    },
    {
      label: 'Assignee',
      value: 'assigneeId',
      options: [
        ...users.map(({ id, fullName }) => ({
          label: fullName,
          value: id,
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
