<template>
  <v-container>
    <v-row   justify="center">
      <loading :show="loading" label="Chargement en cours..."></loading>
      <v-col cols="8">
        <steppermodif id="stepper" current="3" :numDemande="this.numDem.toString()" :modif="this.modif" :choixTraitement="this.choixTraitement"></steppermodif>
      </v-col>
      <v-col md="5" id="flexBox">
        <v-card class="elevation-12">
          <v-app-bar dark color="primary">
            <v-toolbar-title>Choix du type de traitement</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="popupDelete = true"><v-icon>delete</v-icon>Supprimer</v-btn>
          </v-app-bar>
          <v-card-text>
            <v-card raised hover v-for="traitement in listTraitements" :key="traitement.numTraitement" @click="selected=traitement; selectTraitement();">
                    <v-card-title primary-title>
                        <v-container>
                            <v-row align="center">
                              <show-at :breakpoints="{small: 1300, medium: 1400, large: 1600}" breakpoint="mediumAndAbove">
                                <v-col cols="12" sm="3" md="2">
                                    <span>
                                        <v-icon large v-if="traitement.numTraitement == 1">add</v-icon>
                                        <v-icon large v-else-if="traitement.numTraitement == 2">edit</v-icon>
                                        <v-icon large v-else-if="traitement.numTraitement == 3">redo</v-icon>
                                        <v-icon large v-else-if="traitement.numTraitement == 4">clear</v-icon>
                                        <v-icon large v-else-if="traitement.numTraitement == 5">delete</v-icon>
                                        <v-icon large v-else x-large dark>edit</v-icon>
                                    </span>
                                </v-col>
                              </show-at>
                                <v-col cols="12" sm="9" md="10">
                                    <h3 class="headline">{{ traitement.libelle }}</h3>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-title>
                </v-card>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- precedentDemande(numDem) est contenue dans le mixin delete.js importé plus bas -->
            <v-btn color="info" v-on:click="precedentDemande(numDem, modifData)">Précédent</v-btn>
          </v-card-actions>
        </v-card>
        <br />
      </v-col>
      <v-dialog v-model="popupDelete" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Suppression</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir supprimer définitivement cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="popupDelete = false" aria-label="Annuler">Annuler</v-btn>
            <!-- supprimerDemande(numDem) est contenue dans le mixin delete.js importé plus bas -->
            <v-btn color="primary" text @click="supprimerDemande(numDem, this.modif)" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-snackbar v-model="this.alert" :timeout="timeout" :color="alertType" absolute="true">{{ this.alertMessage }}<v-btn text @click="alert = false">Fermer</v-btn></v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import loading from 'vue-full-loading';
import { showAt } from 'vue-breakpoints';
import steppermodif from '@/components/utils/stepperModif.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';
import TYPEDEMANDE from '../../enums/typeDemande';

export default {
  // Import du mixin contenant les méthodes suppression et de précédent
  mixins: [supprMixin],
  components: {
    loading,
    steppermodif,
    showAt,
  },
  data() {
    return {
      json: '',
      listTraitements: [],
      selected: '',
      active: false,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      user: {},
      loading: false,
      numDem: 0,
      popupDelete: false,
      modifData: TYPEDEMANDE.DEMANDE_MODIFICATION,
      timeout: 0,
    };
  },
  props: {
    choixTraitement: {
      default: 'à effectuer',
    },
  },
  mounted() {
    this.getListTraitements();
    // Récupération du numéro de demande courant depuis sessionStorage
    // Il est enregistré par rcr.vue lors de la création, ou depuis le tableau lorsque l'on clique sur une demande
    this.numDem = sessionStorage.getItem('dem');
    this.modif = TYPEDEMANDE.DEMANDE_MODIFICATION;
  },
  methods: {
    // Récupère la liste des traitements afin de les afficher
    getListTraitements() {
      this.loading = true;
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user !== null && this.user.jwt !== null) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url: `${process.env.VUE_APP_ROOT_API}traitements`,
        }).then(
          (result) => {
            this.listTraitements = result.data;
          },
          (error) => {
            this.alertMessage = constants.erreur500;
            this.alert = true;
            this.alertType = 'error';
            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
      this.loading = false;
    },
    // Lorsque l'utilisateur choisit le traitement (au clic) on récupère la demande en GET et on modifie le traitement dans l'objet demande
    // Puis la méthode permettant d'enregistrer la MAJ est appelée
    selectTraitement() {
      this.active = false;
      this.alert = false;
      let demande = {};
      this.loading = true;

      if (this.user !== null && this.user.jwt !== null) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url:
              `${process.env.VUE_APP_ROOT_API}demandes/${sessionStorage.getItem('dem')}`,
        }).then(
          (result) => {
            demande = result.data;
            demande.traitement = this.selected;
            this.updateDemande(demande);
          },
          (error) => {
            this.alertMessage = constants.erreur500;
            this.alert = true;
            this.alertType = 'error';
            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
    },
    // Enregistrement des modification de la demande
    // On renvoie l'objet complet modifié
    updateDemande(demande) {
      this.loading = true;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'PUT',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${sessionStorage.getItem('dem')}`,
        data: demande,
      }).then(
        () => {
          this.alertMessage = 'Demande mise à jour.';
          this.alert = true;
          this.alertType = 'success';
          this.$router.replace({ name: 'uploadFinal' });
          this.loading = false;
        },
        (error) => {
          this.alertMessage = constants.erreur500;
          this.alert = true;
          this.alertType = 'error';
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
  },
};
</script>

<style scoped>
.v-card {
      margin-top: 10px;
    }
    .group {
      border-radius: 5%;
      display: flex;
      flex: 1;
      justify-content: space-around;
    }
    #flexBox {
      max-width: 700px;
    }
</style>
