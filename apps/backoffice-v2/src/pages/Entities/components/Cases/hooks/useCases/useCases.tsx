import { useDocumentListener } from '../../../../../../common/hooks/useDocumentListener/useDocumentListener';
import { useCallback, useRef } from 'react';
import { useUsersQuery } from '../../../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useEntityType } from '../../../../../../common/hooks/useEntityType/useEntityType';
import { useSearchParamsByEntity } from '../../../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { DocumentDecisionStatus } from '../../../../../../common/enums';

export const useCases = () => {
  const [{ filter, sortBy }] = useSearchParamsByEntity();
  const entity = useEntityType();
  const sharedSortByOptions = [
    {
      label: 'Created At',
      value: 'createdAt',
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
      label: 'Status',
      value: 'status',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
    },
    {
      label: 'Assignee',
      value: 'assigneeId',
      options: [
        ...(users?.map(({ id, fullName }) => ({
          label: fullName,
          value: id,
          key: id,
        })) ?? []),
        {
          label: 'Unassigned',
          value: null,
        },
      ],
    },
    {
      label: 'Decision',
      value: 'tasksStatus',
      options: [
        {
          label: 'Approved',
          value: DocumentDecisionStatus.APPROVED,
        },
        {
          label: 'Rejected',
          value: DocumentDecisionStatus.REJECTED,
        },
        {
          label: 'Revision',
          value: DocumentDecisionStatus.REVISION,
        },
        {
          label: 'Pending',
          value: DocumentDecisionStatus.PENDING,
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
    if (!event.ctrlKey || !event.shiftKey) return;

    const listeners = ['k', 's', 'f'] as const;

    if (!listeners.includes(event.key?.toLowerCase() as (typeof listeners)[number])) return;

    event.preventDefault();

    switch (event.key?.toLowerCase()) {
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
