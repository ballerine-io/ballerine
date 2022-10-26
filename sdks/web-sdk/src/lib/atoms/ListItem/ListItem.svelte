<script lang="ts">
  import { ICSSProperties, IElementProps } from '../../contexts/configuration';
  import { makesLocalStyles } from '../../utils/cssUtils';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;

  const style = makesLocalStyles(styleProps);
</script>

<li {style}>
  <slot />
</li>

<style>
  li {
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    margin: var(--margin);
    text-align: var(--text-align);
    color: var(--color);
    z-index: 2;
  }
</style>
