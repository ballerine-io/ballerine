export const documentPersonalInformationCell = () => {
  return {
    elements: [
      {
        type: 'cell',
        options: { layout: 'grid', columns: 2 },
        elements: [
          {
            type: 'cell',
            elements: [
              {
                title: 'Category',
                type: 'dropdown',
                options: { editable: false },
                valueDestination: `context.documents[{{index}}].category`,
              },
              {
                title: 'Type',
                type: 'dropdown',
                options: { editable: false },
                valueDestination: `context.documents[{{index}}].type`,
              },
            ],
          },
          {
            type: 'cell',
            options: {
              functionality: 'iterative-over-record',
              elementType: {
                title: true,
                type: 'input',
                options: { editable: false },
              },
            },
            valueDestination: `context.documents[{{index}}].properties`,
          },
          {
            type: 'input-decision',
            options: { editable: false },
            valueDestination: `context.documents[{{index}}].decision.status`,
          },
        ],
      },
    ],
  };
};
