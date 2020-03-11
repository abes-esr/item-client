<template>
  <!-- FIL D'ARIANE -->
  <v-stepper :value="current" :alt-labels=true style="margin-bottom: 1em">
    <v-stepper-header>
      <v-stepper-step :editable="current > 1" v-if="this.numDemande === undefined" step="1" :complete="current > 1">Sélection RCR<small>Demande</small></v-stepper-step>
      <v-stepper-step :editable="current > 1" v-if="this.numDemande !== undefined" step="1" :complete="current > 1" @click="supprimerDemande(numDemande, modif)">Sélection RCR<small>Demande n°{{this.numDemande}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 2" step="2" :complete="current > 2" @click="etapeDemande(numDemande, modif, 2)">PPN/RCR/EPN<small>fichier à récupérer</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 3" step="3" :complete="current > 3" @click="etapeDemande(numDemande, modif, 3)">Choix traitement<small>{{this.choixTraitement}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 4" step="4" :complete="current > 4" @click="etapeDemande(numDemande, modif, 4)">Envoi<small>du fichier</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 5" step="5" :complete="current > 5">Simulation<small>avant envoi</small></v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
import axios from 'axios';
import constants from '@/components/utils/const';
import supprMixin from '@/mixins/delete';

export default {
  mixins: [supprMixin],
  name: 'stepper',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '5' },
    numDemande: { type: String },
    modif: { type: String },
    choixTraitement: { type: String },
  },
  methods: {
    // suppression d'une demande depuis le stepper avec redirection sur l'étape 1 et non l'accueil
    supprimerDemande() {
      this.loading = true;
      // Récupération des infos utilisateur et appel du WS
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios({
        headers: { Authorization: user.jwt },
        method: 'DELETE',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.numDemande}?type=${this.modif}`,
      }).then(
        () => {
          this.loading = false;
          this.$router.replace('/rcr');
        },
        () => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = constants.erreur500;
          this.loading = false;
        },
      );
    },
  },
};
</script>

<style scoped></style>
