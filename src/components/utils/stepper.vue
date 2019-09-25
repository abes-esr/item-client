<template>
  <!-- FIL D'ARIANE -->
  <v-stepper :value="current" :alt-labels=true style="margin-bottom: 1em">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="current > 1">Sélection RCR</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="current > 2">PPN/RCR/EPN</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" :complete="current > 3">Choix traitement</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4" :complete="current > 4">Fichier complété</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="5" :complete="current > 5">Production</v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name: 'stepper',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '5' },
  },
};
</script>

<style scoped src="../../assets/global.css"></style>
