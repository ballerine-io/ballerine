<script lang="ts">
  import { getOverlayDocumentType } from './utils';
  import { DocumentType } from '../../contexts/app-state';

  export let type: DocumentType;

  const overlayType = getOverlayDocumentType(type);

</script>

<div class="overlay {overlayType}" />

<style>
  .overlay {
    z-index: 1;
    position: relative;
    margin: 10px 0px 0px 0px;
    max-width: 80%;
    max-height: 100%;
    -webkit-box-shadow: 0px 0px 0px 1000px rgba(0, 0, 0, 0.7);
    -moz-box-shadow: 0px 0px 0px 1000px rgba(0, 0, 0, 0.7);
    box-shadow: 0px 0px 0px 1000px rgba(0, 0, 0, 0.7);
    border: 3px solid #ffffff4d;
    width: 100%;
  }
  .overlay.card {
    border-radius: 12px;
    aspect-ratio: 4/3;
  }
  .overlay.passport {
    border-radius: 12px;
    aspect-ratio: 3/4;
  }
  .overlay.a4 {
    border-radius: 12px;
    aspect-ratio: 3/4;
  }
  .overlay.selfie {
    border-radius: 100%;
    aspect-ratio: 3/4;
  }
</style>
