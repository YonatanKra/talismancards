<template>
    <div>{{ card }}</div>
    <img :src="`https://talismancards.s3.us-east-2.amazonaws.com/images/${card}`" /> 
  </template>
  
<script setup lang="ts">
    const props = defineProps({
        card: {
            type: String,
            default: '',
        },
    });

    const svgContent = ref('');
</script>