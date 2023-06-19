<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';
  import { z } from 'zod';
  import { camelCaseToTitle, createZodForm, getWorkflowContext } from '@/utils';
  import Form from './Form.svelte';
  import type { TOnPrev, TOnSubmit } from '@/types';
  import { DocumentId } from '@/constants';

  export let documentId: string;
  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const workflowService = getWorkflowContext();

  const schema = z.object({
    [documentId]: z.object({
      type: z.union([
        z.literal('passport'),
        z.literal('idCard'),
        z.literal('driverLicense'),
        z.literal('selfie'),
        z.literal('incorporation'),
      ]),
      file: z.custom<File>(v => v instanceof File),
    }),
  });

  const zodForm = createZodForm(schema, {
    initialValues: {
      [documentId]: {
        type: initialValues[documentId]?.type,
      },
    },
    async onSubmit(data, ctx) {
      const uploadedFile = await workflowService.uploadFile(data[documentId]);

      return onSubmit(
        {
          [documentId]: uploadedFile,
        },
        ctx,
      );
    },
  });
  const isSubmitting = zodForm.isSubmitting;
  let fileInput: HTMLInputElement;
  let fileName: string;
  let title: string;
  const uploadFile = () => {
    fileInput.click();
  };
  const updateFileName = () => {
    fileName = fileInput?.files?.[0]?.name;
  };

  $: {
    title = camelCaseToTitle(documentId);
  }
</script>

{#if $isSubmitting}
  Loading...
{/if}

<Form {zodForm} {onPrev}>
  <fieldset class="mb-2 flex h-full flex-col">
    <legend>Upload {title}</legend>
    <p class="max-w-[50ch] p-1">
      {#if documentId === DocumentId.SELFIE}
        You can download <a
          download={`mock-${DocumentId.SELFIE}.png`}
          href={`/mock-${DocumentId.SELFIE}.png`}>this selfie file</a
        >
        and upload it here.
      {/if}
      {#if documentId === DocumentId.ID_CARD}
        Pssst... instead of uploading your own ID, you can download <a
          download={`mock-${DocumentId.ID_CARD}.png`}
          href={`/mock-${DocumentId.ID_CARD}.png`}>this file</a
        > and upload it here.
      {/if}
      {#if documentId === DocumentId.CERTIFICATE_OF_INCORPORATION}
        You can download <a
          download={`mock-${DocumentId.CERTIFICATE_OF_INCORPORATION}.pdf`}
          href={`mock-${DocumentId.CERTIFICATE_OF_INCORPORATION}.pdf`}
          >this certificate of incorporation file</a
        > and upload it here.
      {/if}
    </p>
    <label for="file" class="sr-only"> File </label>
    <input
      type="file"
      class="hidden"
      id="file"
      name={`${documentId}.file`}
      on:change={updateFileName}
      bind:this={fileInput}
    />
    <div class="flex h-full flex-col justify-between space-y-2">
      {#if fileName}
        <div class="mt-auto flex justify-between py-2">
          <div class="flex">
            <img src="/check.svg" class="mr-2" /> <span>{fileName}</span>
          </div>
          <span class="text-sm text-slate-400"> Chosen </span>
        </div>
      {:else}
        <img
          src={`/${documentId === DocumentId.SELFIE ? 'selfie' : 'upload-document'}.svg`}
          alt="Upload Document"
          class="mx-auto h-48 w-48"
        />
      {/if}
      <button type="button" on:click={uploadFile}>Choose Document</button>
    </div>
  </fieldset>
  <ValidationMessage for={`${documentId}.type`} let:messages={message}>
    <div style="color: red; font-weight: bold;">
      {message ? `Type ${message}: ${JSON.stringify(zodForm.data.type)}` : ''}
    </div>
  </ValidationMessage>
  <ValidationMessage for={`${documentId}.file`} let:messages={message}>
    <div style="color: red; font-weight: bold;">{message ? `File ${message}` : ''}</div>
  </ValidationMessage>
</Form>
