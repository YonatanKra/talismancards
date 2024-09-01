<template>
    <div class="display-cards">
        <DisplayCard 
            v-for="card in cards" 
            :key="card"
            :card="card" 
            />
    </div>
  </template>
  
  <script setup lang="ts">
    
    import { useRoute } from 'vue-router';

    const cards = ref([]);

    async function listSVGs(phoneNumber, name) {
        try {
            const response = await fetch(
            `/api/list-cards?phoneNumber=${encodeURIComponent(
                phoneNumber
            )}&name=${encodeURIComponent(name)}`
            );

            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            const fileNames = await response.json();
            return fileNames;
        } catch (error) {
            console.error('Error listing SVGs:', error);
            throw error;
        }
    }

    onMounted(async () => {
        try {
            cards.value = await listSVGs(phone, name);
            console.log('Matching SVG files:', cards);
        } catch (error) {
            console.error('Failed to list SVGs:', error);
        }
    });
    

    const route = useRoute();
    const name = route.query.name || 'card';
    const phone = route.query.phone || 'talisman';
  </script>
  