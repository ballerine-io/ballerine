<script lang="ts">
  import { t } from './hooks';
  import { currentLanguage } from './hooks';

  export let namespace: string;
  export let key: string;
  let text: string;

  currentLanguage.subscribe(() => {
    text = t(namespace, key);
  });
</script>

{text}
