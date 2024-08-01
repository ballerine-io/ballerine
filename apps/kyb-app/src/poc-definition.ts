import { UIElementV2 } from '@/components/providers/Validator/types';

export const pocDefinition: UIElementV2[] = [
  {
    id: 'first-name',
    element: 'text',
    type: 'field',
    validation: {
      required: true,
      minLength: [2, 'Minimum length is 2.'],
    },
    params: {},
    valueDestination: 'firstName',
  },
  {
    id: 'last-name',
    element: 'text',
    type: 'field',
    validation: {
      required: true,
      minLength: [5, 'Minimum length is 5.'],
    },
    params: {},
    valueDestination: 'lastName',
  },
  {
    id: 'names-list',
    element: 'array',
    type: 'field-list',
    validation: {
      minLength: [1, 'Minimum "names-list" length is 1.'],
    },
    params: {},
    valueDestination: 'items',
    children: [
      {
        id: 'children-name',
        element: 'text',
        type: 'field',
        validation: {
          required: true,
          minLength: [2, 'Minimum length is 2.'],
        },
        params: {},
        valueDestination: 'items[$0].childrenName',
      },
      {
        id: 'children-last-name',
        element: 'text',
        type: 'field',
        validation: {
          required: true,
          minLength: [5, 'Minimum length is 5.'],
        },
        params: {},
        valueDestination: 'items[$0].childrenLastName',
      },
      {
        id: 'sub-list',
        element: 'array',
        type: 'field-list',
        validation: {
          minLength: [1, 'Minimum "sub-list" length is 1.'],
        },
        params: {},
        valueDestination: 'items[$0].subItems',
        children: [
          {
            id: 'first-name-sub',
            element: 'text',
            type: 'field',
            validation: {
              required: true,
              minLength: [2, 'Minimum length is 2.'],
            },
            params: {},
            valueDestination: 'items[$0].subItems[$1].firstName',
          },
          {
            id: 'last-name-sub',
            element: 'text',
            type: 'field',
            validation: {
              required: true,
              minLength: [5, 'Minimum length is 5.'],
            },
            params: {},
            valueDestination: 'items[$0].subItems[$1].lastName',
          },
          {
            id: 'subsub-list',
            element: 'array',
            type: 'field-list',
            validation: {
              minLength: [1, 'Minimum "subsub-list" length is 1.'],
            },
            params: {},
            valueDestination: 'items[$0].subItems[$1].subsubItems',
            children: [
              {
                id: 'first-name-sub',
                element: 'text',
                type: 'field',
                validation: {
                  required: true,
                  minLength: [2, 'Minimum length is 2.'],
                },
                params: {},
                valueDestination: 'items[$0].subItems[$1].subsubItems[$2].firstName',
              },
              {
                id: 'last-name-sub',
                element: 'text',
                type: 'field',
                validation: {
                  required: true,
                  minLength: [5, 'Minimum length is 5.'],
                },
                params: {},
                valueDestination: 'items[$0].subItems[$1].subsubItems[$2].lastName',
              },
            ],
          },
        ],
      },
    ],
  },
];

// const context = {
//   items: [
//     {
//       subItems: [{}, { subsubItems: [{}, {}] }],
//     },
//     {},
//   ],
// };

// const formatDestination = (destination: string, stack: number[]) => {
//   stack.forEach((value, index) => {
//     destination = destination.replace(`$${index}`, String(value));
//   });

//   return destination;
// };

// const iterate = (elements: UIElementV2[], context: object, stack: number[] = []) => {
//   for (let i = 0; i < elements.length; i++) {
//     const element = elements[i] as UIElementV2;

//     if (!element) continue;

//     if (element.type === 'field') {
//       console.log('valueDestination', formatDestination(element.valueDestination, stack));
//       continue;
//     }

//     if (element.type === 'field-list') {
//       // console.log('valueDestination', element.valueDestination);
//       const value = get(context, formatDestination(element.valueDestination, stack)) as any[];

//       value?.forEach((item, index) => {
//         iterate(element.children!, context, [...stack, index]);
//       });
//     }
//   }
// };

// iterate(pocDefinition, context);
