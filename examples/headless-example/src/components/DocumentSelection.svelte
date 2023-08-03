<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';
  import { z } from 'zod';
  import { createZodForm } from '@/utils';
  import Form from './Form.svelte';
  import type { TOnPrev, TOnSubmit } from '@/types';
  import DocumentType from '@/components/DocumentType.svelte';
  import { DocumentId } from '@/constants';

  const schema = z.object({
    [DocumentId.ID_CARD]: z.object({
      type: z.union([z.literal('passport'), z.literal('idCard'), z.literal('driverLicense')]),
    }),
  });

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const zodForm = createZodForm(schema, {
    initialValues: {
      [DocumentId.ID_CARD]: {
        type: initialValues[DocumentId.ID_CARD]?.type,
      },
    },
    onSubmit,
  });
  const data = zodForm.data;
</script>

<Form {zodForm} {onPrev}>
  <fieldset class="grid grid-cols-1 gap-2">
    <legend>Choose Document Type</legend>
    <DocumentType
      id="passport"
      label="Passport"
      name={`${DocumentId.ID_CARD}.type`}
      value="passport"
      type={$data[DocumentId.ID_CARD].type}
    />
    <DocumentType
      id="id-card"
      label="ID Card"
      name={`${DocumentId.ID_CARD}.type`}
      value="idCard"
      type={$data[DocumentId.ID_CARD].type}
    />
    <DocumentType
      id="driver-license"
      label="Driver License"
      name={`${DocumentId.ID_CARD}.type`}
      value="driverLicense"
      type={$data[DocumentId.ID_CARD].type}
    />
  </fieldset>
  <ValidationMessage for={`${DocumentId.ID_CARD}.type`} let:messages={message}>
    <div style="color: red; font-weight: bold;">{message ? `Type ${message}` : ''}</div>
  </ValidationMessage>
</Form>
