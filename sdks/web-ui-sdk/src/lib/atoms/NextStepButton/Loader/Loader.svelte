<script lang="ts">
  import merge from 'deepmerge';
  import { configuration } from '../../../contexts/configuration';
  import { ICSSProperties, makesLocalStyles } from '../../../services/css-manager';

  const loader = {
    background: $configuration.general?.colors.primary,
  };

  const styleProps = merge(loader, $configuration.loader ?? {}) as ICSSProperties;

  const style = makesLocalStyles(styleProps);
</script>

<div {style} class="loader small" />

<style>
  .loader {
    border-radius: 50%;
    animation: loader-rotate 1s linear infinite;
  }

  .small {
    width: 41px;
    height: 41px;
    border: 4px solid #fff;
    border-right-color: transparent;
  }

  @keyframes loader-rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
