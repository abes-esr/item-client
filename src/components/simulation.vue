<template>
  <!-- PAGE DE SIMULATION -->
  <v-container fluid>
    <loading :show="loading" label="Chargement en cours..."></loading>
    <v-layout justify-center align-center>
      <v-flex text-xs-center>
        <!-- POPUP DE LANCEMENT DU TRAITEMENT-->
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline red white--text" primary-title>Lancement du traitement en production</v-card-title>
            <v-card-text>Êtes-vous sûr de vouloir lancer le traitement en production ?<br /> Aucune annulation n'est possible.</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="dialog = false" aria-label="Annuler">Annuler</v-btn>
              <v-btn color="primary" flat @click="dialog = false, confirm()" aria-label="Valider">Valider</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- POPUP DE CONFIRMATION QUE LE TRAITEMENT EST LANCE -->
        <v-dialog v-model="dialogFinished" width="500">
          <v-card>
            <v-card-title class="headline green white--text" primary-title>Traitement validé</v-card-title>
            <v-card-text>Votre demande est en cours de traitement, elle sera traitée dès que possible.<br />Un mail vous sera envoyé une fois le traitement terminé.
              <br>Vous pouvez retrouver l'ensemble de vos demandes depuis la page "Gérer mes demandes".
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="dialog = false, $router.push({ name: 'tab' })" aria-label="OK">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- FIL D'ARIANE -->
        <stepper id="stepper" current="5"></stepper>
        <!-- INFOS GENERALES DE LA DEMANDE -->
        <v-card id="demInfos">
          <h3 style="padding-top: 15px; padding-left: 15px;" class="headline">Ma demande</h3>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">Numéro de Demande</span>
                  <br>
                  <span>{{ demande.numDemande }}</span>
                </div>
              </v-flex>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">Date de création</span>
                  <br>
                  <span>{{ demande.dateCreation |formatDate }}</span>
                </div>
              </v-flex>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">RCR</span>
                  <br>
                  <span>{{ demande.rcr }} - {{ demande.shortname }}</span>
                </div>
              </v-flex>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">Traitement</span>
                  <br>
                  <span>{{ demande.traitement.libelle }}</span>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-alert :value="alert" :type="alertType" transition="scale-transition" dismissible>
          <span v-html="alertMessage"></span>
        </v-alert>
        <!-- CONTENU SIMULATION -->
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Ecran de simulation</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <br />
          <span class="subheading">
            Cet écran n'est qu'une visualisation du traitement. <br />
            Les règles de validation ne sont pas prises en compte lors de cette simulation. <br />
            Il s'agit de la dernière étape avant de lancer le traitement en base de production.
          </span>
          <h3 class="headline mb-0" id="numLigne">Ligne de votre fichier : {{ noticeEnCours + 1 }} sur {{ numberLines }}</h3>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs5>
                <v-layout fill-height>
                  <v-card class="elevation-8">
                    <v-container fill-height fluid pa-2>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <span class="headline --text">Avant traitement</span>
                          <div class="notice">
                            <pre>{{ noticeAvant }}</pre>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-flex>
              <v-flex xs2>
                <v-layout align-center justify-center column fill-height>
                  <!--Bouton première notice-->
                  <v-btn v-if="noticeEnCours === 0" color="disabled" depressed fab large dark aria-label="Première notice" class="unhover">
                    <v-icon>first_page</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours > 0" color="success" fab large dark @click="getFirstSimu()" aria-label="Première notice">
                    <v-icon>first_page</v-icon>
                  </v-btn>
                  <span>Première notice</span>

                  <!--Bouton notice suivante-->
                  <v-btn v-if="noticeEnCours === 0" color="disabled" depressed fab large dark @click="getPreviousSimu()" aria-label="Notice précédente" class="unhover">
                    <v-icon>navigate_before</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours > 0" color="success" fab large dark @click="getPreviousSimu()" aria-label="Notice précédente">
                    <v-icon>navigate_before</v-icon>
                  </v-btn>
                  <span>Notice précedente</span>
                  <br>

                  <!--Bouton notice suivante-->
                  <v-btn v-if="noticeEnCours === numberLines - 1" color="disabled" depressed fab large dark @click="getNextSimu()" aria-label="Notice suivante" class="unhover">
                    <v-icon>navigate_next</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours !== numberLines - 1" color="success" fab large dark @click="getNextSimu()" aria-label="Notice suivante">
                    <v-icon>navigate_next</v-icon>
                  </v-btn>
                  <span>Notice suivante</span>

                  <!--Bouton dernière notice-->
                  <v-btn v-if="noticeEnCours !== numberLines - 1" color="success" fab large dark @click="getLastSimu()" aria-label="Dernière notice">
                    <v-icon>last_page</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours === numberLines - 1" color="disabled" depressed fab large dark aria-label="Dernière notice" class="unhover">
                    <v-icon>last_page</v-icon>
                  </v-btn>
                  <span>Dernière Notice</span>
                </v-layout>
              </v-flex>
              <v-flex xs5>
                <v-layout fill-height xs5>
                  <v-card class="elevation-8">
                    <v-container fill-height fluid pa-2>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <span class="headline --text">Après traitement</span>
                          <div class="notice">
                            <pre>{{ noticeApres }}</pre>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <br>
        <v-layout justify-end id="layoutButtonOk">
          <!-- supprimerDemande(numDem) est importée depuis le mixin delete.js (voir plus bas) -->
          <v-btn large color="error" @click="supprimerDemande(numDem)" aria-label="Supprimer cette demande">Supprimer cette demande</v-btn>
          <v-btn large color="info" @click="dialog = true" aria-label="Lancer le traitement en production">Lancer le traitement en production</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import loading from 'vue-full-loading';
