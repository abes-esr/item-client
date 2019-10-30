<template>
  <!-- FIL D'ARIANE DES DEMANDES DE RECOUVREMENT -->
  <v-stepper :value="current" :alt-labels=true>
    <v-stepper-header>
      <v-stepper-step step="1" :complete="current > 1">Sélection RCR</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="current > 2">Fichier à envoyer</v-stepper-step>
      <v-divider></v-divider>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name: 'upload',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '2' },
  },
};
</script>
