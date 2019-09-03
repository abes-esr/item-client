<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex md7>
        <stepper class="stepper" current="4" v-if="modif"></stepper>
        <stepperexemp class="stepper" current="4" v-if="!modif"></stepperexemp>
        <upload :value="value" :loading="loading" :format=format :precedent="true" :title=titleUpload :text=textUpload v-on:upload="uploadFile"
                @precedent="precedentDemande(numDem)" @supprimer="supprimerDemande(numDem)" @eventName="updateParent"></upload>
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
import stepper from '@/components/utils/stepperModif.vue';
import stepperexemp from '@/components/utils/stepperExemp.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';

export default {
  name: 'uploadComponent',
  // Mixin contenant les fonctions de suppression et de retour arrière
  mixins: [supprMixin],
  components: {
    upload,
    stepper,
    stepperexemp,
  },
  data() {
    return {
      file: '',
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      loading: false,
      user: {},
      format: ['csv', 'txt'],
      numDem: 0,
      titleUpload: 'Envoyer le fichier complété de la zone d\'exemplaire à traiter',
      textUpload: 'Cliquez ou faites glisser ici<br />pour charger votre fichier complété<br />(format .txt ou .csv obligatoire)',
      exemplairesMultiplesParent: false,
    };
  },
  props: {
    // Modif de masse ou exemplarisation
    modif: {
      default: true,
    },
  },
  // On récupère le numéro de demande enregistré en session
  created() {
    this.numDem = sessionStorage.getItem('dem');
  },
  methods: {
    // Upload du fichier enrichi
    uploadFile(file) {
      this.loading = true;
      this.file = file;
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('numDemande', this.numDem);
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user !== null && this.user.jwt !== null) {
        axios
          .post(`${process.env.VUE_APP_ROOT_API}uploadDemande?modif=${this.modif}&exempMulti=${this.exemplairesMultiplesParent}`, formData, {
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
              this.$router.replace({ name: 'simulationTest' });
            },
            (error) => {
              this.alertMessage = constants.erreurUpload;
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
        this.alertMessage = constants.erreur500;
        this.alertType = 'error';
        this.alert = true;
        this.loading = false;
      }
    },
    updateParent(variable) {
      this.exemplairesMultiplesParent = variable;
    },
  },
};
</script>
