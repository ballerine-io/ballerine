<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch('click');
  }
</script>

<button
  class="bg-white text-gray-700 drop-shadow-sm transition-colors hover:bg-slate-100"
  on:click={handleClick}
>
  <div class="flex flex-row items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="svg-icon"
      style="width:1.0009765625em;height:1em;vertical-align:middle;fill:currentColor;overflow:hidden"
      viewBox="0 0 1025 1024"
    >
      <path
        d="M293 755.2a51 51 0 0 1-34-12.9L0 512l273.5-243.1a51.2 51.2 0 0 1 68 76.5L154 512l173 153.7a51.2 51.2 0 0 1-34 89.5zm458-.1L1024.6 512l-259-230.3a51.1 51.1 0 1 0-68 76.5L870.3 512 683.1 678.5a51.2 51.2 0 0 0 68 76.6zm-239.5 72.5L614 213.2a51.2 51.2 0 1 0-101-16.8L410.7 810.8a51.2 51.2 0 0 0 42 59 52.6 52.6 0 0 0 8.5.6 51.2 51.2 0 0 0 50.4-42.8z"
      />
    </svg>
    <div class="pl-2">View Workflow</div>
  </div>
</button>
