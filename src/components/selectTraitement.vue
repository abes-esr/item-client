<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <loading :show="loading" label="Chargement en cours..."></loading>
      <v-flex md5 id="flexBox">
        <stepper id="stepper" current="3"></stepper>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Choix du type de traitement</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <!--
            <v-select v-model="selected" :items="listTraitements" item-value="numTraitement" item-text="libelle" label="Séléctionnez le traitement dans la liste" no-data-text="Aucun traitement trouvé." @change="active = true;">
            </v-select> -->
            <v-card raised hover v-for="traitement in listTraitements" :key="traitement.numTraitement" @click="selected=traitement; selectTraitement();" height="7.8em">
                    <v-card-title primary-title>
                        <v-container grid-list-md>
                            <v-layout row wrap align-center>
                                <v-flex xs2>
                                    <span class="group pa-3 secondary" style="height: 4.2em">
                                        <v-icon v-if="traitement.numTraitement == 1" x-large dark>add</v-icon>
                                        <v-icon v-else-if="traitement.numTraitement == 2" x-large dark>redo</v-icon>
                                        <v-icon v-else-if="traitement.numTraitement == 3" x-large dark>edit</v-icon>
                                        <v-icon v-else-if="traitement.numTraitement == 4" x-large dark>clear</v-icon>
                                        <v-icon v-else-if="traitement.numTraitement == 5" x-large dark>delete</v-icon>
                                        <v-icon v-else x-large dark>edit</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex xs6 ml-4>
                                    <h3 class="headline">{{ traitement.libelle }}</h3>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-title>
                </v-card>
          </v-card-text>
          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" :disabled="!active" v-on:click="selectTraitement()">Valider</v-btn>
          </v-card-actions> -->
        </v-card>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import loading from 'vue-full-loading';
import stepper from '@/components/utils/stepper.vue';

export default {
  components: {
    loading,
    stepper,
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
    };
  },
  mounted() {
    this.getListTraitements();
  },
  methods: {
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
            this.alertMessage = 'Impossible de récupérer la liste des traitements. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
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
            this.alertMessage = "Impossible de récupérer la demande en cours d'édition. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
            this.alert = true;
            this.alertType = 'error';
            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
    },
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
          this.alertMessage = 'Impossible de mettre à jour la demande. <br /> Si le problème persiste merci de nous contacter.';
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
