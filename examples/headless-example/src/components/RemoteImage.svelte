<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchBlob } from '@/utils';

  export let id: string;
  export let alt: string;
  export let fileType: string;
  let src: string;

  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = error => {
        reject(error);
      };
    });
  };

  const isFileSourcePublic = fileInfo => {
    return fileInfo.uri.includes('https') && !fileInfo.fileNameInBucket;
  };

  onMount(async () => {
    if (!id) return;

    const response = await fetch(`http://localhost:3000/api/external/storage/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching fileInfo: ${response.statusText}`);
    }
    const fileInfo = await response.json();

    if (isFileSourcePublic(fileInfo)) {
      src = fileInfo.uri;
    } else {
      const streamedFile = await fetchBlob<Blob>(
        `http://localhost:3000/api/external/storage/content/${id}`,
      );

      const base64 = await blobToBase64(streamedFile);

      src = base64?.replace(/application\/octet-stream/gi, fileType);
    }
  });
</script>

{#if fileType === 'application/pdf'}
  <iframe class="rounded-lg" {src} {alt} />
{/if}
{#if fileType !== 'application/pdf'}
  <img class="rounded-lg" {src} {alt} />
{/if}
