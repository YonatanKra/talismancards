<template>
    <vwc-header dir="rtl" alternate>
      <div>
        היי {{ name }}, כאן יוצרים ברכת טאליסמן לאיתמר. לא לשכוח להחליף את תמונת הכרטיס...
      </div>
      <div class="editor-container" slot="app-content">
        <div class="form-container">
          <form ref="editorForm">
            <!-- Card Title -->
            <vwc-text-field
              maxlength="21"
              name="cardTitle"
              placeholder="כותרת הכרטיס"
              v-bind:current-value="cardTitle"
              @input="event => cardTitle = event.target.value"
            ></vwc-text-field>

            <!-- Subtitle -->
            <vwc-text-field
              maxlength="15"
              name="cardSubtitle"
              placeholder="תת כותרת"
              v-bind:current-value="cardSubtitle"
              @input="event => cardSubtitle = event.target.value"
            ></vwc-text-field>

            <!-- Card Type -->
            <vwc-text-field
              maxlength="20"
              name="cardType"
              placeholder="כותרת הברכה"
              v-bind:current-value="cardType"
              @input="event => cardType = event.target.value"
            ></vwc-text-field>

            <!-- Description -->
            <vwc-text-area
              name="cardDescription"
              placeholder="הברכה"
              v-bind:current-value="cardDescription"
              @input="event => cardDescription = event.target.value"
            ></vwc-text-area>

            <vwc-file-picker
              label="החלפת תמונת הכרטיס"
              name="userImage"
              @change="handleFileUpload"
              accept="image/*">
              אפשר לגרור תמונה לפה או ללחוץ כדי לבחור תמונה מהמחשב
            </vwc-file-picker>

            <vwc-button
              appearance="filled"
              connotation="cta"
              label="שליחת ברכה"
              @click="uploadSVG"
            ></vwc-button>
          </form>
        </div>

        <div v-show="editingImage" 
            ref="imageEditor" 
            id="image-editor-border">
            <div class="corner-square" 
                style="grid-area: top-left; cursor: nwse-resize; margin: -10px;" 
                @mousedown="startResize('top-left')"></div>
            <div class="rectangle" style="grid-area: top; cursor: ns-resize; margin: -10px 0;" @mousedown="startResize('top')"></div>
            <div class="corner-square" 
                style="grid-area: top-right; cursor: nesw-resize; margin: -10px;" 
                @mousedown="startResize('top-right')"></div>
            
            <div class="rectangle" style="grid-area: left; cursor: ew-resize; margin: 0 -10px;" @mousedown="startResize('left')"></div>
            <div style="grid-area: empty; background: transparent;" 
                @mousedown="startDrag"></div>
            <div class="rectangle" style="grid-area: right; cursor: ew-resize; margin: 0 -10px;" @mousedown="startResize('right')"></div>
            
            <div class="corner-square" 
                style="grid-area: bottom-left; cursor: nesw-resize; margin: -10px;" 
                @mousedown="startResize('bottom-left')"></div>
            <div class="rectangle" style="grid-area: bottom; cursor: ns-resize; margin: -10px 0;" @mousedown="startResize('bottom')"></div>
            <div class="corner-square" 
                style="grid-area: bottom-right; cursor: nwse-resize; margin: -10px;" 
                @mousedown="startResize('bottom-right')"></div>
        </div>

        <!-- Load SVG -->

        <div class="card-preview">
          <vwc-alert
            v-bind:open="editingImage"
            class="image-edit-alert"
            placement="bottom"
          >
          <div slot="main" v-if="editingImage" class="image-editor-form">
            <vwc-text-field type="number"
              label="רוחב"
              v-bind:current-value="imageWidth"
              @input="event => imageWidth = event.target.value"
            ></vwc-text-field>
            <vwc-text-field type="number"
              label="גובה"
              v-bind:current-value="imageHeight"
              @input="event => imageHeight = event.target.value"
            ></vwc-text-field>
            <vwc-text-field type="number"
              label="X"
              v-bind:current-value="imageX"
              @input="event => imageX = event.target.value"
            ></vwc-text-field>
            <vwc-text-field type="number"
              label="Y"
              v-bind:current-value="imageY"
              @input="event => imageY = event.target.value"
            ></vwc-text-field>
            <div class="full-width">
              <vwc-button connotation="alert" label="אתחול גודל תמונה" @click="resetImage"></vwc-button>
              <vwc-button connotation="alert" label="סיום עריכת תמונה" @click="endImageEdit"></vwc-button>
            </div>
          </div>
        </vwc-alert>
          
          <div v-if="editingImage" class="full-width">
            <vwc-button appearance="filled" connotation="accent" label="אתחול גודל תמונה" @click="resetImage"></vwc-button>
            <vwc-button appearance="filled" connotation="success" label="סיום עריכת תמונה" @click="endImageEdit"></vwc-button>
          </div>
          <vwc-button appearance="filled" connotation="accent" v-else="editingImage" label="עריכת תמונה" @click="editImage"></vwc-button>
          <div ref="svgContainer" v-html="svgContent" class="svg-container"></div>
        </div>
      </div>

    </vwc-header>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  function countSubstr(str, substr) {
    const regex = new RegExp(substr, 'g'); // Create a global regex for the substring
    const matches = str.match(regex); // Get all matches
    return matches ? matches.length : 0; // Return the count or 0 if no matches
  }

  function setVariables(svgText) {
    const tmpElement = document.createElement('div');
    tmpElement.innerHTML = svgText;
    const titleElement = tmpElement.querySelector('#Card\\ Name');
    cardTitle.value = titleElement ? titleElement.children[0].innerHTML : '';
    const subTitleElement = tmpElement.querySelector('#Event');
    cardSubtitle.value = subTitleElement ? subTitleElement.children[0].innerHTML : '';
    const typeElement = tmpElement.querySelector('#Description');
    cardType.value = typeElement ? typeElement.children[0].innerHTML : '';
    const descriptionElement = tmpElement.querySelector('#DescriptionText');
    const svgTitleElement = tmpElement.querySelector('title');
    if (svgTitleElement.textContent && svgTitleElement.textContent !== 'Talisman Adventure Card Template') {
      cardDescription.value = svgTitleElement.textContent;
    } else {
      cardDescription.value = getTextFromSVGTextElement(descriptionElement);
    }
  }

  function matchElementsDimenstions(element1, element2) {
    const rect = element1.getBoundingClientRect();
    element2.style.position = 'absolute';
    element2.style.left = `${rect.left}px`;
    element2.style.top = `${rect.top}px`;
    element2.style.width = `${rect.width}px`;
    element2.style.height = `${rect.height}px`;
  }

  function getTextFromSVGTextElement(textElement) {
    // Check if the provided element is a valid SVG <text> element
    if (!textElement || textElement.tagName !== 'text') {
        throw new Error('Invalid SVG text element');
    }

    // Get all <tspan> elements within the <text> element
    const tspanElements = textElement.getElementsByTagName('tspan');
    
    // Extract the text content from each <tspan> and join with newline characters
    const textArray = Array.from(tspanElements).map(tspan => tspan.textContent.trim());
    const result = textArray.join('\n');

    return result;
  }

  function resizeImage({deltaX, deltaY}) {
    const image = document.getElementById('img4');
    const dimensions = {
        width: Number(image.getAttribute('width').replace('%', '')),
        height: Number(image.getAttribute('height').replace('%', '')),
    };

    const positions = {
        x: Number(image.getAttribute('x').replace('%', '')),
        y: Number(image.getAttribute('y').replace('%', '')),
    };

    switch (resizeDirection.value) {
        case 'top-left':
            dimensions.width -= deltaX;
            dimensions.height -= deltaY;
            positions.x += deltaX;
            positions.y += deltaY;
            break;
        case 'top':
            dimensions.height -= deltaY;
            positions.y += deltaY;
            break;
        case 'top-right':
            dimensions.width += deltaX;
            dimensions.height -= deltaY;
            positions.y += deltaY;
            break;
        case 'left':
            dimensions.width -= deltaX;
            positions.x += deltaX;
            break;
        case 'right':
            dimensions.width += deltaX;
            break;
        case 'bottom-left':
            dimensions.width -= deltaX;
            dimensions.height += deltaY;
            positions.x += deltaX;
            break;
        case 'bottom':
            dimensions.height += deltaY;
            // positions.y -= deltaY;
            break;
        case 'bottom-right':
            dimensions.width += deltaX;
            dimensions.height += deltaY;
            break;
    }

    // Update the img dimensions
    image.setAttribute('width', `${dimensions.width > 0 ? dimensions.width : 10}%`);
    image.setAttribute('height', `${dimensions.height > 0 ? dimensions.height : 10}%`);
    image.setAttribute('x', `${positions.x}%`);
    image.setAttribute('y', `${positions.y}%`);
    matchElementsDimenstions(image, imageEditor.value);
  }

  const endImageEdit = async () => {
    editingImage.value = false;
    const svg = svgContainer.value.querySelector('svg');
    svgContent.value = svg.outerHTML;
  };

  const resetImage = async () => {
    const image = document.getElementById('img4');

    image.setAttribute('x', '5%');
    image.setAttribute('y', '15%');
    image.setAttribute('width', '90%');
    image.setAttribute('height', '45%');

    matchElementsDimenstions(image, imageEditor.value);
  }

  const editImage = async () => {
    editingImage.value = !editingImage.value;
    if (editingImage.value) {
      const image = document.getElementById('img4');
    
      const imageBorder = imageEditor.value;
      imageWidth.value = Number(image.getAttribute('width').replace('%', ''));
      imageHeight.value = Number(image.getAttribute('height').replace('%', ''));
      imageX.value = Number(image.getAttribute('x').replace('%', ''));
      imageY.value = Number(image.getAttribute('y').replace('%', ''));

      matchElementsDimenstions(image, imageBorder);
    }
  }

  const uploadSVG = async () => {
    endImageEdit();
    const userImage = svgContainer.value.querySelector('svg')?.getElementById('img4');
    if (userImage?.classList.contains('original-image')) {
      editorForm.value.querySelector('vwc-file-picker').errorText = 'בבקשה להעלות תמונה חדשה';
      return;
    }
    const fileName = `talisman_card_${props.phone}_${props.name}.svg`; // Unique file name

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: svgContent.value,
        fileName,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Upload Success', data);
      router.push({ name: 'success', query: { card: fileName, ...props } });
    } else {
      console.error('Upload Failed');
    }
  };

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

  const router = useRouter();
  
  const cardTitle = ref('');
  const cardSubtitle = ref('');
  const cardDescription = ref('');
  const cardType = ref('');
  const svgContent = ref('');
  const originalSVG = ref('');
  const editingImage = ref(false);
  const editorForm = ref<HTMLFormElement | null>(null);
  const imageEditor = ref<HTMLFormElement | null>(null);
  const svgContainer = ref<HTMLFormElement | null>(null);
  const uploadedImage = ref<string | null>(null);
  const isDragging = ref(false);
  const initialMousePosition = ref({ x: 0, y: 0 });
  const initialImagePosition = ref({ x: 0, y: 0 });
  const imageWidth = ref(0);
  const imageHeight = ref(0);
  const imageX = ref(0);
  const imageY = ref(0);

  watch(svgContent, () => requestAnimationFrame(() => updateSVG('cardDescription')))
  watch(cardTitle, () => updateSVG('cardTitle'));
  watch(cardSubtitle, () => updateSVG('cardSubtitle'));
  watch(cardType, () => updateSVG('cardType'));
  watch(cardDescription, () => updateSVG('cardDescription'));
  watch([imageHeight, imageWidth, imageX, imageY], () => updateImageDimensions());
  
  const updateImageDimensions = () => {
    const image = document.getElementById('img4');
    image.setAttribute('width', `${imageWidth.value}%`);
    image.setAttribute('height', `${imageHeight.value}%`);
    image.setAttribute('x', `${imageX.value}%`);
    image.setAttribute('y', `${imageY.value}%`);
    matchElementsDimenstions(image, imageEditor.value);
  };
  // Load the SVG file
  const loadSVG = async () => {
    let text = '';
    const card = `talisman_card_${props.phone}_${props.name}.svg`;
    const savedResponse = await fetch(`/api/get-card/?fileName=${card}`)
    if (savedResponse.ok) {
      text = await savedResponse.text();
      setVariables(text);
    } else {
      const response = await fetch('/talisman_card.svg');
      text = await response.text();
    }
    
    originalSVG.value = text; // Store the original SVG
    svgContent.value = text; // Set the initial SVG content

    updateSVG();
  };

  function parseDescription(cardDescription) {
    const descriptionLines = cardDescription.split('\n');
    const maxWidth = 325;
    const maxLines = 7;
    const lines = descriptionLines
      .map((line, index, array) => {
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

        return lines
          .map((line, index) => {
            return `<tspan x="50%" dy="25" text-anchor="middle">${line}</tspan>`;
          })
          .join('');
      })
      .join('');
    
    if (countSubstr(lines, '<tspan') > maxLines) {
      let index = -1;
      let count = 0;
      while (count < maxLines) {
          index = lines.indexOf('<tspan', index + 1);
          if (index === -1) break; // If no more occurrences are found
          count++;
      }
      let part1 = lines.slice(0, index);
      return part1 += `<tspan x="50%" dy="25" text-anchor="middle">...</tspan>`
    }

    return lines;
  }

  const handleFileUpload = (event: Event) => {
    resetImage();
    editingImage.value = false;
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files.length > 1) {
      fileInput.shadowRoot.querySelector('.remove-btn').click()
    }
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage.value = e.target?.result as string; // Store the Base64 image data
        (editorForm.value?.querySelector('vwc-file-picker')) ? editorForm.value.querySelector('vwc-file-picker').errorText = undefined : '';
        updateSVG(); // Update the SVG to include the uploaded image
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const updateSVG = (updateOnly = null) => {
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

    let updatedSVG = originalSVG.value;
    const svg = svgContainer.value.querySelector('svg');
    switch(updateOnly) {
      case 'cardTitle':
        if (svg) {
          if (cardTitle.length > 16) {
            (svg.getElementById('Card Name').children[0] as HTMLElement).style.fontSize = '30px';
          }
          svg.getElementById('Card Name').children[0].innerHTML = cardTitle as string;
        }
        return;
      case 'cardSubtitle':
        if (svg) svg.getElementById('Event').children[0].innerHTML = cardSubtitle as string;
        return;
      case 'cardType':
        if (svg) svg.getElementById('Description').children[0].innerHTML = cardType as string;
        return;
      case 'cardDescription':
        if (svg) {
          svg.querySelector('title').textContent = cardDescription as string;
          svg.getElementById('DescriptionText').innerHTML = parseDescription(cardDescription) as string;
        }
        return;
      default:
        // Create a new SVG string with updated values
        updatedSVG = updatedSVG // Use the original SVG template
          .replace(/{{cardTitle}}/g, cardTitle)
          .replace(/{{cardSubtitle}}/g, cardSubtitle)
          .replace(/{{cardType}}/g, cardType);

        updatedSVG = updatedSVG.replace(
          /{{cardDescription}}/g,
          parseDescription(cardDescription)
        );

        updatedSVG = updatedSVG.replace(/<title>.*?<\/title>/, `<title>${cardDescription}</title>`);
        if (uploadedImage.value) {
          updatedSVG = replaceImageInSVG(updatedSVG, uploadedImage.value, 'img4');
        }
        break;
    }

    svgContent.value = updatedSVG; // Update the displayed SVG
  };

  function replaceImageInSVG(svg, imgValue, imageId = 'img4') {
    const div = document.createElement('div');
    div.innerHTML = svg;
    const image = div.querySelector(`#${imageId}`);
    if (image) {
      image.setAttribute('href', imgValue);
      image.classList.toggle('original-image', false);
    }
    return div.innerHTML;
  }

  // Function to calculate text width
  const getTextWidth = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '25px Caxton BT'; // Use the same font as in the SVG
    return context.measureText(text).width;
  };

  // Load SVG on component mount
  onMounted(loadSVG);

  const isResizing = ref(false);
  const resizeDirection = ref('');


  const startResize = (direction) => {
    isResizing.value = true;
    resizeDirection.value = direction;

    window.addEventListener('mousemove', onResizeImage);
    window.addEventListener('mouseup', stopResize);
  };

  
  const onResizeImage = (event) => {
    if (!isResizing.value) return;

    const deltaX = event.movementX;
    const deltaY = event.movementY;

    resizeImage({deltaX, deltaY});
  };

  const stopResize = () => {
    isResizing.value = false;
    window.removeEventListener('mousemove', onResizeImage);
    window.removeEventListener('mouseup', stopResize);
  };

  const startDrag = (event) => {
    isDragging.value = true;
    initialMousePosition.value = { x: event.clientX, y: event.clientY };

    const image = document.getElementById('img4');
    initialImagePosition.value = {
        x: Number(image.getAttribute('x').replace('%', '')),
        y: Number(image.getAttribute('y').replace('%', '')),
    };

    window.addEventListener('mousemove', onDragImage);
    window.addEventListener('mouseup', stopDrag);
  };

  function dragImage({deltaX, deltaY}) {
    const image = document.getElementById('img4');
    const newX = initialImagePosition.value.x + deltaX / 7;
    const newY = initialImagePosition.value.y + deltaY / 7;
    
    image.setAttribute('x', `${newX}%`);
    image.setAttribute('y', `${newY}%`);

    matchElementsDimenstions(image, imageEditor.value);
  }

  const onDragImage = (event) => {
    if (!isDragging.value) return;

    const deltaX = event.clientX - initialMousePosition.value.x;
    const deltaY = event.clientY - initialMousePosition.value.y;

    dragImage({deltaX, deltaY});
  };

  const stopDrag = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', onDragImage);
    window.removeEventListener('mouseup', stopDrag);
  };
