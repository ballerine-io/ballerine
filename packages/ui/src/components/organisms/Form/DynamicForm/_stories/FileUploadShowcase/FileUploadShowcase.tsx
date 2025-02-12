import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { IFormElement } from '../../types';

const schema: Array<IFormElement<any, any>> = [
  {
    id: 'FileField:Regular',
    element: 'filefield',
    valueDestination: 'file-regular',
    params: {
      label: 'Regular Upload',
      placeholder: 'Select File',
      uploadSettings: {
        url: 'http://localhost:3000/upload',
        resultPath: 'filename',
        method: 'POST',
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
      uploadSettings: {
        url: 'http://localhost:3000/upload-protected',
        resultPath: 'filename',
        method: 'POST',
        headers: {
          Authorization: '{token}',
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
      uploadSettings: {
        url: 'http://localhost:3000/upload',
        resultPath: 'filename',
        method: 'POST',
      },
      template: {
        id: 'document-1',
        pages: [],
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
      uploadSettings: {
        url: 'http://localhost:3000/upload',
        resultPath: 'filename',
        method: 'POST',
      },
      template: {
        id: 'document-2',
        pages: [],
      },
    },
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
