<template>
  <div>
    <h1>Enter Your Details</h1>
    <form ref="form" @submit.prevent="submitForm">
      <vwc-text-field name="name" placeholder="Name" required></vwc-text-field>
      <vwc-text-field name="phone" placeholder="Phone Number" required></vwc-text-field>
      <vwc-button label="Submit" type="submit"></vwc-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const phone = ref('');
const form = ref<HTMLFormElement | null>(null); // Reference to the form

const submitForm = () => {
  if (form.value) {
    // Access form data directly
    const formData = new FormData(form.value);
    const nameValue = formData.get('name') as string; // Get name from form data
    const phoneValue = formData.get('phone') as string; // Get phone from form data

    console.log(nameValue);
    router.push({
      name: 'editor',
      query: { name: nameValue, phone: phoneValue },
    });
  }
};
</script>

<style scoped>
/* Add any styles here if needed */
</style>