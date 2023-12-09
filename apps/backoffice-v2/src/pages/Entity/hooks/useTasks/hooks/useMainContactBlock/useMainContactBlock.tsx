import { getPhoneNumberFormatter } from '@/common/utils/get-phone-number-formatter/get-phone-number-formatter';

export const useMainContactBlock = ({ mainContact, workflow }) => {
  if (Object.keys(mainContact ?? {}).length === 0) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Main Contact',
        },
        {
          type: 'subheading',
          value: 'User-provided Data',
        },
        {
          type: 'details',
          value: {
            data: Object.entries(mainContact).map(([title, value]) => {
              const formatter =
                getPhoneNumberFormatter(value) ?? getPhoneNumberFormatter(`+${value}`);

              return {
                title,
                value: formatter?.formatInternational() ?? value,
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
