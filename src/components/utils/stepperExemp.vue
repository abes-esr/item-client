<template>
  <!-- FIL D'ARIANE DES DEMANDES D'EXEMPLARISATION-->
  <v-stepper :value="current" :alt-labels=true>
    <v-stepper-header>
      <v-stepper-step v-if="this.numDemande === undefined" step="1" :complete="current > 1">Sélection RCR</v-stepper-step>
      <v-stepper-step v-if="this.numDemande !== undefined" step="1" :complete="current > 1">Sélection RCR<small>Demande n°{{this.numDemande}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="current > 2">Choix du type<small>{{this.typeExemplarisation}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" :complete="current > 3">Envoi<small>du fichier</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4" :complete="current > 4">Simulation<small>avant envoi</small></v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name: 'upload',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '5' },
    numDemande: { type: String },
    typeExemplarisation: { type: String },
  },
};
</script>
