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

<Form {zodForm}>
  <legend>Let’s get to know you</legend>
  <p class="max-w-[50ch] p-1 text-center">
    Please prepare one of the following: Passport / ID / Drivers license
  </p>
</Form>
