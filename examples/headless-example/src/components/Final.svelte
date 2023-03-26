<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchBlob } from '../utils';
  import { getWorkflowContext } from '../utils';

  export let initialValues = undefined;
  export let onSubmit = undefined;
  export let onPrev = undefined;

  const workflowService = getWorkflowContext();
  const context = workflowService.getSnapshot?.()?.context;
  let image: string;

  onMount(async () => {
    const data = await fetchBlob(
      `http://localhost:3000/api/external/storage/${context?.documentOne?.id}`,
    );

    image = URL.createObjectURL(data);
  });
</script>

Final

<img src={image} alt="document-one" />
