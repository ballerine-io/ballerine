<script lang="ts">
  import {ValidationMessage} from "@felte/reporter-svelte";
  import {z} from "zod";
  import {createZodForm, getWorkflowContext} from "@/utils";
  import Form from "./Form.svelte";
  import type {TOnPrev, TOnSubmit} from "@/types";

  export let documentName: string;
  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const workflowService = getWorkflowContext();

  const schema = z.object({
    [documentName]: z.object({
      type: z.union([
        z.literal("passport"),
        z.literal("idCard"),
        z.literal("driverLicense"),
        z.literal("selfie"),
      ]),
      file: z.custom<File>((v) => v instanceof File),
    }),
  });

  const zodForm = createZodForm(schema, {
    initialValues: {
      [documentName]: {
        type: initialValues[documentName].type,
      },
    },
    async onSubmit(data, ctx) {
      const uploadedFile = await workflowService.uploadFile(data[documentName]);

      return onSubmit(
        {
          [documentName]: uploadedFile,
        },
        ctx
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
  }


  $: {
    title = (documentName.charAt(0).toUpperCase() + documentName.slice(1)).replace(/id/i, "ID");
  }
</script>

{#if $isSubmitting}
  Loading...
{/if}

<Form {zodForm} {onPrev}>
  <fieldset class="h-full flex flex-col mb-2">
    <legend>Upload {title}</legend>
<p class="max-w-[50ch] p-1">
  Pssst... instead of uploading your own documents, you can download <a download="fake-document"  href="/fake-document.jpg">this file</a> and upload it here.
</p>
    <label for="file" class="sr-only"> File </label>
    <input
      type="file"
      class="hidden"
      id="file"
      name={`${documentName}.file`}
      on:change={updateFileName}
      bind:this={fileInput}
    />
    <div  class="h-full justify-between flex flex-col space-y-2">
    {#if fileName}
      <div class="mt-auto flex justify-between py-2">
        <div class="flex">
        <img src="/check.svg" class="mr-2"/> <span>{fileName}</span>
        </div>
        <span class="text-sm text-slate-400">
          Chosen
        </span>
      </div>
      {:else}
      <img src={`/${documentName === 'selfie' ? 'selfie' : 'upload-document'}.svg`} alt="Upload Document" class="mx-auto w-48 h-48" />
    {/if}
    <button type="button" on:click={uploadFile}>Choose Document</button>
    </div>
  </fieldset>
  <ValidationMessage for={`${documentName}.file`} let:messages={message}>
    <div style="color: red; font-weight: bold;">{message || ""}</div>
  </ValidationMessage>
</Form>
