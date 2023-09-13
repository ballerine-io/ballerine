import { generateTitleCell } from './title-cell-generator';

export const personalInformationCell = () => {
  return {
    elements: [
      {
        type: 'cell',
        elements: generateTitleCell({
          title: 'Individual Information',
          subtitle: 'User-provided data',
          context: 'personal_information',
        }),
        uiElements: {
          style: 'padding-left: 10px',
        },
      },
      {
        type: 'cell',
        layout: 'form',
        options: { columns: 3 },
        elements: [
          {
            title: 'Email',
            type: 'input',
            options: { editable: false },
            valueDestination: 'context.entity.data.email',
          },
          {
            title: 'First name',
            type: 'input',
            options: { editable: false },
            valueDestination: 'context.entity.data.firstName',
          },
          {
            title: 'Last name',
            type: 'input',
            options: { editable: false },
            valueDestination: 'context.entity.data.lastName',
          },
          {
            title: 'Date of birth',
            type: 'date',
            options: { editable: false },
            valueDestination: 'context.entity.data.dateOfBirth',
          },
          {
            title: 'Phone',
            type: 'input',
            options: { editable: false },
            valueDestination: 'context.entity.data.phone',
          },
          {
            title: 'State reason',
            type: 'input',
            options: { editable: false },
            valueDestination: 'context.entity.data.stateReason',
          },
          {
            title: 'Approval state',
            type: 'input',
            options: { editable: false },
            valueDestination: 'context.entity.data.approvalState',
          },
          {
            type: 'cell',
            options: {
              functionality: 'iterative-over-record',
            },
            elementType: {
              title: true,
              type: 'input',
              options: { editable: false },
            },
            valueDestination: 'context.entity.data.additionalInfo',
          },
        ],
      },
    ],
  };
};
