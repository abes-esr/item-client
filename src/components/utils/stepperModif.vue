<template>
  <!-- FIL D'ARIANE -->
  <v-stepper :value="current" :alt-labels=true style="margin-bottom: 1em">
    <v-stepper-header>
      <v-stepper-step v-if="this.numDemande === '0'" step="1" :complete="current > 1">Sélection RCR<small>Demande</small></v-stepper-step>
      <v-stepper-step v-if="this.numDemande !== '0'" step="1" :complete="current > 1">Sélection RCR<small>Demande n°{{this.numDemande}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="current > 2">PPN/RCR/EPN<small>fichier à récupérer</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" :complete="current > 3">Choix traitement<small>à effectuer</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4" :complete="current > 4">Envoi du fichier <small>complété</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="5" :complete="current > 5">Simulation<small>avant envoi</small></v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name: 'stepper',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '5' },
    numDemande: { type: String, default: '0' },
  },
};
</script>

<style scoped></style>
