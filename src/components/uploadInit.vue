<template>
  <v-container fluid fill-height>
    <loading :show="loading" label="Chargement en cours..."></loading>
    <v-layout align-center justify-center>
      <v-flex md7>
        <stepper id="stepper" current="2"></stepper>
        <upload v-if="showForm" :loading="loading" :format=format :title=titleUpload :precedent="false" :text=textUpload v-on:upload="uploadFile" @precedent="precedentDemande(numDem)" @supprimer="supprimerDemande(numDem)"></upload>
        <v-card v-if="!showForm" class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Récupération du fichier de correspondances PPN / EPN</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat @click="popupDelete = true"><v-icon>delete</v-icon>Supprimer</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-flex align-center justify-center fill-height class="text-xs-center">
              <v-btn outline large color="secondary" ref="fileLinkBtn" @click="disabledButton = false;" :href="fileLink" :download="blobName">Télécharger le fichier de correspondances PPN/EPN <v-icon right dark>cloud_download</v-icon>
              </v-btn>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" v-on:click="precedentDemande(numDem); showForm = true;" aria-label="Annuler">Précédent</v-btn>
            <v-btn color="info" :disabled="disabledButton" v-on:click="$router.replace({ name: 'traitement' })" aria-label="Suivant">Suivant</v-btn>
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
import upload from '@/components/utils/upload.vue';
import stepper from '@/components/utils/stepper.vue';
import supprMixin from '@/mixins/delete';

export default {
  name: 'uploadComponent',
  mixins: [supprMixin],
  components: {
    upload,
    stepper,
    loading,
  },
  data() {
    return {
      numDem: 0,
      numRcr: 0,
      file: '',
      fileLink: '',
      blobName: 'fichier_demande.csv',
      showForm: true,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      loading: false,
      user: {},
      format: ['txt', 'csv'],
      textUpload: 'Cliquez ou faites glisser ici<br />pour charger votre liste de PPN<br />(fichier PPN sur une colonne, format txt ou csv)',
      titleUpload: '',
      disabledButton: true,
      popupDelete: false,
    };
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.numDem = sessionStorage.getItem('dem');
    this.setTitleUploadWithRcr();
  },
  methods: {
    setTitleUploadWithRcr() {
      this.loading = true;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.numDem}`,
      }).then(
        (result) => { // L'objet result contient le numero de RCR, qui n'est pas accessible via sessionStorage
          this.titleUpload = `RCR n°${result.data.rcr} : obtenir correspondance PPN / EPN`;
        },
      );
    },
    uploadFile(file) {
      this.loading = true;
      this.file = file;
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('numDemande', this.numDem);

      if (this.user !== null && this.user.jwt !== null) {
        axios
          .post(`${process.env.VUE_APP_ROOT_API}uploadDemande`, formData, {
            headers: {
              Authorization: this.user.jwt,
              'Content-Type': 'multipart/form-data',
              charset: 'utf-8',
            },
          })
          .then(
            () => {
              this.alertMessage = 'Fichier envoyé.';
              this.alertType = 'success';
              this.alert = true;
              this.showForm = false;
              this.getFileResult();
            },
            (error) => {
              this.alertMessage = "Une erreur est survenue lors de l'envoi du fichier. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
              this.alertType = 'error';
              this.alert = true;
              this.loading = false;

              if (error.response.status === 400) {
                this.alertMessage = error.response.data.message;
              }

              if (error.response.status === 401) {
                this.$emit('logout');
              }
            },
          );
      } else {
        this.alertMessage = 'Une erreur est survenue. Essayez de vous déconnecter puis reconnecter. <br /> Si le problème persiste merci de nous contacter.';
        this.alertType = 'error';
        this.alert = true;
        this.loading = false;
      }
    },
    getFileResult() {
      axios
        .get(
          `${process.env.VUE_APP_ROOT_API
          }files/fichier_prepare_${
            this.numDem
          }.csv?id=${
            this.numDem}`,
          {
            headers: {
              Authorization: this.user.jwt,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then(
          (result) => {
            this.loading = false;
            const blob = new Blob([result.data], { type: 'application/csv' });
            this.fileLink = window.URL.createObjectURL(blob);
            this.blobName = `fichier_demande_${this.numDem}.csv`;
            // TODO : Réparer ça
            // this.$refs.fileLinkBtn.$el.click();
          },
          (error) => {
            this.alertMessage = 'Une erreur est survenue lors de la récupération du fichier. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
            this.alertType = 'error';
            this.alert = true;
            this.loading = false;

            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
    },
  },
};
</script>
