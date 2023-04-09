<script lang="ts">
  import {ValidationMessage} from '@felte/reporter-svelte';
  import {z} from 'zod';
  import {createZodForm} from '@/utils';
  import Form from './Form.svelte';
  import type {TOnPrev, TOnSubmit} from '@/types';
  import DocumentType from "@/components/DocumentType.svelte";

  const schema = z.object({
    documentOne: z.object({
      type: z.union([z.literal('passport'), z.literal('idCard'), z.literal('driverLicense')]),
    }),
  });

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const zodForm = createZodForm(schema, {
    initialValues: {
      documentOne: {
        type: initialValues.documentOne.type,
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
      name="documentOne.type"
      value="passport"
      type={$data.documentOne.type}
    />
    <DocumentType
      id="id-card"
      label="ID Card"
      name="documentOne.type"
      value="idCard"
      type={$data.documentOne.type}
    />
    <DocumentType
      id="driver-license"
      label="Driver License"
      name="documentOne.type"
      value="driverLicense"
      type={$data.documentOne.type}
    />
  </fieldset>
  <ValidationMessage for="document" let:messages={message}>
    <div style="color: red; font-weight: bold;">{message || ''}</div>
  </ValidationMessage>
</Form>
