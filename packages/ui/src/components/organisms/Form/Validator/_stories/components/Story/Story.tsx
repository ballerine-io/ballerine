import { useState } from 'react';
import { IValidationSchema, registerValidator, ValidatorProvider } from '../../../../Validator';
import { JSONEditorComponent } from '../../../../Validator/_stories/components/JsonEditor/JsonEditor';
import { ValidatorParams } from '../../../../Validator/_stories/components/ValidatorParams';
import { initialContext } from './context';
import { ErrorsList } from './ErrorsList';
import { initialSchema } from './schema';

const evenNumbersValidator = (value: number) => {
  // Ignoring validation if value is not a number
  if (isNaN(value)) return true;

  if (value % 2 !== 0) {
    throw new Error('Value is not even');
  }

  return true;
};

registerValidator('evenNumber', evenNumbersValidator);

export const Story = () => {
  const [context, setContext] = useState(initialContext);
  const [validatorParams, setValidatorParams] = useState<{
    validateOnChange?: boolean;
    validateSync?: boolean;
    abortEarly?: boolean;
    validationDelay?: number;
  }>({
    validateOnChange: true,
    validateSync: false,
    abortEarly: false,
    validationDelay: 500,
  });
  const [schema, setSchema] = useState<IValidationSchema[]>(initialSchema);
  const [tempSchema, setTempSchema] = useState<IValidationSchema[]>(initialSchema);

  return (
    <ValidatorProvider schema={schema} value={context} {...validatorParams}>
      <div className="flex min-h-screen flex-col gap-4">
        <ValidatorParams
          params={validatorParams}
          onChange={setValidatorParams}
          onSave={() => setSchema(tempSchema)}
        />
        <div className="flex flex-1 flex-row gap-4">
          <div className="flex flex-1 flex-col">
            <p className="mb-2">Context</p>
            <div className="flex-1">
              <JSONEditorComponent value={context} onChange={setContext} />
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex flex-row gap-2">
              <p>Validation Schema</p>
            </div>
            <div className="flex-1">
              <JSONEditorComponent value={tempSchema} onChange={setTempSchema} />
            </div>
          </div>
        </div>
        <div className="h-[240px] overflow-y-auto py-2">
          <ErrorsList />
        </div>
      </div>
    </ValidatorProvider>
  );
};
