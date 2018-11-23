<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex md7>
        <upload v-if="showForm" :loading="loading" format=".txt" v-on:upload="uploadFile"></upload>
        <v-card v-if="!showForm" class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Récupération du fichier de correspondances</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-flex align-center justify-center fill-height class="text-xs-center">
              <v-btn outline large color="indigo" ref="fileLinkBtn" :href="fileLink" :download="blobName">Télécharger le fichier de correspondances PPN/EPN <v-icon right dark>cloud_download</v-icon>
              </v-btn>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" v-on:click="$router.replace({ name: 'traitement' })">Suivant</v-btn>
          </v-card-actions>
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
// eslint-disable-next-line import/no-unresolved
import upload from '@/components/utils/upload.vue';

export default {
  name: 'uploadComponent',
  components: {
    upload,
  },
  data() {
    return {
      file: '',
      fileLink: '',
      blobName: 'fichier_demande.csv',
      showForm: true,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      loading: false,
      user: {},
    };
  },
  methods: {
    uploadFile(file) {
      this.loading = true;
      this.file = file;
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('numDemande', sessionStorage.getItem('dem'));

      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user !== null && this.user.jwt !== null) {
        axios
          .post(`${process.env.ROOT_API}uploadDemande`, formData, {
            headers: {
              Authorization: this.user.jwt,
              'Content-Type': 'multipart/form-data',
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
          `${process.env.ROOT_API
          }files/fichier_prepare_${
            sessionStorage.getItem('dem')
          }.csv?id=${
            sessionStorage.getItem('dem')}`,
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
            this.$refs.fileLinkBtn.click();
          },
          (error) => {
            this.alertMessage = 'Une erreur est survenue lors de la récupération du fichier enrichi. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
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
