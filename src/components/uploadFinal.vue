<template>
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col md="7">
        <stepper class="item-stepper-bottom-margin" current="3" v-if="modif"></stepper>
        <stepperexemp class="item-stepper-bottom-margin" current="3" v-if="!modif"></stepperexemp>
        <!--modif : true, exemp :false-->
        <upload :modif="modif" :loading="loading" :format=format :precedent="true" :title=titleUpload :text=textUpload v-on:upload="uploadFile" @precedent="precedentDemande(numDem, modif)" @supprimer="supprimerDemande(numDem, modif)" @eventName="updateParent"></upload>
          <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
      </v-col>
    </v-row>
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
      textUpload: 'Cliquez pour charger votre fichier complété (format .txt ou .csv obligatoire)',
      exemplairesMultiplesParent: false,
      codePebParent: '',
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
          .post(`${process.env.VUE_APP_ROOT_API}uploadDemande?modif=${this.modif}&exempMulti=${this.exemplairesMultiplesParent}&codePeb=${this.codePebParent}`, formData, {
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
              if (this.modif) {
                this.$router.replace({ name: 'simulation' });
              } else {
                this.$router.replace({ name: 'simulationTest' });
              }
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
    updateParent(variable, variable2) {
      this.exemplairesMultiplesParent = variable;
      this.codePebParent = variable2;
    },
  },
};
</script>
