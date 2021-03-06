<template>
  <!-- SELECTION DU RCR -->
  <v-container class="fill-height" fluid >
    <v-row justify="center" align="center">
      <loading :show="show" :label="label"></loading>
      <v-col md="7">
        <steppermodif class="item-stepper-bottom-margin" current="1" v-if="modif === 'MODIF'" :choixTraitement="this.choixTraitement"></steppermodif>
        <stepperexemp class="item-stepper-bottom-margin" current="1" v-if="modif === 'EXEMP'"></stepperexemp>
        <stepperrecouv class="item-stepper-bottom-margin" current="1" v-if="modif === 'RECOUV'"></stepperrecouv>
        <v-card class="elevation-12">
          <v-app-bar dark color="primary">
            <v-toolbar-title>Sélection du RCR</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>
          <v-card-text>
            <v-autocomplete
              color="info"
              hide-selected
              :filter="searchRCR"
              v-model="selected"
              :items="listRcr"
              item-value="rcr"
              item-text="name"
              label="Sélectionnez votre RCR dans la liste"
              no-data-text="Aucun RCR correspondant."
              hint="Saisissez le début du RCR de l'établissement ou une partie de son intitulé."
              persistent-hint
              @change="checkActive"
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" :disabled="!active" v-on:click="selectRCR">Valider</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-alert :value="alert" :type="alertType" transition="scale-transition">
          <span v-html="alertMessage"></span>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import loading from 'vue-full-loading';
import constants from '@/components/utils/const';
import steppermodif from '@/components/utils/stepperModif.vue';
import stepperexemp from '@/components/utils/stepperExemp.vue';
import stepperrecouv from '@/components/utils/stepperRecouv.vue';
import TYPEDEMANDE from '../enums/typeDemande';

export default {
  name: 'Rcr',
  components: {
    loading,
    steppermodif,
    stepperexemp,
    stepperrecouv,
  },
  data() {
    return {
      json: '',
      listRcr: [],
      selected: '',
      active: false,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      show: false,
      user: {},
      label: 'Initialisation de la demande en cours...',
      isEditing: false,
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
  mounted() {
    // On récupère les infos utilisateur en session car on a besoin du jwt afin d'appeler les WS REST
    this.user = JSON.parse(sessionStorage.getItem('user'));

    // Appel d'un WS IDRef qui liste les RCR de notre ILN
    if (this.user !== null && this.user.jwt !== null) {
      axios({
        method: 'GET',
        url:
            `https://www.idref.fr/services/iln2rcr/${
              this.user.iln
            }&format=text/json`,
      }).then(
        (result) => {
          this.json = result.data.sudoc.query.result;
          let item;
          if (Array.isArray(this.json)) {
            for (const key in this.json) {
              item = {
                rcr: this.json[key].library.rcr,
                name:
                    `${this.json[key].library.rcr
                    } - ${
                      this.json[key].library.shortname}`,
                shortname: this.json[key].library.shortname,
              };
              this.listRcr.push(item);
            }
          } else {
            // Cette partie du code permet de contourner un bug du WS iln2rcr
            // S'il n'y a qu'un seul résultat il ne revoi pas un tableau d'une seule cas, mais le résultat brut
            // Lorsque ce sera ocrrigé, il suffira de supprimer ce if/else
            item = {
              rcr: this.json.library.rcr,
              name:
                    `${this.json.library.rcr
                    } - ${
                      this.json.library.shortname}`,
              shortname: this.json.library.shortname,
            };
            this.listRcr.push(item);
          }
        },
        () => {
          this.alertMessage = constants.erreur500;
          this.alert = true;
          this.alertType = 'error';
        },
      );
    }
  },
  methods: {
    // Crée la demande associée au RCR que l'utilisateur vient de séléctionner
    selectRCR() {
      if (this.user !== null && this.user.jwt !== null) {
        this.active = false;
        this.show = true;
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url:
              `${process.env.VUE_APP_ROOT_API
              }creerdemande?rcr=${
                this.selected
              }&userNum=${
                this.user.userNum}
                &type=${this.modif}`,
        }).then(
          (result) => {
            // On stocke le numéro de la demande en session, utilisé par d'autres composants
            sessionStorage.setItem('dem', result.data.numDemande);
            // Passage à l'étape suivante
            switch (this.modif) {
              case TYPEDEMANDE.DEMANDE_MODIFICATION:
                // Passage etape 2 : upload du fichier de ppn en modification
                this.$router.replace({ name: 'uploadModif' });
                break;
              case TYPEDEMANDE.DEMANDE_EXEMPLARISATION:
                // Passage etape 2 : choix du type d'exemplarisation
                this.$router.replace({ name: 'type' });
                break;
              case TYPEDEMANDE.DEMANDE_RECOUVREMENT:
                this.$router.replace({ name: 'uploadRecouv' });
                break;
              default:
                this.$router.replace({ name: 'home' });
            }
          },
          (error) => {
            this.alertMessage = constants.erreur500;
            this.alert = true;
            this.alertType = 'error';
            this.show = false;
            this.active = true;

            if (error.response.status === 401) {
              // Si 401 (token jwt invalide ou expiré) on fait remonter aux composants parents l'evenement "logout" afin d'afficher la popup de déconnexion et vider la session
              // C'est le composant principal (App.vue) qui s'en occupe
              this.$emit('logout');
            }
          },
        );
      }
    },
    // Autocomplétion des RCR disponibles lorsque l'utilsateur commence à saisir
    searchRCR(item, queryText) {
      return (
        // On filtre sur le numéro et le nom du RCR
        item.rcr.startsWith(queryText)
          || item.shortname.toLowerCase().includes(queryText.toLowerCase())
      );
    },
    // Active le bouton valider uniquement lorsque l'utilisateur a séléctionné un RCR (selected)
    checkActive(selected) {
      if (selected !== null && selected !== '') {
        this.active = true;
      } else {
        this.active = false;
      }
    },
  },
};
</script>

<style scoped></style>
