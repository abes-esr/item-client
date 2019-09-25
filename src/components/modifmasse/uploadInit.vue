<template>
  <v-container class="fill-height" fluid >
    <loading :show="loading" label="Envoi en cours. Ce traitement peut prendre plusieurs minutes."></loading>
    <v-row align="center" justify="center">
      <v-col md="7">
        <stepper id="stepper" current="2"></stepper>
        <upload v-if="showForm" :loading="loading" :format=format :title=titleUpload :precedent="false" :text=textUpload v-on:upload="uploadFile" @precedent="precedentDemande(numDem)" @supprimer="supprimerDemande(numDem, true)"></upload>
        <v-card v-if="!showForm" class="elevation-12">
          <v-app-bar dark color="primary">
            <v-toolbar-title>Récupération du fichier de correspondances PPN / EPN</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="popupDelete = true"><v-icon>delete</v-icon>Supprimer</v-btn>
          </v-app-bar>
          <v-card-text>
            <v-col class="text-center align justify fill-height">
              <v-btn rounded large color="primary" ref="fileLinkBtn" @click="disabledButton = false;" :href="fileLink" :download="blobName">Télécharger le fichier de correspondances PPN/EPN <v-icon right dark>cloud_download</v-icon>
              </v-btn>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" v-on:click="precedentDemande(numDem, true); showForm = true;" aria-label="Annuler">Précédent</v-btn>
            <v-btn color="info" :disabled="disabledButton" v-on:click="$router.replace({ name: 'traitement' })" aria-label="Suivant">Suivant</v-btn>
          </v-card-actions>
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
            <v-btn color="primary" text @click="supprimerDemande(numDem, true)" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import loading from 'vue-full-loading';
import upload from '@/components/utils/upload.vue';
import stepper from '@/components/utils/stepper.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';

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
      textUpload: 'Cliquez pour charger votre liste de PPN (fichier PPN sur une colonne, format .txt ou .csv obligatoire)',
      titleUpload: '',
      disabledButton: true,
      popupDelete: false,
      exauto: false,
    };
  },
  // Récupération des infos utilisateur et du numéro de demande en session
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.numDem = sessionStorage.getItem('dem');
    // Ajout du numéro de RCR dans le header de la card
    this.setTitleUploadWithRcr();
  },
  methods: {
    setTitleUploadWithRcr() {
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.numDem}?modif=false`,
      }).then(
        (result) => { // L'objet result contient le numero de RCR, qui n'est pas accessible via sessionStorage
          console.log(result.data);
          this.exauto = true;
        },
      );
    },
    // Upload du fichier PPN
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
    // Récupération du fichier de correspondance PPN / EPN
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
            // On met le fichier récupéré dans la mémoire locale du navigateur afin que l'utilisateur puisse le récupérer instantannément
            this.loading = false;
            const blob = new Blob([result.data], { type: 'application/csv' });
            this.fileLink = window.URL.createObjectURL(blob);
            this.blobName = `fichier_demande_${this.numDem}.csv`;
            // TODO : Autoclick pour lancer le téléchargement ?
            // this.$refs.fileLinkBtn.$el.click();
          },
          (error) => {
            this.alertMessage = constants.erreurDownload;
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
