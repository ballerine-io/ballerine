<script lang="ts">
  import { getOverlaySrc } from './utils';
  import { DocumentType } from '../../contexts/appState';
  import { configuration as globalConfiguration } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../utils/cssUtils';
  import merge from 'lodash.merge';
  import { overlay } from '../../defaultConfiguration/theme';

  export let type: DocumentType;

  const src = getOverlaySrc(type);

  const style = makeStylesFromConfiguration(merge(overlay, $globalConfiguration.overlay));
</script>

<div class="overlay" style:background-image="url({src})" {style} />

<style>
  .overlay {
    position: absolute;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  @media (min-height: 800px) {
    .overlay {
      background-size: cover;
    }
  }

  @media (max-height: 680px) {
    .overlay {
      background-position-y: var(--background-position-y);
    }
  }
</style>
