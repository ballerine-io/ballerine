import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { IFormElement } from '../../types';

const initialContext = {
  firstName: 'John',
  lastName: 'Doe',
};

const defaultSchema: Array<IFormElement<any, any>> = [
  {
    id: 'directors',
    element: 'entityfieldgroup',
    valueDestination: 'users',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
      type: 'director',
    },
    children: [
      {
        id: 'user-name',
        element: 'textfield',
        valueDestination: 'users[$0].firstName',
        params: {
          label: 'Text Field',
          placeholder: 'Enter text',
          description: 'Enter text for this list item',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Name is required',
          },
        ],
      },
      {
        id: 'user-lastname',
        element: 'textfield',
        valueDestination: 'users[$0].lastName',
        params: {
          label: 'Last Name',
          placeholder: 'Enter last name',
          description: 'Enter your last name',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Last name is required',
          },
        ],
      },
      {
        id: 'document',
        element: 'documentfield',
        valueDestination: 'users[$0].documents',
        params: {
          label: 'Document',
          template: {
            id: 'document',
          },
        },
        validate: [
          {
            type: 'document',
            value: {
              id: 'document',
            },
            message: 'Document is required',
            considerRequired: true,
          },
        ],
      },
    ],
  },
  {
    id: 'SubmitButton',
    element: 'submitbutton',
    valueDestination: 'submitbutton',
    params: {
      label: 'Submit Button',
    },
  },
];

export const EntityFieldGroup = () => {
  const [context, setContext] = useState<AnyObject>(initialContext);

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={defaultSchema}
          values={context}
          onSubmit={() => {
            console.log('onSubmit');
          }}
          onChange={setContext}
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};

export default {
  component: EntityFieldGroup,
};

export const Default = {
  render: () => <EntityFieldGroup />,
};

const ubosSchema: Array<IFormElement<any, any>> = [
  {
    id: 'ubos',
    element: 'entityfieldgroup',
    valueDestination: 'entity.data.additionalInfo.ubos',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
      type: 'ubo',
      httpParams: {
        createEntity: {
          httpParams: {
            url: '{apiUrl}collection-flow/entity',
            method: 'POST',
            headers: {
              Authorization: 'Bearer {token}',
            },
            resultPath: 'entityId',
          },
          transform: `{
            "firstName": entity.firstName,
            "lastName": entity.lastName,
            "email": entity.email,
            "phone": entity.phone,
            "country": entity.country,
            "dateOfBirth": entity.dateOfBirth,
            "nationality": entity.nationality,
            "passportNumber": entity.passportNumber,
            "address": entity.street & ", " & entity.city & ", " & entity.country,
            "nationalId": entity.nationalId,
            "isAuthorizedSignatory": entity.isAuthorizedSignatory,
            "city": entity.city,
            "additionalInfo": {
              "fullAddress": entity.street & ", " & entity.city & ", " & entity.country,
              "companyName": context.entity.data.companyName,
              "customerCompany": context.collectionFlow.additionalInformation.customerCompany,
              "placeOfBirth": entity.placeOfBirth,
              "percentageOfOwnership": entity.ownershipPercentage,
              "role": entity.role
            }
          }`,
        },
        deleteEntity: {
          url: '{apiUrl}collection-flow/entity/{entityId}',
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer {token}',
          },
        },
        updateEntity: {
          httpParams: {
            url: '{apiUrl}collection-flow/entity/{entityId}',
            method: 'PUT',
            headers: {
              Authorization: 'Bearer {token}',
            },
          },
          transform: `{
            "firstName": entity.firstName,
            "lastName": entity.lastName,
            "email": entity.email,
            "phone": entity.phone,
            "country": entity.country,
            "dateOfBirth": entity.dateOfBirth,
            "nationality": entity.nationality,
            "passportNumber": entity.passportNumber,
            "address": entity.street & ", " & entity.city & ", " & entity.country,
            "nationalId": entity.nationalId,
            "isAuthorizedSignatory": entity.isAuthorizedSignatory,
            "city": entity.city,
            "additionalInfo": {
              "fullAddress": entity.street & ", " & entity.city & ", " & entity.country,
              "companyName": context.entity.data.companyName,
              "customerCompany": context.collectionFlow.additionalInformation.customerCompany,
              "placeOfBirth": entity.placeOfBirth,
              "percentageOfOwnership": entity.ownershipPercentage,
              "role": entity.role
            }
          }`,
        },
        uploadDocument: {
          url: '{apiUrl}collection-flow/files',
          method: 'POST',
          headers: {
            Authorization: 'Bearer {token}',
          },
          resultPath: 'id',
        },
        deleteDocument: {
          url: '{apiUrl}collection-flow/files',
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer {token}',
          },
        },
      },
    },
    children: [
      {
        id: 'user-name',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].firstName',
        params: {
          label: 'Text Field',
          placeholder: 'Enter text',
          description: 'Enter text for this list item',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Name is required',
          },
        ],
      },
      {
        id: 'user-lastname',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].lastName',
        params: {
          label: 'Last Name',
          placeholder: 'Enter last name',
          description: 'Enter your last name',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Last name is required',
          },
        ],
      },
      {
        id: 'user-email',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].email',
        params: {
          label: 'Email',
          placeholder: 'Enter email',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Email is required',
          },
          {
            type: 'format',
            value: {
              format: 'email',
            },
            message: 'Invalid email',
          },
        ],
      },
      {
        id: 'percentage-of-ownership',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].percentageOfOwnership',
        params: {
          label: 'Percentage of Ownership',
          placeholder: 'Enter percentage of ownership',
          valueType: 'number',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Percentage of ownership is required',
          },
          {
            type: 'minimum',
            value: {
              minimum: 0,
            },
            message: 'Percentage of ownership must be greater than 0',
          },
          {
            type: 'maximum',
            value: {
              maximum: 100,
            },
            message: 'Percentage of ownership must be less than 100',
          },
        ],
      },
      {
        id: 'role',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].role',
        params: {
          label: 'Role',
          placeholder: 'Enter role',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Role is required',
          },
        ],
      },
      {
        id: 'phone-number',
        element: 'phonefield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].phone',
        params: {
          label: 'Phone Number',
          placeholder: 'Enter phone number',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Phone number is required',
          },
        ],
      },
      {
        id: 'passport-number',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].passportNumber',
        params: {
          label: 'Passport Number',
          placeholder: 'Enter passport number',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Passport number is required',
          },
        ],
      },
      {
        id: 'date-of-birth',
        element: 'datefield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].dateOfBirth',
        params: {
          label: 'Date of Birth',
          placeholder: 'Enter date of birth',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Date of birth is required',
          },
        ],
      },
      {
        id: 'place-of-birth',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].placeOfBirth',
        params: {
          label: 'Place of Birth',
          placeholder: 'Enter place of birth',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Place of birth is required',
          },
        ],
      },
      {
        id: 'country',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].country',
        params: {
          label: 'Country',
          placeholder: 'Enter country',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Country is required',
          },
        ],
      },
      {
        id: 'street',
        element: 'textfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].street',
        params: {
          label: 'Street',
          placeholder: 'Enter street',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Street is required',
          },
        ],
      },
      {
        id: 'document',
        element: 'documentfield',
        valueDestination: 'entity.data.additionalInfo.ubos[$0].documents',
        params: {
          label: 'Document',
          template: {
            id: 'document',
            category: 'proof_of_address',
            type: 'general_document',
            issuingVersion: 1,
            version: 1,
            issuer: {
              country: 'ZZ',
            },
            properties: {},
          },
          documentType: 'document',
          documentVariant: 'front',
          httpParams: {
            deleteDocument: {
              url: '{apiUrl}collection-flow/files',
              method: 'DELETE',
              headers: {
                Authorization: 'Bearer {token}',
              },
            },
          },
        },
      },
    ],
    validate: [
      {
        type: 'required',
        value: {},
        message: 'At least one UBO is required',
      },
    ],
  },
  {
    id: 'SubmitButton',
    element: 'submitbutton',
    valueDestination: 'submitbutton',
    params: {
      label: 'Submit Button',
    },
    disable: [],
  },
];

