<template>
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col md="7">
        <steppermodif class="item-stepper-bottom-margin" current="4" v-if="modif === 'MODIF'" :numDemande="this.numDem.toString()" :modif="this.modif" :choixTraitement="this.typeTraitementChoisi"></steppermodif>
        <stepperexemp class="item-stepper-bottom-margin" current="3" v-if="modif === 'EXEMP'" :numDemande="this.numDem.toString()" :typeExemplarisation="typeDemandeChoisi" :modif="this.modif"></stepperexemp>
        <stepperrecouv class="item-stepper-bottom-margin" current="2" v-if="modif === 'RECOUV'" :numDemande="this.numDem.toString()" :modif="this.modif"></stepperrecouv>
        <upload :modif="modif" :loading="loading" :format=format :precedent="true" :title=titleUpload :text=textUpload @upload="uploadFile" @precedent="precedentDemande(numDem, modif)" @supprimer="supprimerDemande(numDem, modif)" @eventName="updateParent"></upload>
          <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span></v-alert>
      </v-col>
    </v-row>
    <!-- POPUP DE CONFIRMATION QUE LE TRAITEMENT EST LANCE -->
    <v-dialog v-model="dialogFinished" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>Traitement validé</v-card-title>
        <v-card-text>Votre demande est en cours de traitement, elle sera traitée dès que
          possible.<br/>Un mail vous sera envoyé une fois le traitement terminé.
          <br>Vous pouvez retrouver l'ensemble de vos demandes depuis la page "Gérer mes
          demandes".
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="turnOffPopup()" aria-label="OK">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import upload from '@/components/utils/upload.vue';
import steppermodif from '@/components/utils/stepperModif.vue';
import stepperexemp from '@/components/utils/stepperExemp.vue';
import stepperrecouv from '@/components/utils/stepperRecouv.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';
import TYPEDEMANDE from '../enums/typeDemande';

export default {
  name: 'uploadComponent',
  // Mixin contenant les fonctions de suppression et de retour arrière
  mixins: [supprMixin],
  components: {
    upload,
    steppermodif,
    stepperexemp,
    stepperrecouv,
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
      titleUpload: 'Charger le fichier des exemplaires à traiter',
      textUpload: 'Cliquez pour charger votre fichier complété (format .txt ou .csv obligatoire)',
      exemplairesMultiplesParent: false,
      codePebParent: '',
      dialog: false,
      dialogFinished: false,
      typeDemandeChoisi: '',
      typeTraitementChoisi: '',
    };
  },
  props: {
    // Modif de masse ou exemplarisation
    modif: {
      default: TYPEDEMANDE.DEMANDE_MODIFICATION,
    },
    choixTraitement: {
      default: 'à effectuer',
    },
  },
  // On récupère le numéro de demande enregistré en session
  mounted() {
    // On récupère les infos utilisateur en session car on a besoin du jwt afin d'appeler les WS REST
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.numDem = sessionStorage.getItem('dem');
    this.getTypeExemplarisation(this.numDem);
    this.getTypeTraitementChoisi(this.numDem);
  },
  methods: {
    // recuperation du type d'exemplarisation prealablement choisi
    getTypeExemplarisation(numDemande) {
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}getTypeExemplarisationDemande/${numDemande}`,
      }).then(
        (result) => {
          this.typeDemandeChoisi = result.data;
        },
        (error) => {
          this.loading = false;
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = `Impossible de récupérer le type d'exemplarisation pour la demande : ${error.response.data.message}.  <br /> Veuillez réessayer ultérieurement. Si le problème persiste merci de contacter l'assistance.`;
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    // recuperation du type de choix de traiement choisi pour une demande de modification
    getTypeTraitementChoisi(numDemande) {
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}traitementFromDemande/${numDemande}`,
      }).then(
        (result) => {
          switch (result.data) {
            case 1: this.typeTraitementChoisi = 'Création nouvelle zone'; break;
            case 2: this.typeTraitementChoisi = 'Création sous-zone'; break;
            case 3: this.typeTraitementChoisi = 'Remplacer sous-zone'; break;
            case 4: this.typeTraitementChoisi = 'Supprimer sous-zone'; break;
            case 5: this.typeTraitementChoisi = 'Supprimer zone'; break;
            default: this.typeTraitementChoisi = 'inconnu'; break;
          }
        },
        (error) => {
          this.loading = false;
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = `Impossible de récupérer le type d'exemplarisation pour la demande : ${error.response.data.message}.  <br /> Veuillez réessayer ultérieurement. Si le problème persiste merci de contacter l'assistance.`;
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
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
          .post(`${process.env.VUE_APP_ROOT_API}uploadDemande?type=${this.modif}&exempMulti=${this.exemplairesMultiplesParent}&codePeb=${this.codePebParent}`, formData, {
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
              switch (this.modif) {
                case 'MODIF': this.$router.replace({ name: 'simulation' }); break;
                case 'RECOUV': this.dialogFinished = true; break;
                case 'EXEMP': this.$router.replace({ name: 'simulationTest' }); break;
                default: this.$router.replace({ name: 'home' });
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
    turnOffPopup() {
      this.dialogFinished = false;
      this.$router.replace({ name: 'home' });
    },
    updateParent(variable, variable2) {
      this.exemplairesMultiplesParent = variable;
      this.codePebParent = variable2;
    },
  },
};
</script>
