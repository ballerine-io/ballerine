<script lang="ts">
  import { z } from 'zod';
  import { createZodForm } from '@/utils';
  import Form from './Form.svelte';
  import type { TOnSubmit } from '@/types';

  const schema = z.object({});

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev = undefined;

  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit,
  });
</script>

<Form {zodForm}>Success</Form>
