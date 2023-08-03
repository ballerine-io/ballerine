<script lang="ts">
  import Card from '@/components/Card.svelte';
  import { DocumentId } from '@/constants';

  export let reason: string;
  export let handleResubmit = () => {};
</script>

<Card>
  <h1 class="w-full text-center text-2xl font-bold">Re-upload ID</h1>
  <p class="max-w-[50ch] p-1">
    Your ID was rejected due to {reason}, please re-upload a clearer image. You can upload
    <a download={`mock-${DocumentId.ID_CARD}.png`} href={`/mock-${DocumentId.ID_CARD}.png`}
      >this file</a
    >.
  </p>
  <img src="/re-upload-id.svg" alt="clock" class="m-auto mb-2 h-48 w-48" />
  <button class="mt-auto" on:click={handleResubmit}>Re-upload ID File</button>
</Card>
