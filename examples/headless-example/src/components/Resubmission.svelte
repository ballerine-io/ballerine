<script lang="ts">
import Card from "@/components/Card.svelte";

export let reason: string;
export let handleResubmit = () => {};

</script>

<Card>
  <h1 class="font-bold text-center w-full text-2xl">
    Re-upload Document
  </h1>
  <p class="max-w-[50ch] p-1">
    Your document was rejected due
    to {reason}
    , please re-upload another image.
    You can upload <a download="/fake-document.jpg">this file</a>.
  </p>
  <img src="/re-upload-id.svg" alt="clock" class="mx-auto mb-2"/>
  <button class="mt-auto" on:click={handleResubmit}>Re-upload document file</button>
</Card>
