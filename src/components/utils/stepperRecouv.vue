<template>
  <!-- FIL D'ARIANE DES DEMANDES DE RECOUVREMENT -->
  <v-stepper :value="current" :alt-labels=true>
    <v-stepper-header>
      <v-stepper-step v-if="this.numDemande === 0" step="1" :complete="current > 1">Sélection RCR<small>Demande</small></v-stepper-step>
      <v-stepper-step v-if="this.numDemande !== 0" step="1" :complete="current > 1">Sélection RCR<small>Demande n°<strong>{{this.numDemande}}</strong></small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="current > 2">Téléchargement <small>du fichier</small></v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name: 'upload',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '2' },
    /** Numéro de la demande */
    numDemande: { type: Int8Array, default: '0' },
  },
};
</script>
