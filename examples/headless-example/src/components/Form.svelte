<script lang="ts">
  import type { ZodSchema } from 'zod';
  import type { TOnPrev } from '../types';
  import type { createZodForm } from '../utils';

  export let onPrev: TOnPrev<ZodSchema> | undefined = undefined;
  export let zodForm: ReturnType<typeof createZodForm>;
  export let submitText = 'Next';

  $: displayBackButton = onPrev !== undefined;

  const { form, data } = zodForm;
</script>

<form use:form>
  {#if displayBackButton}
    <button type="button" on:click={onPrev?.($data)}>Prev</button>
  {/if}
  <slot />
  <button type="submit">{submitText}</button>
</form>
