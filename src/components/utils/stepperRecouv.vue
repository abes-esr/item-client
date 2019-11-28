<template>
  <!-- FIL D'ARIANE DES DEMANDES DE RECOUVREMENT -->
  <v-stepper :value="current" :alt-labels=true>
    <v-stepper-header>
      <v-stepper-step :editable="current > 1" v-if="this.numDemande === undefined" step="1" :complete="current > 1">Sélection RCR<small>Demande</small></v-stepper-step>
      <v-stepper-step :editable="current > 1" v-if="this.numDemande !== undefined" step="1" :complete="current > 1" @click="supprimerDemande(numDemande, modif)">Sélection RCR<small>Demande n°<strong>{{this.numDemande}}</strong></small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="current > 2">Téléchargement <small>du fichier</small></v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
import axios from 'axios';
import constants from '@/components/utils/const';

export default {
  name: 'upload',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '2' },
    /** Numéro de la demande */
    numDemande: { type: String },
    modif: { type: String },
  },
  methods: {
    // suppresion d'une demande depuis le stepper avec redirection sur l'étape 1 de recouvrement
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
          this.$router.replace('/rcrRecouv');
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
