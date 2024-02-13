import { useDocumentListener } from '@/common/hooks/useDocumentListener/useDocumentListener';
import { useCallback, useMemo, useRef } from 'react';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useEntityType } from '@/common/hooks/useEntityType/useEntityType';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { tagToBadgeData } from '@/pages/Entity/components/Case/consts';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useParams } from 'react-router-dom';

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

const businessesSortByOptions = [
  ...sharedSortByOptions,
  {
    label: 'Business Name',
    value: 'companyName',
  },
];

export const useCases = () => {
  const { entityId: workflowId } = useParams();
  const [{ filterId, filter, sortBy }] = useSearchParamsByEntity();
  const entity = useEntityType();

  const { data: workflow } = useWorkflowByIdQuery({ workflowId, filterId });

  const states = useMemo(
    () => workflow?.workflowDefinition.definition.states,
    [workflow?.workflowDefinition.definition.states],
  );

  const statuses = useMemo(
    () => [
      ...new Set(
        Object.keys(states || {})
          .filter(key => states?.[key]?.tags?.length)
          .flatMap(key => states?.[key]?.tags),
      ),
    ],
    [states],
  );

  const { data: users } = useUsersQuery();

  // Not using for now, will return to use it in the future
  const sortByOptions = useMemo(
    () => (entity === 'individuals' ? individualsSortByOptions : businessesSortByOptions),
    [entity],
  );

  const filterByOptions = useMemo(
    () =>
      [
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
        ...(statuses?.length
          ? [
              {
                label: 'Status',
                value: 'caseStatus',
                options: [
                  ...(statuses?.map(status => ({
                    label: tagToBadgeData[status]?.text,
                    value: status,
                    key: status,
                  })) ?? []),
                ],
              },
            ]
          : []),
        {
          label: 'State',
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
      ] as const,
    [statuses, users],
  );

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
        break;
      case 'f': {
        if (!filterRef.current) break;

        const dropdown = filterRef.current.closest('.dropdown');

        dropdown?.classList.toggle('dropdown-open');
        dropdown?.classList.toggle('dropdown-hover');

        if (!dropdown?.classList.contains('dropdown-hover')) {
          filterRef.current.click();
        }

        break;
      }
    }
  });

  return {
    entity,
    sortByOptions: sharedSortByOptions,
    filterByOptions,
    filter,
    sortBy,
    searchRef,
    sortRef,
    filterRef,
    handleDropdown,
  };
};
