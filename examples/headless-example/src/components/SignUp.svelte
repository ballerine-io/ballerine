<script lang="ts">
  import { z } from 'zod';
  import type { TOnSubmit } from '@/types';
  import { createZodForm } from '@/utils';
  import Form from './Form.svelte';

  const schema = z.object({
    fname: z.string(),
    lname: z.string(),
  });

  export let initialValues: z.infer<typeof schema> = {
    fname: 'John',
    lname: 'Doe',
  };

  export let onSubmit: TOnSubmit<typeof schema>;
  export let onPrev = undefined;

  const zodForm = createZodForm(schema, {
    initialValues,
    onSubmit,
  });
</script>

<Form {zodForm} submitText={'Sign Up'}>
  <legend>Welcome</legend>
  <fieldset class="space-y-3">
    <legend class="sr-only">Name</legend>
    <div>
      <label for="fname">First Name</label>
      <input type="text" id="fname" name="fname" />
    </div>
    <div>
      <label for="lname">Last Name</label>
      <input type="text" id="lname" name="lname" />
    </div>
  </fieldset>
</Form>
