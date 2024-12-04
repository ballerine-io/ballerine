import { Button, TextWithNAFallback } from '@ballerine/ui';

import { FormField } from '../Form/Form.Field';
import { titleCase } from 'string-ts';
import { Form } from '../Form/Form';
import { FunctionComponent } from 'react';
import { FormItem } from '../Form/Form.Item';
import { FormLabel } from '../Form/Form.Label';
import { FormMessage } from '../Form/Form.Message';
import { TEditableDetailsV2Props } from './types';
import { useNewEditableDetailsLogic } from './hooks/useEditableDetailsV2Logic/useEditableDetailsV2Logic';
import { EditableDetailsV2Options } from './components/EditableDetailsV2Options';
import { EditableDetailV2 } from './components/EditableDetailV2';

export const EditableDetailsV2: FunctionComponent<TEditableDetailsV2Props> = ({
  title,
  fields,
  onSubmit,
  onEnableIsEditable,
  onCancel,
  blacklist,
  whitelist,
  isEditable,
  isSaveDisabled,
  parse,
}) => {
  if (blacklist && whitelist) {
    throw new Error('Cannot provide both blacklist and whitelist');
  }

  const { form, handleSubmit, filteredFields } = useNewEditableDetailsLogic({
    fields,
    blacklist,
    whitelist,
    onSubmit,
  });

  return (
    <div className={'px-3.5'}>
      <div className={'my-4 flex justify-between'}>
        <h2 className={'text-xl font-bold'}>{title}</h2>
        <EditableDetailsV2Options onEnableIsEditable={onEnableIsEditable} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className={'grid grid-cols-3 gap-x-4 gap-y-6'}>
            <legend className={'sr-only'}>{title}</legend>
            {filteredFields.map(({ title, path, props }) => {
              const originalValue = form.watch(path);

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
                        type={props.type}
                        format={props.format}
                        minimum={props.minimum}
                        maximum={props.maximum}
                        pattern={props.pattern}
                        options={props.options}
                        isEditable={isEditable && props.isEditable}
                        originalValue={originalValue}
                        form={form}
                        field={field}
                        parse={parse}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
          <div className={'min-h-12 mt-3 flex justify-end gap-x-3'}>
            {isEditable && filteredFields?.some(({ props }) => props.isEditable) && (
              <Button type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {isEditable && filteredFields?.some(({ props }) => props.isEditable) && (
              <Button
                type="submit"
                className={`aria-disabled:pointer-events-none aria-disabled:opacity-50`}
                aria-disabled={isSaveDisabled}
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
