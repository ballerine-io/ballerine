import { getPhoneNumberFormatter } from '@/common/utils/get-phone-number-formatter/get-phone-number-formatter';

export const useMainRepresentativeBlock = ({ mainRepresentative, workflow }) => {
  if (Object.keys(mainRepresentative ?? {}).length === 0) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Main Representative',
        },
        {
          type: 'subheading',
          value: 'User-provided Data',
        },
        {
          type: 'details',
          value: {
            data: Object.entries(mainRepresentative).map(([title, value]) => {
              const formatter =
                getPhoneNumberFormatter(value) ?? getPhoneNumberFormatter(`+${value}`);

              return {
                title,
                value: formatter?.formatInternational() ?? value,
                isEditable: false,
              };
            }),
          },
          workflowId: workflow?.id,
          documents: workflow?.context?.documents,
          hideSeparator: true,
        },
      ],
    },
  ];
};
