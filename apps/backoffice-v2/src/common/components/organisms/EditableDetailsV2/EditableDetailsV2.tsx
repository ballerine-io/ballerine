import { Button, TextWithNAFallback } from '@ballerine/ui';

import { FormField } from '../Form/Form.Field';
import { titleCase } from 'string-ts';
import { Form } from '../Form/Form';
import { FunctionComponent } from 'react';
import { FormItem } from '../Form/Form.Item';
import { FormLabel } from '../Form/Form.Label';
import { FormMessage } from '../Form/Form.Message';
import { useEditableDetailsV2Logic } from './hooks/useEditableDetailsV2Logic/useEditableDetailsV2Logic';
import { EditableDetailsV2Options } from './components/EditableDetailsV2Options';
import { EditableDetailV2 } from './components/EditableDetailV2/EditableDetailV2';
import { IEditableDetailsV2Props } from './types';

export const EditableDetailsV2: FunctionComponent<IEditableDetailsV2Props> = ({
  title,
  fields,
  onSubmit,
  onEnableIsEditable,
  onCancel,
  config,
}) => {
  if (config.blacklist && config.whitelist) {
    throw new Error('Cannot provide both blacklist and whitelist');
  }

  const { form, handleSubmit, handleCancel, filteredFields } = useEditableDetailsV2Logic({
    fields,
    onSubmit,
    onCancel,
    config,
  });

  return (
    <div className={'px-3.5'}>
      <div className={'my-4 flex justify-between'}>
        <h2 className={'text-xl font-bold'}>{title}</h2>
        <EditableDetailsV2Options
          actions={{
            options: {
              disabled: config.actions.options.disabled,
            },
            enableEditing: {
              disabled: config.actions.enableEditing.disabled,
            },
          }}
          onEnableIsEditable={onEnableIsEditable}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className={'grid grid-cols-3 gap-x-4 gap-y-6'}>
            <legend className={'sr-only'}>{title}</legend>
            {filteredFields.map(({ title, value, path, props }) => {
              return (
                <FormField
                  key={path}
                  control={form.control}
                  name={path}
                  render={({ field }) => (
                    <FormItem>
                      <TextWithNAFallback as={FormLabel} className={`block`}>
                        {titleCase(title ?? '')}
                      </TextWithNAFallback>
                      <EditableDetailV2
                        name={field.name}
                        type={props.type}
                        format={props.format}
                        minimum={props.minimum}
                        maximum={props.maximum}
                        pattern={props.pattern}
                        options={props.options}
                        isEditable={!config.actions.editing.disabled && props.isEditable}
                        value={value}
                        valueAlias={props.valueAlias}
                        formValue={field.value}
                        onInputChange={form.setValue}
                        onOptionChange={field.onChange}
                        parse={config.parse}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
          <div className={'min-h-12 mt-3 flex justify-end gap-x-3'}>
            {!config.actions.editing.disabled &&
              filteredFields?.some(({ props }) => props.isEditable) && (
                <Button
                  type="button"
                  className={`aria-disabled:pointer-events-none aria-disabled:opacity-50`}
                  aria-disabled={config.actions.cancel.disabled}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            {!config.actions.editing.disabled &&
              filteredFields?.some(({ props }) => props.isEditable) && (
                <Button
                  type="submit"
                  className={`aria-disabled:pointer-events-none aria-disabled:opacity-50`}
                  aria-disabled={config.actions.save.disabled}
                >
                  Save
                </Button>
              )}
          </div>
        </form>
      </Form>
    </div>
  );
};
