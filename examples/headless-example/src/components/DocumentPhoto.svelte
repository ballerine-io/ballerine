<script lang="ts">
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { z } from "zod";
  import { createZodForm } from "../utils";
  import Form from "./Form.svelte";
  import type { TOnPrev, TOnSubmit } from "../types";
  import { getWorkflowContext } from "../utils";

  const schema = z.object({
    documentOne: z.object({
      type: z.union([
        z.literal("passport"),
        z.literal("idCard"),
        z.literal("driverLicense"),
      ]),
      file: z.custom<File>((v) => v instanceof File),
    }),
  });
  const workflowService = getWorkflowContext();

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const zodForm = createZodForm(schema, {
    initialValues: {
      documentOne: {
        type: initialValues.documentOne.type,
      },
    },
    async onSubmit(data, ctx) {
      const uploadedFile = await workflowService.uploadFile(data.documentOne);

      return onSubmit(
        {
          documentOne: uploadedFile,
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
    <input type="file" id="file" name="documentOne.file" />
  </fieldset>
  <ValidationMessage for="documentOne.file" let:messages={message}>
    <div style="color: red; font-weight: bold;">{message || ""}</div>
  </ValidationMessage>
</Form>
