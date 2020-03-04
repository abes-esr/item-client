<template>
  <!-- FIL D'ARIANE DES DEMANDES D'EXEMPLARISATION-->
  <v-stepper :value="current" :alt-labels=true>
    <v-stepper-header>
      <v-stepper-step :editable="current > 1" v-if="this.numDemande === undefined" step="1" :complete="current > 1">Sélection RCR</v-stepper-step>
      <v-stepper-step :editable="current > 1" v-if="this.numDemande !== undefined" step="1" :complete="current > 1" @click="supprimerDemande(numDemande, modif)">Sélection RCR<small>Demande n°{{numDemande}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 2" step="2" :complete="current > 2" @click="etapeDemande(numDemande, modif, 2)">Type document<small>{{typeExemplarisation}}</small></v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 3" step="3" :complete="current > 3" @click="etapeDemande(numDemande, modif, 3)">Chargement</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :editable="current > 4" step="4" :complete="current > 4">Simulation</v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
import axios from 'axios';
import constants from '@/components/utils/const';
import supprMixin from '@/mixins/delete';

export default {
  mixins: [supprMixin],
  name: 'upload',
  props: {
    /** Numéro de l'étape courante */
    current: { type: String, default: '5' },
    numDemande: { type: String },
    typeExemplarisation: { type: String },
    modif: { type: String },
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
          this.$router.replace('/rcrEx');
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
