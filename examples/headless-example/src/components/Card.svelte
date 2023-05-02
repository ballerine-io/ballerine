<script lang="ts">
  import { ctw } from '@/utils';
</script>

<div
  class={ctw(
    `flex min-h-[30rem] w-full max-w-sm flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow`,
    $$props.class,
  )}
>
  <slot />
</div>
