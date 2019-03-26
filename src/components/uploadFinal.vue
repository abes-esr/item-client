<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex md7>
        <stepper id="stepper" current="4"></stepper>
        <upload :loading="loading" :format=format :title=titleUpload :text=textUpload v-on:upload="uploadFile" @precedent="precedentDemande(numDem)"></upload>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import upload from '@/components/utils/upload.vue';
import stepper from '@/components/utils/stepper.vue';
import supprMixin from '@/mixins/delete';

export default {
  name: 'uploadComponent',
  mixins: [supprMixin],
  components: {
    upload,
    stepper,
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
      numDem: 0,
      titleUpload: 'Envoyer le fichier complété de la zone d\'exemplaire à traiter',
      textUpload: 'Cliquez ou faites glisser ici<br />pour charger votre fichier complété<br />(format txt ou csv)',
    };
  },
  created() {
    this.numDem = sessionStorage.getItem('dem');
  },
  methods: {
    uploadFile(file) {
      this.loading = true;
      this.file = file;
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('numDemande', this.numDem);

      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user !== null && this.user.jwt !== null) {
        axios
          .post(`${process.env.VUE_APP_ROOT_API}uploadDemande`, formData, {
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
