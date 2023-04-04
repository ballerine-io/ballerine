<script lang="ts">
  import {createZodForm, getWorkflowContext} from '@/utils';
  import {z} from "zod";
  import type {TOnPrev, TOnSubmit} from "@/types";
  import Form from "@/components/Form.svelte";
  import RemoteImage from "@/components/RemoteImage.svelte";

  const schema = z.object({});

  const workflowService = getWorkflowContext();
  const context = workflowService.getSnapshot?.()?.context;
  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;
  export let documentName: string;

  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit(data, ctx) {
      return onSubmit({
        [documentName]: workflowService.getSnapshot?.()?.context?.[documentName]
      }, ctx);
    },
  });

</script>

<RemoteImage id={context?.documentOne?.id} alt="document-review" />

<Form {zodForm} {onPrev} submitText="Submit">
  <legend>DocumentReview</legend>
</Form>
