<template>
  <div class="editor">
    <TalismanCardEditor v-if="initDone" :name="name" :phone="phone" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const initDone = ref(false);
const route = useRoute();
const name = route.query.name || 'Guest';
const phone = route.query.phone || 'N/A';

onMounted(() => {
  initDone.value = true;
});
</script>
