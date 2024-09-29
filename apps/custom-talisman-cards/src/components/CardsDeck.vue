<template>
  <vwc-button label="Shuffle" @click="shuffle"></vwc-button>
  <vwc-button label="Fan" @click="fan"></vwc-button>
  <vwc-button label="Flip" @click="flip"></vwc-button>
  <vwc-button label="Spread" @click="spread"></vwc-button>
  <div ref="container" id="container"></div>
  <vwc-dialog ref="dialogElement">
    <DisplayCard slot="main" :card="currentCard"></DisplayCard>
  </vwc-dialog>
</template>

<script setup lang="ts">
import Deck from 'deck-of-cards';
import { listSVGs } from '../components/svgGetter.js';

const cards = ref([]);
const container = ref<HTMLDivElement | null>(null);
const dialogElement = ref<HTMLDialogElement | null>(null);
const currentCard = ref(null);

const deck = Deck(false);
deck.cards.forEach(function (card, i) {
  card.enableDragging();
  card.enableFlipping();
});

function spread() {
    deck.sort(true);
    deck.bysuit();
}

function shuffle() {
  deck.shuffle();
  deck.shuffle();
  deck.shuffle();
}

function fan() {
  deck.fan();
}

function flip() {
  deck.flip();
}

let draggedElement = null;

function getTransformValuesFromElement(element: HTMLElement) {
  const transform = element.style.transform;

  if (transform !== 'none') {
    // Regular expression to match translate and rotate values
    const translateMatch = transform.match(/translate\(([^)]+)\)/);
    const rotateMatch = transform.match(/rotate\(([^)]+)\)/);

    let translateX = 0;
    let translateY = 0;
    let rotateValue = '0';

    if (translateMatch) {
      const translateValues = translateMatch[1]
        .split(',')
        .map((value) => value.trim());
      translateX = parseFloat(translateValues[0]); // Extract translateX
      translateY = parseFloat(translateValues[1]); // Extract translateY
    }

    if (rotateMatch) {
      rotateValue = rotateMatch[1]; // This will be the value in degrees

      // If you want to convert it to a number
      const rotateDegrees = parseFloat(rotateValue);
    }
    return { translateX, translateY, rotateValue };
  }
}

function overrideMouseMoveListener(e: MouseEvent) {
  if (!draggedElement) return;
  const { translateX, translateY, rotateValue } =
    getTransformValuesFromElement(draggedElement);

  draggedElement.style['transform'] = `translate(${translateX / 2}px, ${
    translateY / 2
  }px) rotate(${rotateValue})`;
}

onMounted(async () => {
  try {
    let currentValueIndex = 0;
    let style = '';
    cards.value = await listSVGs();
    ['spades', 'hearts', 'clubs', 'diamonds'].forEach((type) => {
      for (let i = 1; i <= 13; i++) {
        if (currentValueIndex >= cards.value.length) {
          style += `.card.${type}.rank${i} {
                    display: none;
                }`;
        } else {
          style += `.card.${type}.rank${i} .face {
                    background-image: url("https://talismancards.s3.us-east-2.amazonaws.com/images/${
                      cards.value[currentValueIndex++].fileName
                    }");
                }`;
        }
      }
    });
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    container.value.appendChild(styleElement);
    deck.mount(container.value);
    window.addEventListener('mouseup', () => {
      draggedElement = null;
      window.removeEventListener('mousemove', overrideMouseMoveListener);
    });
    deck.cards.forEach((card, i) => {
      card.$el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        card.disableFlipping();
        if (card.side === 'front') {
          const dialogNativeElement = dialogElement.value;
          currentCard.value = cards.value[i];
          if (!dialogNativeElement.open) dialogNativeElement.showModal();
        }
        setTimeout(() => {
          card.enableFlipping();
        }, 100);
      });
    });
    deck.intro();
    shuffle();
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

vwc-dialog {
  --dialog-min-inline-size: 60%;
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
  scale: 2;
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
  background-image: url('/faces/back.webp');
  background-position: 50% 50%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>

// TODO::refactor // TODO::show the card in a dialog with the "title" in a
toggletip
