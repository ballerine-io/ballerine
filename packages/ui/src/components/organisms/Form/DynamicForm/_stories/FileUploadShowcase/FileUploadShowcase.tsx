import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { TUIElement } from '@ballerine/common';

const schema: Array<TUIElement> = [
  {
    id: 'FileField:Regular',
    element: 'filefield',
    valueDestination: 'file-regular',
    params: {
      label: 'Regular Upload',
      placeholder: 'Select File',
      httpParams: {
        createDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
        deleteDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
      },
    },
  },
  {
    id: 'FileField:Protected',
    element: 'filefield',
    valueDestination: 'file-protected',
    params: {
      label: 'Upload to protected endpoint',
      placeholder: 'Select File',
      httpParams: {
        createDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
        deleteDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
      },
    },
  },
  {
    id: 'FileField:SubmitUpload',
    element: 'documentfield',
    valueDestination: 'documents',
    params: {
      label: 'Upload on Submit',
      placeholder: 'Select File',
      uploadOn: 'submit',
      documentType: 'passport',
      documentVariant: 'passport',
      template: {
        type: 'passport',
        category: 'passport',
        properties: {},
        issuer: { country: 'il' },
        issuingVersion: 1,
        version: 1,
      },
    },
  },
  {
    id: 'FileField:SubmitUpload-2',
    element: 'documentfield',
    valueDestination: 'documents',
    params: {
      label: 'Upload on Submit-2',
      placeholder: 'Select File',
      uploadOn: 'submit',
      documentType: 'passport',
      documentVariant: 'passport',
      template: {
        type: 'passport',
        category: 'passport',
        properties: {},
        issuer: { country: 'il' },
        issuingVersion: 1,
        version: 1,
      },
    },
  },
  {
    id: 'SubmitButton',
    element: 'submitbutton',
    valueDestination: 'submitbutton',
    params: {
      text: 'Submit Button',
    },
  },
];

export const FileUploadShowcaseComponent = () => {
  const [context, setContext] = useState<AnyObject>({});

  return (
    <div className="flex h-screen w-full flex-row flex-nowrap gap-4">
      <div className="w-1/2">
        <DynamicFormV2
          elements={schema}
          values={context}
          onSubmit={() => {
            console.log('onSubmit');
          }}
          onChange={setContext}
          metadata={{
            token: '1234',
          }}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};
