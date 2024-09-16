<template>
  <div class="container">
    <div class="content" style="direction:rtl">
      <h1>ברכות לאיתמר!</h1>
      <p>איתמר מאוד אוהב את המשחק <a href="https://he.wikipedia.org/wiki/%D7%98%D7%9C%D7%99%D7%A1%D7%9E%D7%9F_(%D7%9E%D7%A9%D7%97%D7%A7)" target="_blank">טליסמן</a>. זה משחק שבו הגיבורים זזים על לוח המשחק ובכל תור שולפים קלף משימה.</p>
      <p>באפליקציה הזו תוכלו לשלוח ברכת בר מצווה לאיתמר בצורה של קלף טליסמן. במהלך האירוע צפויה הפתעה לאיתמר עם הברכות שישלחו.</p>
      
      <form ref="form" @submit.prevent="submitForm" class="form">
        <vwc-text-field 
          name="name" 
          placeholder="שם" 
          v-bind:current-value="name"
          @input="checkFormValidity"
          required
        ></vwc-text-field>
        <vwc-text-field
          name="phone" 
          placeholder="מספר טלפון" 
          v-bind:current-value="phone"
          @input="checkFormValidity" 
          required
        ></vwc-text-field>
        <vwc-button 
          appearance="filled" 
          connotation="cta" 
          label="נתחיל לברך" 
          aria-label="נתחיל לברך"
          type="submit" 
          :disabled="!isFormValid ? true : undefined"
        ></vwc-button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const form = ref<HTMLFormElement | null>(null); // Reference to the form
  const isFormValid = ref(false); // Reactive property to track form validity
  const name = ref('');
  const phone = ref('');

  const checkFormValidity = (e) => {
    if (e.currentTarget.name === 'name') {
      name.value = e.target.value;
    } else {
      phone.value = e.target.value;
    }
    if (form.value) {
      isFormValid.value = form.value.checkValidity(); 
    }
  };

  const submitForm = (event) => {
    if (form.value) {
      router.push({
        name: 'editor',
        query: { name: name.value, phone: phone.value },
      });
    }
  };
</script>

<style scoped>
.container {
  display: flex; /* Use flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100vh; /* Full viewport height */
}

.content {
  text-align: center; /* Center text inside the content */
}

.form {
  display: flex; /* Use flexbox for the form */
  justify-content: center; /* Center items horizontally */
  align-items: flex-start; /* Center items vertically */
  gap: 15px; /* Space between items */
}

vwc-text-field {
  max-height: 40px;
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .form {
    flex-direction: column; /* Stack items on mobile */
    gap: 10px; /* Optional: Adjust gap for mobile */
    align-items: center; /* Center items vertically */  
  }

  vwc-text-field {
    margin-bottom: 15px;
  }
}

p {
  font-size: 18px;
}
</style>