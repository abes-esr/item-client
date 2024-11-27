<template>
  <v-overlay
      absolute
      v-model="warningDialog"
      persistent
      class="justify-center align-center"
  >
    <v-alert
        type="warning"
        prominent
        border="left"
    >
      Service indisponible. Application en maintenance. Vous serez informé de la reprise du service.
    </v-alert>
  </v-overlay>
</template>
<script setup>
import { computed } from 'vue';

let maintenance = import.meta.env.VITE_MAINTENANCE;
const warningDialog = computed(() => {
  return maintenance == true;
});

</script>
<style>
v-alert {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
</style>
