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
import {useAuthStore} from '@/store/authStore'

const authStore = useAuthStore()
const user = authStore.getUser

function setEmailUser(email){
  user.value.email = email;
  authStore.setUser(user);
  router.push('Accueil');
}
</script>
