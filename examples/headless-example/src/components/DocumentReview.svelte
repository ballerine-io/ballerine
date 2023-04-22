<script lang="ts">
  import { createZodForm, getWorkflowContext } from '@/utils';
  import { z } from 'zod';
  import type { TOnPrev, TOnSubmit } from '@/types';
  import Form from '@/components/Form.svelte';
  import RemoteImage from '@/components/RemoteImage.svelte';

  const schema = z.object({});

  const workflowService = getWorkflowContext();
  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;
  export let documentName: string;

  // Defaults to 'Next'
  const submitText = 'Looks Good';
  let title;
  let id;

  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit(data, ctx) {
      return onSubmit(
        {
          [documentName]: workflowService.getSnapshot?.()?.context?.[documentName],
        },
        ctx,
      );
    },
  });
  const backText = 'Re-upload';

  $: {
    title = (documentName.charAt(0).toUpperCase() + documentName.slice(1)).replace(/id/i, 'ID');
    id = workflowService.getSnapshot?.()?.context?.[documentName]?.id;
  }
</script>

<Form {zodForm} {onPrev} {submitText} {backText}>
  <legend>Review {title}</legend>
  <p class="max-w-[50ch] p-1">Does the document below look okay?</p>
  <div class="max-h-64 overflow-auto">
    <RemoteImage {id} alt="document-review" />
  </div>
</Form>
