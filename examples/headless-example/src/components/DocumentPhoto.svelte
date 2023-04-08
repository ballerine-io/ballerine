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
</script>

{#if $isSubmitting}
  Loading...
{/if}

<Form {zodForm} {onPrev}>
  <fieldset>
    <legend>DocumentPhoto</legend>

    <label for="file"> File </label>
    <input type="file" id="file" name={`${documentName}.file`} />
  </fieldset>
  <ValidationMessage for={`${documentName}.file`} let:messages={message}>
    <div style="color: red; font-weight: bold;">{message || ""}</div>
  </ValidationMessage>
</Form>
