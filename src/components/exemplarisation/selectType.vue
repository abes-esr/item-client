<template>
  <v-container class="item-vertical-center-element">
    <v-row   justify="center">
      <loading :show="loading" label="Chargement en cours..."></loading>
      <v-col cols="8">
        <!-- TODO : METTRE LE BON STEPPER UNE FOIS FAIT -->
        <!-- <stepper id="stepper" current="3"></stepper> -->
      </v-col>
      <v-col md="5" id="flexBox">
      <v-flex xs8>
        <stepper class="stepper" current="2" stepperExemp=false></stepper>
      </v-flex>
      <v-flex md5 id="flexBox">
        <v-card class="elevation-12">
          <v-app-bar dark color="primary">
            <v-toolbar-title>Choix du type d'exemplarisation</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn depressed @click="popupDelete = true" color="primary"><v-icon>delete</v-icon>Supprimer</v-btn>
          </v-app-bar>
          <v-card-text>
            <v-card v-for="exemp in listExemp" :key="exemp.numTypeExemp" @click="selected=exemp; selectType();" class="item-global-margin-bottom">
                    <v-card-title primary-title>
                        <v-container>
                            <v-row   align="center">
                                <v-col cols="2">
                                    <span class="group pa-3 secondary" style="height: 4.2em">
                                        <v-icon v-if="exemp.numTypeExemp == 1" x-large dark>chrome_reader_mode</v-icon>
                                        <v-icon v-else-if="exemp.numTypeExemp == 2" x-large dark>library_books</v-icon>
                                        <v-icon v-else x-large dark>import_contacts</v-icon>
                                    </span>
                                </v-col>
                                <v-col class="ml-4" cols="6" >
                                    <h3 class="headline">{{ exemp.libelle }}</h3>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-title>
                </v-card>
          </v-card-text>
          <!--<v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" v-on:click="precedentDemande(numDem, false)">Précédent</v-btn>
          </v-card-actions>-->
        </v-card>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
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
            <v-btn color="primary" text @click="supprimerDemande(numDem, false)" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import loading from 'vue-full-loading';
import stepper from '@/components/utils/stepperExemp.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';

export default {
  // Import du mixin contenant les méthodes suppression et de précédent
  mixins: [supprMixin],
  components: {
    loading,
    stepper,
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
  props: {
    // Modif de masse ou exemplarisation
    modif: {
      default: false,
    },
  },
  mounted() {
    this.getListTypeExemp();
    // Récupération du numéro de demande courant depuis sessionStorage
    // Il est enregistré par rcr.vue lors de la création, ou depuis le tableau lorsque l'on clique sur une demande
    this.numDem = sessionStorage.getItem('dem');
  },
  methods: {
    // Récupère la liste des traitements afin de les afficher
    getListTypeExemp() {
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
        method: 'POST',
        url: `${process.env.VUE_APP_ROOT_API}majTypeExemp/${sessionStorage.getItem('dem')}`,
        data: demande.typeExemp,
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

<style scoped src="../../assets/global.css">
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
