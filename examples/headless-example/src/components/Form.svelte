<script lang="ts">
  import type { ZodSchema } from 'zod';
  import type { TOnPrev } from '@/types';
  import type { createZodForm } from '@/utils';

  export let onPrev: TOnPrev<ZodSchema> | undefined = undefined;
  export let zodForm: ReturnType<typeof createZodForm>;
  export let submitText = 'Next';
  export let backText = 'Back';

  $: displayBackButton = onPrev !== undefined;

  const form = zodForm.form;
  const data = zodForm.data;
</script>

<form
  use:form
  class="flex min-h-[30rem] w-full max-w-sm flex-col rounded-lg border border-slate-200 bg-white p-6 shadow"
>
  <slot />
  <div
    class="mt-auto flex"
    class:justify-between={displayBackButton}
    class:space-x-2={displayBackButton}
  >
    {#if displayBackButton}
      <button type="button" on:click={onPrev?.($data)}>{backText}</button>
    {/if}
    <button type="submit">{submitText}</button>
  </div>
</form>
