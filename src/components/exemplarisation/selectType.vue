<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center>
      <loading :show="loading" label="Chargement en cours..."></loading>
      <v-flex xs8>
        <!-- TODO : METTRE LE BON STEPPER UNE FOIS FAIT -->
        <!-- <stepper id="stepper" current="3"></stepper> -->
      </v-flex>
      <v-flex md5 id="flexBox">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Choix du type d'exemplarisation</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat @click="popupDelete = true"><v-icon>delete</v-icon>Supprimer</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-card raised hover v-for="exemp in listExemp" :key="exemp.numTypeExemp" @click="selected=exemp; selectType();" height="7.8em">
                    <v-card-title primary-title>
                        <v-container grid-list-md>
                            <v-layout row wrap align-center>
                                <v-flex xs2>
                                    <span class="group pa-3 secondary" style="height: 4.2em">
                                        <v-icon v-if="exemp.numTypeExemp == 1" x-large dark>chrome_reader_mode</v-icon>
                                        <v-icon v-else-if="exemp.numTypeExemp == 2" x-large dark>library_books</v-icon>
                                        <v-icon v-else x-large dark>import_contacts</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex xs6 ml-4>
                                    <h3 class="headline">{{ exemp.libelle }}</h3>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-title>
                </v-card>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- precedentDemande(numDem) est contenue dans le mixin delete.js importé plus bas -->
            <v-btn color="info" v-on:click="precedentDemande(numDem)">Précédent</v-btn>
          </v-card-actions>
        </v-card>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
      </v-flex>
      <v-dialog v-model="popupDelete" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Suppression</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir supprimer définitivement cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="popupDelete = false" aria-label="Annuler">Annuler</v-btn>
            <!-- supprimerDemande(numDem) est contenue dans le mixin delete.js importé plus bas -->
            <v-btn color="primary" flat @click="supprimerDemande(numDem)" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import loading from 'vue-full-loading';
// import stepper from '@/components/utils/stepper.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';

export default {
  // Import du mixin contenant les méthodes suppression et de précédent
  mixins: [supprMixin],
  components: {
    loading,
    // stepper,
  },
  data() {
    return {
      json: '',
      listExemp: [],
      selected: '',
      active: false,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      user: {},
      loading: false,
      numDem: 0,
      popupDelete: false,
    };
  },
  mounted() {
    this.getListTraitements();
    // Récupération du numéro de demande courant depuis sessionStorage
    // Il est enregistré par rcr.vue lors de la création, ou depuis le tableau lorsque l'on clique sur une demande
    this.numDem = sessionStorage.getItem('dem');
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
          url: `${process.env.VUE_APP_ROOT_API}typeExemp`,
        }).then(
          (result) => {
            this.listExemp = result.data;
          },
          (error) => {
            this.alertMessage = constants.erreurListeExemp;
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
    selectType() {
      this.active = false;
      this.alert = false;
      let demande = {};
      this.loading = true;
      if (this.user !== null && this.user.jwt !== null) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url:
              `${process.env.VUE_APP_ROOT_API}demandes/${sessionStorage.getItem('dem')}?modif=false`,
        }).then(
          (result) => {
            demande = result.data;
            demande.typeExemp = this.selected;
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
        url: `${process.env.VUE_APP_ROOT_API}demandesExemp/${sessionStorage.getItem('dem')}`,
        data: demande,
      }).then(
        () => {
          this.alertMessage = 'Demande mise à jour.';
          this.alert = true;
          this.alertType = 'success';
          this.$router.replace({ name: 'fichierExemp' });
          this.loading = false;
        },
        (error) => {
          this.alertMessage = constants.erreurDemande;
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
