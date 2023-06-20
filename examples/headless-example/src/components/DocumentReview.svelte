<script lang="ts">
  import { camelCaseToTitle, createZodForm, getSnapshotContext, getWorkflowContext } from '@/utils';
  import { z } from 'zod';
  import type { TOnPrev, TOnSubmit } from '@/types';
  import Form from '@/components/Form.svelte';
  import RemoteImage from '@/components/RemoteImage.svelte';

  const schema = z.object({});

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;
  export let documentId: string;

  // Defaults to 'Next'
  const submitText = 'Looks Good';
  let title;
  let id;
  let fileType;

  const workflowService = getWorkflowContext();
  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit(data, ctx) {
      const context = getSnapshotContext(workflowService);
      const document = context?.form?.[documentId];

      return onSubmit(
        {
          [documentId]: document,
        },
        ctx,
      );
    },
  });
  const backText = 'Re-upload';

  $: {
    const context = getSnapshotContext(workflowService);
    const document = context?.form?.[documentId];

    title = camelCaseToTitle(documentId);
    id = document?.id;
    fileType = document?.fileType;
  }
</script>

<Form {zodForm} {onPrev} {submitText} {backText}>
  <legend>Review {title}</legend>
  <p class="max-w-[50ch] p-1">Does the document below look okay?</p>
  <div class="max-h-64 overflow-auto">
    <RemoteImage {fileType} {id} alt="document-review" />
  </div>
</Form>
