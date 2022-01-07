<template>
    <div class="position-fixed bottom-0 end-0 mb-5">
        <a class="bi bi-arrow-repeat me-2" style="font-size: 2rem;" @click="$emit('has-clicked-refresh')"></a>
    </div>
</template>
<script>
export default {
  name: "Refresh"
}
</script>