<template>
    <div class="card">
        <h2>איחולים מ:<br/>{{ card.fileName.split('_')[3].replace('.svg', '') }}</h2   >
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
        display: flex; flex-direction: row; height: 100vh;
        justify-content: center;
    }

    .card h2 {
        direction: rtl; text-align: center;
    }
</style>