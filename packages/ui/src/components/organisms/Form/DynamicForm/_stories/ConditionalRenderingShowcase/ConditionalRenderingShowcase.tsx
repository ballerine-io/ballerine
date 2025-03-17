import { AnyObject } from '@/common';
import { useState } from 'react';
import { JSONEditorComponent } from '../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { DynamicFormV2 } from '../../DynamicForm';
import { schema } from './schema';

export const ConditionalRenderingShowcaseComponent = () => {
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
          // onEvent={console.log}
        />
      </div>
      <div className="w-1/2">
        <JSONEditorComponent value={context} readOnly />
      </div>
    </div>
  );
};
