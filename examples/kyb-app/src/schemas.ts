import { UISchema } from '@app/domains/collection-flow';

export const personalInformation: UISchema = {
  id: 'personal',
  uiSchema: {
    uiElements: [
      {
        name: 'firstName',
        type: 'text',
        required: true,
        validationSchema: {
          type: 'string',
        },
        valueDestination: 'context.personalInformation.firstName',
        inputParams: {
          placeholder: 'John',
          title: 'First Name',
        },
      },
      {
        name: 'lastName',
        type: 'text',
        required: true,
        validationSchema: {
          type: 'string',
        },
        valueDestination: 'context.personalInformation.lastName',
        inputParams: {
          placeholder: 'Doe',
          title: 'Last Name',
        },
      },
    ],
    actions: [],
  },
};

export const additionalPersonalInfo: UISchema = {
  id: 'additional',
  uiSchema: {
    uiElements: [
      {
        name: 'hobby',
        type: 'text',
        required: true,
        validationSchema: {
          type: 'string',
        },
        valueDestination: 'context.additionalPersonalInfo.hobby',
        inputParams: {
          placeholder: 'Puzzles',
          title: 'Hobby',
        },
      },
    ],
    actions: [],
  },
};

export const controls: UISchema = {
  id: 'controls',
  uiSchema: {
    uiElements: [
      {
        name: 'save',
        type: 'button',
        inputParams: {
          label: 'Save',
        },
      },
    ],
    actions: [
      {
        type: 'api',
        invokeOn: [
          {
            engine: 'event',
            value: { event: 'onClick', uiElementName: 'save' },
          },
        ],
        params: {
          url: 'http://localhost:3000/data_ta',
          method: 'post',
          type: 'json', // could be formData when Files present?
          map: {
            toBody: `{data: {hobby: context.additionalPersonalInfo.hobby, firstName: context.personalInformation.firstName, lastName: context.personalInformation.lastName}}`,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'bearer secret',
          },
        },
      },
    ],
  },
};