import axios from 'axios';
import stepper from '@/components/utils/stepper.vue';
import supprMixin from '@/mixins/delete';
import moment from 'moment';
import constants from '@/components/utils/const';

export default {
  components: {
    loading,
    stepper,
  },
  // Voilà le mixin en question
  mixins: [supprMixin],
  data() {
    return {
      noticeEnCours: 0,
      numberLines: 0,
      loading: false,
      demande: {
        traitement: {
          libelle: '',
        },
      },
      alertMessage: 'Erreur.',
      alertType: 'error',
      alert: false,
      user: {},
      noticeAvant: 'Notice en cours de chargement...',
      noticeApres: 'Notice en cours de chargement...',
      dialog: false,
      dialogFinished: false,
      derniereNotice: false,
      numDem: 0,
    };
  },
  mounted() {
    // On récupère les infos utilisateur en session car on a besoin du jwt afin d'appeler les WS REST
    this.user = JSON.parse(sessionStorage.getItem('user'));
    // On récupère le numéro de la demande courante
    this.numDem = sessionStorage.getItem('dem');
    // On recupère des infos sur la demande
    this.getInfosDemande();
    // On compte le nombre de lignes totale sur le fichier
    this.getNumberLines();
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY à hh:mm');
      }
      return value;
    },
  },
  methods: {
    // Récupération des infos de la demande
    getInfosDemande() {
      this.loading = true;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.numDem}`,
      }).then(
        (result) => {
          this.demande = result.data;
          this.getSimulation();
        },
        (error) => {
          this.loading = false;
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = constants.erreur500;
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    // Récupération du AVANT / APRES
    getSimulation() {
      this.alert = false;
      this.loading = true;

      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}simulerLigne?numDemande=${
          this.demande.numDemande
        }&numLigne=${this.noticeEnCours}`,
      }).then(
        (result) => {
          this.noticeAvant = result.data[0];
          this.noticeApres = result.data[1];
          this.loading = false;
        },
        (error) => {
          this.noticeAvant = '';
          this.noticeApres = '';
          this.loading = false;
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = `Impossible de récupérer la notice pour la simulation : ${error.response.data.message}.  <br /> Veuillez réessayer ultérieurement. Si le problème persiste merci de contacter l'assistance.`;
          if (error.response.status === 401) {
            this.$emit('logout');
          } else if (error.response.status === 400 && error.response.data.message.includes('Numéro de notice erroné')
          ) {
            this.alert = true;
            this.alertType = 'warning';
            this.alertMessage = 'Numéro de notice exemplaire erronné.';
          } else if (error.response.status === 400 && error.response.data.message.includes('Fin du fichier')) {
            this.alert = true;
            this.alertType = 'info';
            this.alertMessage = "Vous êtes à la dernière notice de votre demande, impossible d'aller plus loin.";
            this.derniereNotice = true;
            this.noticeEnCours -= 1;
          }
        },
      );
    },
    getNextSimu() {
      this.noticeEnCours += 1;
      this.getSimulation();
    },
    getLastSimu() {
      this.noticeEnCours = this.numberLines - 1;
      this.getSimulation();
    },
    getPreviousSimu() {
      this.derniereNotice = false;
      if (this.noticeEnCours > 0) {
        this.noticeEnCours -= 1;
        this.getSimulation();
      } else {
        this.alert = true;
        this.alertMessage = "Vous êtes sur la première notice de votre demande, il n'y a pas de notice précedente.";
        this.alertType = 'info';
      }
    },
    getFirstSimu() {
      this.noticeEnCours = 0;
      this.getSimulation();
    },
    // Compte le nombre de lignes totales du fichier
    getNumberLines() {
      console.log(this.numDem);
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}getNbLigneFichier/${this.numDem}`,
      }).then(
        (result) => {
          this.numberLines = result.data;
        },
        (error) => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = 'Impossible de récupérer le nombre de lignes du fichier. Veuillez réessayer ultérieurement.';
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    // Lancement du traitement de la demande
    confirm() {
      this.alert = false;
      this.loading = true;

      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}passerEnAttente?numDemande=${
          this.demande.numDemande
        }`,
      }).then(
        () => {
          this.loading = false;
          this.dialogFinished = true;
        },
        (error) => {
          this.loading = false;
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = constants.erreur500;
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
  pre {
    text-align: left !important;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
  .v-card {
    width: 100%;
  }
  .notice {
    padding-top: 20px;
  }
  #demInfos {
    margin-bottom: 10px;
    text-align: left;
  }
  #numLigne {
    text-align: left !important;
    padding-top: 20px;
    padding-left: 20px;
  }
  #layoutButtonOk {
    padding-right: 8%;
  }
  .unhover{
    pointer-events: none;
  }
</style>
