<template>
  <div class="editor-container">
    <div class="form-container">
      <h1>Edit Talisman Card</h1>
      
      <!-- Card Title -->
      <label for="cardTitle">Card Title:</label>
      <input id="cardTitle" v-model="cardTitle" placeholder="Enter card title" />

      <!-- Subtitle -->
      <label for="cardSubtitle">Subtitle:</label>
      <input id="cardSubtitle" v-model="cardSubtitle" placeholder="Enter subtitle" />

      <!-- Card Type -->
      <label for="cardType">Card Type:</label>
      <input id="cardType" v-model="cardType" placeholder="Enter card type" />

      <!-- Description -->
      <label for="cardDescription">Description:</label>
      <textarea id="cardDescription" v-model="cardDescription" placeholder="Enter description"></textarea>
    </div>

    <!-- Load SVG -->
    <div class="card-preview">
      <div v-html="svgContent" class="svg-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: 'Guest'
  },
  phone: {
    type: String,
    default: 'N/A'
  }
});

// Reactive properties for card details
const cardTitle = ref('');
const cardSubtitle = ref('');
const cardType = ref('');
const cardDescription = ref('');
const svgContent = ref('');
const originalSVG = ref(''); // Store the original SVG template

// Load the SVG file
const loadSVG = async () => {
  const response = await fetch('/talisman_card.svg');
  const text = await response.text();
  originalSVG.value = text; // Store the original SVG
  svgContent.value = text; // Set the initial SVG content

  updateSVG();
};

// Update SVG content with dynamic text
const updateSVG = () => {
  // Split the cardDescription into lines
  const descriptionLines = cardDescription.value.split('\n');
  
  // Create a new SVG string with updated values
  let updatedSVG = originalSVG.value // Use the original SVG template
    .replace(/{{cardTitle}}/g, cardTitle.value)
    .replace(/{{cardSubtitle}}/g, cardSubtitle.value)
    .replace(/{{cardType}}/g, cardType.value);

  // Replace the placeholder for cardDescription with multiple lines
  const maxWidth = 325; 
  const maxLines = 7;
  const descriptionSVG = descriptionLines.map((line) => {
    // Split the line into words
    const words = line.split(' ');
    let currentLine = '';
    let lines = [];

    words.forEach((word) => {
      const testLine = currentLine + word + ' ';
      const textWidth = getTextWidth(testLine); // Function to calculate text width

      if (textWidth > maxWidth) {
        lines.push(currentLine.trim());
        currentLine = word + ' '; // Start a new line with the current word
      } else {
        currentLine = testLine; // Continue adding to the current line
      }
    });

    // Add the last line
    if (currentLine) {
      lines.push(currentLine.trim());
    }

    // Add ellipsis if the number of lines exceeds a certain limit
    if (lines.length > maxLines) {
      lines = lines.slice(0, 3); // Limit to 3 lines
      lines[2] += '...'; // Add ellipsis to the last line
    }

    return lines.map((line, index) => {
      return `<tspan x="50%" dy="25" text-anchor="middle">${line}</tspan>`;
    }).join('');
  }).join('');

  updatedSVG = updatedSVG.replace(/{{cardDescription}}/g, descriptionSVG);
  
  svgContent.value = updatedSVG; // Update the displayed SVG
};

// Function to calculate text width
const getTextWidth = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '16px Caxton BT'; // Use the same font as in the SVG
  return context.measureText(text).width;
};

// Watch for changes to card details and update SVG content
watch([cardTitle, cardSubtitle, cardType, cardDescription], updateSVG);

// Load SVG on component mount
onMounted(loadSVG);
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: row; /* Stack on mobile */
  align-items: top; /* Center items */
  gap: 20px; /* Space between form and card */
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* Limit width for form */
}

.card-preview {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
  width: 100%; /* Full width */
  max-width: 500px; /* Limit width for card */
  height: auto; /* Allow height to adjust */
}

.svg-container {
  width: 100%; /* Make SVG responsive */
  height: 100%; /* Allow height to adjust */
  display: flex; /* Use flex to center the SVG */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.svg-container svg {
  width: 100%; /* Make SVG responsive */
  height: auto; /* Maintain aspect ratio */
  max-height: 100%; /* Limit height to container */
}

@media (min-width: 768px) {
  .editor-container {
    flex-direction: row; /* Side by side on larger screens */
    justify-content: space-between; /* Space between form and card */
  }

  .form-container {
    margin-right: 20px; /* Space between form and card */
  }

  .card-preview {
    flex: 1; /* Allow card to take available space */
  }

  text {
    direction: rtl !important;
  }
}
</style>