<script lang="ts">
  import {ValidationMessage} from '@felte/reporter-svelte';
  import {z} from 'zod';
  import {createZodForm} from '@/utils';
  import Form from './Form.svelte';
  import type {TOnPrev, TOnSubmit} from '@/types';

  const schema = z.object({
    documentOne: z.object({
      type: z.union([z.literal('passport'), z.literal('idCard'), z.literal('driverLicense')]),
    }),
  });

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const { createSubmitHandler, data, ...rest } = createZodForm(schema, {
    initialValues: {
      documentOne: {
        type: initialValues.documentOne.type,
      },
    },
  });
  const zodForm = {
    createSubmitHandler,
    data,
    ...rest,
  };

  const onChange = createSubmitHandler({
    onSubmit,
  });
  const onClick = event => {
    if (event.target.type !== 'radio' || event.target.value !== $data.documentOne?.type) return;

    return createSubmitHandler({
      onSubmit,
    })(event);
  };
</script>

<Form {zodForm} {onPrev}>
  <fieldset on:click={onClick} on:change={onChange}>
    <legend>DocumentSelection</legend>

    <label for="passport"> Passport </label>
    <input
      type="radio"
      id="passport"
      name="documentOne.type"
      value={'passport'}
      bind:group={$data.documentOne.type}
    />
    <label for="id-card"> ID Card </label>
    <input
      type="radio"
      id="id-card"
      name="documentOne.type"
      value={'idCard'}
      bind:group={$data.documentOne.type}
    />
    <label for="driver-license"> Driver License </label>
    <input
      type="radio"
      id="driver-license"
      name="documentOne.type"
      value={'driverLicense'}
      bind:group={$data.documentOne.type}
    />
    <label for="bad-value"> Bad Value </label>
    <input
      type="radio"
      id="bad-value"
      name="documentOne.type"
      value="badValue"
      bind:group={$data.documentOne.type}
    />
  </fieldset>
  <ValidationMessage for="document" let:messages={message}>
    <div style="color: red; font-weight: bold;">{message || ''}</div>
  </ValidationMessage>
</Form>
