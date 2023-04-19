<script lang="ts">
  export let id: string;
  export let type: string;
  export let value: string;
  export let name: string;
  export let label: string;
</script>

<label for={id}
       class="w-full border border-slate-200 cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-black rounded-lg font-bold flex items-center justify-between">
  <span class="py-2 px-4">{label}</span>
  <input
    type="radio"
    {id}
    {name}
    {value}
    bind:group={type}
    class="!w-unset mr-2 cursor-pointer"
  />
</label>
