<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchBlob, fetchJson } from '@/utils';
  import { z } from 'zod';

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
  const fetchFileInfoById = async (id: string) => {
    const data = await fetchJson(`http://localhost:3000/api/v1/external/storage/${id}`);

    return z
      .object({
        uri: z.string(),
        fileNameInBucket: z.string().nullable(),
      })
      .parse(data);
  };
  const fetchFileContentById = async (id: string) => {
    const data = await fetchBlob(`http://localhost:3000/api/v1/external/storage/content/${id}`);

    return z.instanceof(Blob).transform(blobToBase64).parseAsync(data);
  };

  onMount(async () => {
    if (!id) return;

    const fileInfo = await fetchFileInfoById(id);

    if (isFileSourcePublic(fileInfo)) {
      src = fileInfo.uri;

      return;
    }

    const base64 = await fetchFileContentById(id);

    src = base64?.replace(/application\/octet-stream/gi, fileType);
  });
</script>

{#if fileType === 'application/pdf'}
  <iframe class="rounded-lg" {src} {alt} />
{/if}
{#if fileType !== 'application/pdf'}
  <img class="rounded-lg" {src} {alt} />
{/if}