const initialUbosContext = {
  entity: {
    data: {
      companyName: 'Company Name',
    },
  },
  collectionFlow: {
    additionalInformation: {
      customerCompany: 'Customer Company',
    },
  },
};

const metadata = {
  apiUrl: 'http://localhost:3000/api/v1/',
  token: 'e3a69aa3-c1ad-42f3-87ac-5105cff81a94',
};

export const UbosFieldGroup = () => {
  const [context, setContext] = useState<AnyObject>(initialUbosContext);

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={ubosSchema}
          values={context}
          onSubmit={() => {
            console.log('onSubmit');
          }}
          onChange={setContext}
          metadata={metadata}
          validationParams={{
            validateOnChange: true,
            validateOnBlur: true,
            abortEarly: false,
            abortAfterFirstError: true,
            validationDelay: 300,
          }}
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};

export const Ubos = {
  render: () => <UbosFieldGroup />,
};

const directorsSchema: Array<IFormElement<any, any>> = [
  {
    id: 'directors',
    element: 'entityfieldgroup',
    valueDestination: 'users',
    params: {
      label: 'Field List',
      description: 'A list of repeatable form fields that can be added or removed',
      defaultValue: `{
        "firstName": firstName,
        "lastName": lastName
      }`,
      type: 'director',
    },
    children: [
      {
        id: 'user-name',
        element: 'textfield',
        valueDestination: 'users[$0].firstName',
        params: {
          label: 'Text Field',
          placeholder: 'Enter text',
          description: 'Enter text for this list item',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Name is required',
          },
        ],
      },
      {
        id: 'user-lastname',
        element: 'textfield',
        valueDestination: 'users[$0].lastName',
        params: {
          label: 'Last Name',
          placeholder: 'Enter last name',
          description: 'Enter your last name',
        },
        validate: [
          {
            type: 'required',
            value: {},
            message: 'Last name is required',
          },
        ],
      },
      {
        id: 'document',
        element: 'documentfield',
        valueDestination: 'users[$0].documents',
        params: {
          label: 'Document',
          template: {
            id: 'document',
          },
        },
        validate: [
          {
            type: 'document',
            value: {
              id: 'document',
            },
            message: 'Document is required',
            considerRequired: true,
          },
        ],
      },
    ],
  },
  {
    id: 'SubmitButton',
    element: 'submitbutton',
    valueDestination: 'submitbutton',
    params: {
      label: 'Submit Button',
    },
  },
];

export const DirectorsFieldGroup = () => {
  const [context, setContext] = useState<AnyObject>(initialContext);

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={directorsSchema}
          values={context}
          onSubmit={() => {
            console.log('onSubmit');
          }}
          onChange={setContext}
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};

export const Directors = {
  render: () => <DirectorsFieldGroup />,
};
