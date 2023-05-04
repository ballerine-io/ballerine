<script lang="ts">
  import { dump } from '@/utils';
  import type { Serializable } from '@/types';

  export let value: Serializable;
</script>

<pre>
  <code>
    {dump(value)}
  </code>
</pre>
