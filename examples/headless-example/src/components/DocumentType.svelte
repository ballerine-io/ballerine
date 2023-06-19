<script lang="ts">
  export let id: string;
  export let type: string;
  export let value: string;
  export let name: string;
  export let label: string;
</script>

<label
  for={id}
  class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 font-bold focus-within:outline focus-within:outline-2 focus-within:outline-black"
>
  <span class="px-4 py-2">{label}</span>
  <input type="radio" {id} {name} {value} bind:group={type} class="!w-unset mr-2 cursor-pointer" />
</label>
