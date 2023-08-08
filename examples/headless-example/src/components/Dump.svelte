<script lang="ts">
  import type { Serializable } from '@ballerine/common';
  import { dump } from '@ballerine/common';

  export let value: Serializable;
</script>

<pre>
  <code>
    {dump(value)}
  </code>
</pre>
