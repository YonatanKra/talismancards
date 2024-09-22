<template>
    <div class="card">
        <div style="text-align: center;">{{ card.fileName.split('_')[3].replace('.svg', '') }}</div>
        <img height="100%" :src="`https://talismancards.s3.us-east-2.amazonaws.com/images/${card.fileName}`" /> 
    </div>
  </template>
  
<script setup lang="ts">
    const props = defineProps({
        card: {
            type: Object,
            default: {title: 'DemoCard', fileName: '#'},
        },
    });

    const svgContent = ref('');
</script>

<style>
    .card {
        display: flex; flex-direction: column; height: 100vh;
    }
</style>