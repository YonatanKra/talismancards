<template>
  <div>
    <h1>Enter Your Details</h1>
    <form @submit.prevent="submitForm">
      <input v-model="name" placeholder="Name" required />
      <input v-model="phone" placeholder="Phone Number" required />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      phone: ''
    };
  },
  methods: {
    submitForm() {
      this.$router.push({ name: 'editor', query: { name: this.name, phone: this.phone } });
    }
  }
};
</script>