<script lang="ts">
  export let id: string;
  export let type: string;
  export let value: string;
  export let name: string;
  export let label: string;
</script>

  <label for={id} class="w-full cursor-pointer py-2 px-4 bg-blue-500 focus-within:outline focus-within:outline-2 focus-within:outline-black rounded-md text-white font-bold flex items-center">
    {label}
    <input
      type="radio"
      {id}
      {name}
      {value}
      bind:group={type}
      class="sr-only"
    />
  </label>
