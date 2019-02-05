<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex md7>
        <upload :loading="loading" :format=format :title=titleUpload :text=textUpload v-on:upload="uploadFile"></upload>
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
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      loading: false,
      user: {},
      format: ['csv'],
      titleUpload: 'Envoyer le fichier complété de la zone d\'exemplaire à traiter',
      textUpload: 'Cliquez ou faites glisser ici<br />pour charger votre fichier complété<br />(format txt ou csv)',
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
              this.loading = false;
              this.$router.replace({ name: 'simulation' });
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
  },
};
</script>
