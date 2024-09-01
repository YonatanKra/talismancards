<template>
    <div v-if="svgContent" v-html="svgContent"></div>
    <div v-else>Loading SVG...</div>
  </template>
  
<script setup lang="ts">
    const props = defineProps({
        card: {
            type: String,
            default: '',
        },
    });

    const svgContent = ref('');

    onMounted(async () => {
        try {
            const response = await fetch(`/api/get-card?fileName=${encodeURIComponent(props.card)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            svgContent.value = await response.text();
        } catch (error) {
            console.error('Error fetching SVG:', error);
        }
    })
</script>