<template>
  <!-- MODIFICATION DE L'ADRESSE MAIL -->
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col md="7">
        <email :email="user.email ? user.email : ''" :user-id="user.userNum" @validate="setEmailUser"></email>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Email from '@/components/Email.vue';
import { ref } from 'vue';
import router from '@/router';

const user = ref(JSON.parse(sessionStorage.getItem('user')));

function setEmailUser(email){
  user.value.email = email;
  sessionStorage.setItem('user',JSON.stringify(user.value));
  router.push('Accueil');
}
</script>
