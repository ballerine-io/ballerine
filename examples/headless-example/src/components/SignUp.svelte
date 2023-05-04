<script lang="ts">
  import { z } from 'zod';
  import type { TOnSubmit } from '@/types';
  import { createZodForm } from '@/utils';
  import Form from './Form.svelte';

  const schema = z.object({
    fname: z.string(),
    bname: z.string(),
    rnum: z.string(),
    lname: z.string(),
  });

  export let initialValues: z.infer<typeof schema> = {
    fname: 'John',
    lname: 'Doe',
    bname: 'BiziBank',
    rnum: '123456789',
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
    {#if import.meta.env.VITE_EXAMPLE_TYPE === 'kyc'}
      <legend class="sr-only">Name</legend>
      <div>
        <label for="fname">First Name</label>
        <input type="text" id="fname" name="fname" />
      </div>
      <div>
        <label for="lname">Last Name</label>
        <input type="text" id="lname" name="lname" />
      </div>
    {:else}
      <legend class="sr-only">Business</legend>
      <div>
        <label for="bname">Business Name</label>
        <input type="text" id="bname" name="bname" />
      </div>
      <div>
        <label for="rnum">Regestration Number</label>
        <input type="text" id="rnum" name="rnum" />
      </div>
    {/if}
  </fieldset>
</Form>
