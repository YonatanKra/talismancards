<template>
  <div class="editor">
    <TalismanCardEditor :name="name" :phone="phone"/>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const name = route.query.name || 'Guest';
  const phone = route.query.phone || 'N/A';
</script>
