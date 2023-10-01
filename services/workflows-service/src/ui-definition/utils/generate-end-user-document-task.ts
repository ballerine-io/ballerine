import { documentPersonalInformationCell } from '@/ui-definition/utils/document-personal-information';

export const generateEndUserDocumentTask = () => {
  return {
    name: 'default-end-user-document-task',
    type: 'container',
    elements: [
      {
        type: 'cell',
        elements: [
          {
            type: 'document-title',
            value: `join('', [context.documents[{{index}}].category," - ",context.documents[{{index}}].type])`,
            context: 'context.documents[{{index}}].id',
            uiElements: {
              elementClass: ['h1'],
            },
          },
          {
            type: 'document-sub-title',
            value: "'Person Information'",
            context: 'context.documents[{{index}}].id',
            uiElements: {
              elementClass: ['h1'],
            },
          },
          {
            name: 'documentApproveButton',
            value: 'context.documents[{{index}}].id',
            text: 'Approve',
            type: 'button',
            uiElements: {
              elementClass: ['btn-green'],
            },
          },
          {
            name: 'documentRevisionWithPopupButton',
            value: 'context.documents[{{index}}].id',
            text: 'Re-upload needed',
            type: 'buttonWithPopup',
            options: {
              popupContent: {
                title: 'Mark document for re-upload',
                text: 'Once marked, you can use the “Ask for all re-uploads” button at the top of the screen to initiate a request for the customer to re-upload all of the documents you have marked for re-upload.',
                dropdownTitle: 'Reason',
                dropdownOptions: ['Wrong document', 'spam'],
                additionalInput: {
                  title: 'Comment',
                  type: 'text',
                  valueDestination: `context.documents[{{index}}].decision.revisionReason`,
                },
              },
            },
            uiElements: {
              elementClass: ['btn-orange'],
            },
          },
        ],
        uiElements: {
          style: 'padding-left: 10px',
        },
      },
    ],
    cells: {
      options: { layout: 'grid', columns: 2 },
      elements: [
        {
          type: 'cell',
          ...documentPersonalInformationCell(),
        },
        {
          type: 'cell',
          elements: [
            {
              type: 'document-content',
              valueDestination: `context.documents[{{index}}]`,
            },
          ],
        },
      ],
    },
  };
};
