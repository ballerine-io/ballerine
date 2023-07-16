import { RJSFSchema, UiSchema } from '@rjsf/utils';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields } from '@app/common/components/organisms/DynamicForm/fields';
import { templates } from '@app/common/components/organisms/DynamicForm/templates';
import { FileStorage } from '@app/common/utils/file-storage';
import { FileStorageProvider } from '@app/common/providers/FileStorageProvider';

interface Props<TFormData> {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  className?: string;
  initialData?: object;
  fileStorage?: FileStorage;
  onSubmit: (formData: TFormData) => void;
}

export function DynamicForm<TFormData extends object>({
  schema,
  uiSchema,
  className,
  initialData,
  fileStorage,
  onSubmit,
}: Props<TFormData>) {
  return fileStorage ? (
    <FileStorageProvider storage={fileStorage}>
      <Form
        className={className}
        schema={schema}
        formData={initialData}
        uiSchema={uiSchema}
        onSubmit={data =>
          onSubmit(data.formData ? (data.formData as TFormData) : ({} as TFormData))
        }
        validator={validator}
        fields={fields}
        templates={templates}
        showErrorList={false}
      />
    </FileStorageProvider>
  ) : (
    <Form
      className={className}
      schema={schema}
      formData={initialData}
      uiSchema={uiSchema}
      onSubmit={data => onSubmit(data.formData ? (data.formData as TFormData) : ({} as TFormData))}
      validator={validator}
      fields={fields}
      templates={templates}
      showErrorList={false}
    />
  );
}
