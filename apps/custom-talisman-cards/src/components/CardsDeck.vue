<template>
  <vwc-button label="shuffle" @click="shuffle"></vwc-button>
  <vwc-button label="fan" @click="fan"></vwc-button>
  <div ref="container" id="container"></div>
</template>

<script setup lang="ts">
import Deck from 'deck-of-cards';
import { listSVGs } from '../components/svgGetter.js';

const cards = ref([]);
const container = ref<HTMLDivElement | null>(null);

const deck = Deck(true);
deck.cards.forEach(function (card, i) {
  card.enableDragging();
  card.enableFlipping();
});

function shuffle() {
    deck.intro()
    deck.shuffle();
    deck.shuffle();
}

function fan() {
  deck.fan();
}

onMounted(async () => {
  try {
    cards.value = await listSVGs();
    deck.mount(container.value);
  } catch (error) {
    console.error('Failed to list SVGs:', error);
  }
});
</script>

<style>
#container {
  position: fixed;
  top: calc(50% + 1.5rem);
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  -moz-transform: translate3d(-50%, -50%, 0);
  -o-transform: translate3d(-50%, -50%, 0);
  -ms-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}

.card {
  position: absolute;
  display: inline-block;
  left: -1.9375rem;
  top: -2.75rem;
  width: 3.875rem;
  height: 5.5rem;
  background-color: #fff;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  cursor: default;
  will-change: transform;
}

.card:before,
.card:after {
  position: absolute;
  font-size: 0.7rem;
  text-align: center;
  line-height: 0.7rem;
  font-family: 'Ubuntu Condensed', sans-serif;
  white-space: pre-line;
  width: 0.55rem;
  letter-spacing: -0.1rem;
}

.card:before {
  top: 0.15rem;
  left: 0;
}

.card:after {
  bottom: 0.1rem;
  right: 0;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.card .face {
  height: 100%;
  background-position: 50% 50%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.card .back {
  position: absolute;
  background-image: url('faces/back.webp');
  background-position: 50% 50%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
