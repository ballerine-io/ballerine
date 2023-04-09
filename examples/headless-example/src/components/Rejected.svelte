<script>
import Card from "@/components/Card.svelte";
</script>

<Card class="min-h-[18rem]">
  <h1 class="font-bold text-center w-full text-2xl">
    Failed to verify
  </h1>
  <div class="grid place-content-center h-full max-h-28 mb-2">
    <img src="/rejected.svg" alt="rejected" class="w-14 h-14"/>
  </div>
  <p class="max-w-[50ch] p-1 text-center">
    Please contact support
  </p>
</Card>
