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

  onMount(async () => {
    if (!id) return;

    const data = await fetchBlob<Blob>(`http://localhost:3000/api/external/storage/${id}`);
    const base64 = await blobToBase64(data);

    src = base64?.replace(/application\/octet-stream/gi, fileType);
  });
</script>

{#if fileType === 'application/pdf'}
  <iframe class="rounded-lg" {src} {alt} />
{/if}
{#if fileType !== 'application/pdf'}
  <img class="rounded-lg" {src} {alt} />
{/if}
