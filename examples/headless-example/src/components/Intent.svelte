<script lang="ts">
  export let disabled = false;
  export let refetch = () => {};
</script>

<div
  class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-6 rounded-[24px] border border-slate-200 shadow">
  <h1 class="font-bold text-center w-full text-2xl">
    Welcome
  </h1>
  <button class="mt-auto" {disabled} on:click={refetch}>
    Start KYC
  </button>
</div>
