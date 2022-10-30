<script lang="ts">
  import { getOverlayDocumentType } from './utils';
  import { DocumentType } from '../../contexts/app-state';
  import { configuration as globalConfiguration } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';
  import merge from 'lodash.merge';
  import { overlay } from '../../default-configuration/theme';

  export let type: DocumentType;

  const overlayType = getOverlayDocumentType(type);

  const style = makeStylesFromConfiguration(merge(overlay, $globalConfiguration.overlay));
</script>

<div class="overlay {overlayType}" />

<style>
  .overlay {
    z-index: 1;
    position: absolute;
    margin: 10px 0px 0px 0px;
    outline: 600px solid #000000b8;
    border-radius: 20px;
  }
  .overlay.card {
    width: 400px;
    height: 260px;

  }
  .overlay.passport {
    width: 400px;
    height: 400px;
  }
  .overlay.a4 {
    width: 400px;
    height: 600px;
  }
  .overlay.selfie {
    width: 400px;
    height: 400px;
    outline: 700px solid #000000b8;
    border-radius: 50%;
  }
</style>
