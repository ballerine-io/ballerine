import { generateTitleCell } from './title-cell-generator';
import { personalInformationCell } from './document-personal-information';

export const documentCell = (index: number, documentId: string, category: string, type: string) => {
  return {
    type: 'task',
    elements: [
      {
        type: 'cell',
        elements: generateTitleCell({
          title: `${category} - ${type}`,
          context: documentId,
        }).concat({
          name: 'documentApproveButton',
          value: documentId,
          text: 'Approve',
          type: 'button',
        }),
        uiElements: {
          style: 'padding-left: 10px',
        },
      },
    ],
    cells: [
      {
        type: 'cell',
        ...personalInformationCell(index),
      },
      {
        type: 'cell',
        elements: [
          {
            type: 'document-content',
            valueDestination: `context.documents[${index}]`,
          },
        ],
      },
    ],
  };
};