</script>

<style scoped>

body {
  margin: 0;
}

vwc-header {
  width: 100%;
}

.app-content {
  display: flex;
  gap: 16px;
}

.image-editor-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  grid-template-rows: repeat(2, auto) auto; /* Two rows of auto height, plus one additional row */
  gap: 10px; /* Optional: space between grid items */  
}

.full-width {
  grid-column: 1 / -1; /* Span across all columns */
}

#image-editor-border {
  --drag-area-block-size: 10px;
  grid-template-columns: var(--drag-area-block-size) 1fr var(--drag-area-block-size);
  grid-template-rows: var(--drag-area-block-size) 1fr var(--drag-area-block-size);
  display: grid; 
  grid-template-areas: 
    'top-left top top-right'
    'left empty right'
    'bottom-left bottom bottom-right';
  border: 4px dashed #999; 
  direction: ltr;
}

h1 {
  font-size: 18px;
  direction: rtl;
}

.editor-container {
  display: flex;
  flex-direction: column; /* Default to column for larger screens */
  align-items: flex-start; /* Center items */
  gap: 20px; /* Space between form and card */
  padding-top: 32px;
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* Limit width for form */
}

form {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
}

.card-preview {
  width: 100%; /* Full width */
  max-width: 500px; /* Limit width for card */
  height: auto; /* Allow height to adjust */
}

.card-preview vwc-button {
  z-index: 9999;
  position: relative;
}

.svg-container {
  width: 100%; /* Make SVG responsive */
  height: 100%; /* Allow height to adjust */
  display: flex; /* Use flex to center the SVG */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  direction: ltr;
}

.svg-container svg {
  width: 100%; /* Make SVG responsive */
  height: auto; /* Maintain aspect ratio */
  max-height: 100%; /* Limit height to container */
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .editor-container {
    flex-direction: column; /* Change to row for mobile */
  }

  h1 {
    font-size: 16px;
  }

  form {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    flex-flow: column;
  }
}

@media (max-width: 768px) {
  #image-editor-border {
    display: none;
  }
}
@media (min-width: 768px) {
  .editor-container {
    flex-direction: row; /* Side by side on larger screens */
    justify-content: center; /* Space between form and card */
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

  .image-edit-alert {
    display: none !important; 
  }
}
</style>

// TODO::replace the `title` with a `tooltip`
// TODO::display approved congrats in a nice way
/* TODO::telephone number validation:
//  1. type="tel"
//  2. min and max length + custom error on validation 
*/