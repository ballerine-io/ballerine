<script lang="ts">
  import type {ZodSchema} from 'zod';
  import type {TOnPrev} from '@/types';
  import type {createZodForm} from '@/utils';

  export let onPrev: TOnPrev<ZodSchema> | undefined = undefined;
  export let zodForm: ReturnType<typeof createZodForm>;
  export let submitText = 'Next';

  $: displayBackButton = onPrev !== undefined;

  const { form, data } = zodForm;
</script>

<form use:form class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-4 rounded-md border border-slate-200 shadow">
  {#if displayBackButton}
    <button type="button" on:click={onPrev?.($data)}>Prev</button>
  {/if}
  <slot />
  <div class="mt-auto">
    <button  type="submit">{submitText}</button>
  </div>
</form>
