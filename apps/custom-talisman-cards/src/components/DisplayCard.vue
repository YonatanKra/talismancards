<template>
    <div class="card">
        <div>{{ card.fileName }}</div>
        <img height="500px" :src="`https://talismancards.s3.us-east-2.amazonaws.com/images/${card.fileName}`" /> 
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