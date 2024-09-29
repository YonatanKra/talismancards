<template>
    <div class="slideshow" tabindex="0">
        <Transition name="slide-fade">
            <div :key="currentCardIndex" class="card-wrapper" v-if="cards.length">
                <DisplayCard :card="cards[currentCardIndex]" />
            </div>
        </Transition>
    </div>
    
  </template>
  
  <script setup lang="ts">
    
    import { onBeforeUnmount, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { listSVGs } from './svgGetter.js';

    const cards = ref([]);
    const currentCardIndex = ref(0);
    const intervalTime = 5000;
    let intervalId = setTimeout(() => {});

    const nextCard = (next = 1) => {
        let value = currentCardIndex.value + next;
        if (value < 0) {
            value = cards.value.length - 1;
        }

        currentCardIndex.value = (value) % cards.value.length;
    };

    function restartSlides() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextCard, intervalTime);
    }

    function stopSlides() {
        clearInterval(intervalId);
        intervalId = null;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowRight') {
            nextCard();
            restartSlides();
        } 
        if (e.key === 'ArrowLeft') {
            nextCard(-1);
            restartSlides();
        }
        if (e.key === ' ') {
            intervalId ? stopSlides() : restartSlides();
        }
    }

    onMounted(async () => {
        document.addEventListener('keydown', handleKeyDown);

        try {
            cards.value = await listSVGs();
            intervalId = setInterval(nextCard, intervalTime);
        } catch (error) {
            console.error('Failed to list SVGs:', error);
        }
    });
    

    onBeforeUnmount(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        document.removeEventListener('keydown', handleKeyDown);
    });
    const route = useRoute();
    const name = route.query.name || 'card';
    const phone = route.query.phone || 'talisman';
  </script>

<style scoped>
    .slideshow {
        display: flex; /* Use flexbox for layout */
        justify-content: center; /* Center the card horizontally */
        align-items: center; /* Center the card vertically */
        width: 100%; /* Adjust as needed */
        height: 100vh; /* Set a specific height */
        overflow: hidden;
        outline: none;
    }

    .card-wrapper {
        position: absolute;
        top: 20px;
        width: 100%; /* Adjust as needed */
        height: 100hv; /* Or set a specific height */
        transition: opacity 0.5s ease, transform 0.5s ease; /* Adjust timing as needed */
    }

    .slide-fade-enter-active {
        transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-leave-active {
        transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from {
        transform: translateX(230px);
        opacity: 0;
    }
    
    .slide-fade-leave-to {
        transform: translateX(-230px);
        opacity: 0;
    }
</style>
  
// TODO::pause slide on hover