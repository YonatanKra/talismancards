<template>
    <div class="card">
        <vwc-toggletip class="text"
                       placement="left"
                       :open="toggleTipOpen"
                       v-html="card.title.replace('\n', '<br/>')" 
                       :headline="card.fileName.split('_')[3].replace('.svg', '')" 
                       :anchor="image"></vwc-toggletip>
        <img @mouseover="toggleTipOpen = true" @mouseout="toggleTipOpen = false" ref="image" slot="anchor" height="100%" :src="`https://talismancards.s3.us-east-2.amazonaws.com/images/${card.fileName}`" /> 
        
    </div>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue';

    const props = defineProps({
        card: {
            type: Object,
            default: {title: 'DemoCard', fileName: '#'},
        },
    });
    const image = ref<HTMLImageElement | null>(null);
    const toggleTipOpen = ref(false);
</script>

<style>
    .card {
        display: flex; flex-direction: row; height: 100vh;
        justify-content: center;
    }

    .text {
        max-width: 500px;
        direction: rtl; text-align: center;
        font-size: 2em;
    }
</style>