<script lang="ts">
  import {ctw} from "@/utils";

</script>

<div class={ctw(`w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-6 rounded-[24px] border border-slate-200 shadow`, $$props.class)}>
  <slot/>
</div>
