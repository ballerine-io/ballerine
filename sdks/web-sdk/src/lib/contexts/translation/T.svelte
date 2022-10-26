<script lang="ts">
  import { t } from './hooks';
  import { currentLanguage } from './hooks';

  export let module: string;
  export let key: string;

  let text: string;

  currentLanguage.subscribe(() => {
    text = t(module, key);
  });
</script>

{text}
