<script lang="ts">
  export let disabled = false;
  export let refetch = () => {};
</script>

<div
  class="flex min-h-[30rem] w-full max-w-sm flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow"
>
  <h1 class="mb-6 w-full text-center text-2xl font-bold">Your Account</h1>
  <p class="max-w-[50ch] p-1 text-center">
    Before we can provide you with our service we’ll need to get to know you a bit.
  </p>
  <button class="mt-auto" {disabled} on:click={refetch}>
    Start {import.meta.env.VITE_EXAMPLE_TYPE.toUpperCase()} Flow
  </button>
</div>
