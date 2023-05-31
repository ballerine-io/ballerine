<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

  type Text = {
    text: string;
    startTime: number;
    endTime: number | 'infinity';
  };

  export let texts: Text[];

  let text = '';

  const intervals: NodeJS.Timeout[] = [];

  for (const item of texts) {
    const start = setTimeout(() => {
      text = item.text;
    }, item.startTime);

    intervals.push(start);

    if (item.endTime !== 'infinity') {
      const end = setTimeout(() => {
        text = '';
      }, item.endTime);

      intervals.push(end);
    }
  }

  onDestroy(() => {
    for (const interval of intervals) {
      clearInterval(interval);
    }
  });
</script>

{#key text}
  <p in:fly={{ y: 16 }} out:fly={{ y: 16 }}>{text}</p>
{/key}

<style>
  p {
    font-size: 16px;
    line-height: 1;
    margin: 0;
  }
</style>
