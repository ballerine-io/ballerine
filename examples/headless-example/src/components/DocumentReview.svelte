<script lang="ts">
  import {onMount} from 'svelte';
  import {createZodForm, fetchBlob, getWorkflowContext} from '@/utils';
  import {z} from "zod";
  import type {TOnPrev, TOnSubmit} from "@/types";
  import Form from "@/components/Form.svelte";

  const schema = z.any({});

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const workflowService = getWorkflowContext();
  const context = workflowService.getSnapshot?.()?.context;
  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit,
  });
  let image: string;

  onMount(async () => {
    const data = await fetchBlob(
      `http://localhost:3000/api/external/storage/${context?.documentOne?.id}`,
    );

    image = URL.createObjectURL(data);
  });
</script>

<img src={image} alt="document-one" />

<Form {zodForm} {onPrev} submitText="Submit">
    <legend>DocumentReview</legend>

</Form>
