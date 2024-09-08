<template>
  <vwc-card>
    <div slot="main" style="text-align: center">
      
      <div>
        <h1>
          הברכה שלך נשלחה בהצלחה!
        </h1>
        <img :src="`https://talismancards.s3.us-east-2.amazonaws.com/images/${card}`"/> 
        <div>
          באפשרותך לערוך את הכרטיס שלך על ידי כניסה עם אותו שם ומספר טלפון או בקישור:
          <br/>
          <a :href="fullUrl" target="_blank" rel="noopener noreferrer">{{ fullUrl }}</a>
          <br/>
          תודה שהוספת שמחה לאירוע בר המצווה של איתמר
          <vwc-icon name="heart-solid" style="color: red"></vwc-icon>
        </div>        
      </div>
    </div>
  </vwc-card>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const card = route.query.card;
  const domain = import.meta.client ? window.location.origin : ''; // Get the domain only on the client side
  const path = router.resolve({ name: 'editor', query: { name: route.query.name, phone: route.query.phone } }).href;
  const fullUrl = `${domain}${path}`;

</script>

<style scoped>
  img {
    max-height: 250px;
  }

  vwc-card {
    direction: rtl;
  }
</style>