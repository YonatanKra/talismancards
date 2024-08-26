<template>
  <div class="editor-container">
    <div class="form-container">
      <h1>Edit Talisman Card, {{ name }}</h1>

      <form ref="editorForm">
        <!-- Card Title -->
        <vwc-text-field
          name="cardTitle"
          placeholder="כותרת"
          value="כותרת"
          @input="updateSVG"
        ></vwc-text-field>

        <!-- Subtitle -->
        <vwc-text-field
          name="cardSubtitle"
          placeholder="תת כותרת"
          value="תת כותרת"
          @input="updateSVG"
        ></vwc-text-field>

        <!-- Card Type -->
        <vwc-text-field
          name="cardType"
          placeholder="כותרת טקסט"
          value="כותרת טקסט"
          @input="updateSVG"
        ></vwc-text-field>

        <!-- Description -->
        <vwc-text-area
          name="cardDescription"
          placeholder="טקסט"
          value="טקסט"
          @input="updateSVG"
        ></vwc-text-area>

        <input
          type="file"
          name="userImage"
          @change="handleFileUpload"
          accept="image/*"
        />
      </form>
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
    default: 'Guest',
  },
  phone: {
    type: String,
    default: 'N/A',
  },
});

const svgContent = ref('');
const originalSVG = ref('');
const editorForm = ref<HTMLFormElement | null>(null);
const uploadedImage = ref<string | null>(null); // Store uploaded image data

// Load the SVG file
const loadSVG = async () => {
  const response = await fetch('/talisman_card.svg');
  const text = await response.text();
  originalSVG.value = text; // Store the original SVG
  svgContent.value = text; // Set the initial SVG content

  updateSVG();
};

function parseDescription(cardDescription) {
  const descriptionLines = cardDescription.split('\n');
  const maxWidth = 325;
  const maxLines = 7;
  return descriptionLines
    .map((line) => {
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

      return lines
        .map((line, index) => {
          return `<tspan x="50%" dy="25" text-anchor="middle">${line}</tspan>`;
        })
        .join('');
    })
    .join('');
}

const handleFileUpload = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string; // Store the Base64 image data
      updateSVG(); // Update the SVG to include the uploaded image
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
};

const updateSVG = () => {
  function getFormData() {
    const formData = new FormData(editorForm.value);
    const cardTitle = formData.get('cardTitle');
    const cardSubtitle = formData.get('cardSubtitle');
    const cardType = formData.get('cardType');
    const cardDescription = formData.get('cardDescription');
    return {
      cardTitle,
      cardSubtitle,
      cardType,
      cardDescription,
    };
  }

  const { cardTitle, cardSubtitle, cardType, cardDescription } = getFormData();

  // Create a new SVG string with updated values
  let updatedSVG = originalSVG.value // Use the original SVG template
    .replace(/{{cardTitle}}/g, cardTitle)
    .replace(/{{cardSubtitle}}/g, cardSubtitle)
    .replace(/{{cardType}}/g, cardType);

  updatedSVG = updatedSVG.replace(
    /{{cardDescription}}/g,
    parseDescription(cardDescription)
  );

  if (uploadedImage.value) {
    updatedSVG = replaceImageInSVG(updatedSVG, uploadedImage.value, 'img4');
  }

  svgContent.value = updatedSVG; // Update the displayed SVG
};

function replaceImageInSVG(svg, imgValue, imageId = 'img4') {
    const div = document.createElement('div');
    div.innerHTML = svg;
    const image = div.querySelector(`#${imageId}`);
    if (image) {
        image.setAttribute('href', imgValue);
    }
    return div.innerHTML;
}

// Function to calculate text width
const getTextWidth = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '16px Caxton BT'; // Use the same font as in the SVG
  return context.measureText(text).width;
};

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

// TODO::upload picture // TODO::submit to server // TODO::display approved
congrats // TODO::deploy // TODO::improve typing performance
