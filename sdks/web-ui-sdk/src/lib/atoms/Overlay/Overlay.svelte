<script lang="ts">
  import { getOverlayDocumentType } from './utils';
  import { TDocumentType } from '../../contexts/app-state/types';

  export let type: TDocumentType;

  const overlayType = getOverlayDocumentType(type);
</script>

<div class="overlay-container">
  <div class="overlay {overlayType}" />
</div>

<style>
  .overlay-container {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .overlay {
    z-index: 1;
    position: relative;
    margin: 10px 0px 0px 0px;
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
    width: 90%;
    max-height: 80%;
  }
  .overlay.a4 {
    border-radius: 12px;
    aspect-ratio: 3/4;
    max-width: 80%;
  }
  .overlay.selfie {
    border-radius: 100%;
    aspect-ratio: 3/4;
    max-height: 80%;
    width: 80%;
  }
</style>
