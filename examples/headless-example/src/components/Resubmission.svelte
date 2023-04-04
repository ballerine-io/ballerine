<script lang="ts">
  import {createZodForm} from '@/utils';
  import {z} from 'zod';
  import type {TOnPrev, TOnSubmit} from '@/types';
  import Form from './Form.svelte';

  const schema = z.object({});

  export let initialValues: z.infer<typeof schema>;
  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev: TOnPrev<typeof schema>;

  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit,
  });
</script>

<Form {zodForm}>Resubmission</Form>
