<template>
  <!-- PAGE DE SIMULATION -->
  <v-container fluid>
    <loading :show="loading" label="Chargement en cours..."></loading>
    <v-row justify="center" align="center">
      <v-col class="text-center">
        <!-- POPUP DE SUPPRESSION DE LA DEMANDE -->
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
              <v-btn color="primary" text @click="supprimerDemande(numDem, exauto)" aria-label="Confirmer">Confirmer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- POPUP DE LANCEMENT DU TRAITEMENT-->
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline" primary-title>Lancement du traitement en production</v-card-title>
            <v-card-text>Êtes-vous sûr de vouloir lancer le traitement en production ?<br/> Aucune annulation n'est possible.</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false" aria-label="Annuler">Annuler</v-btn>
              <v-btn color="primary" text @click="dialog = false, confirm()" aria-label="Valider">Valider</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
              <v-btn color="primary" text @click="dialog = false, $router.push({ name: 'home' })" aria-label="OK">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- FIL D'ARIANE -->
        <stepperModif v-if=this.exauto id="stepperModif" current="5" :numDemande="this.numDem"></stepperModif>
        <stepperExemp v-if=!this.exauto id="stepperExemp" current="4" :numDemande="this.numDem"></stepperExemp>
        <br>
        <!-- INFOS GENERALES DE LA DEMANDE -->
        <v-card id="demInfos" class="item-global-margin-bottom">
          <h3 style="padding-top: 15px; padding-left: 15px;" class="headline"><span
            class="item-break-words">Ma demande</span></h3>
          <v-container>
            <v-row>
              <v-col class="item-text-align-center item-break-words">
                <div>
                  <span>Numéro de Demande</span>
                  <br>
                  <span>{{ demande.numDemande }}</span>
                </div>
              </v-col>
              <v-col class="item-text-align-center item-break-words">
                <div>
                  <span>Date de modification</span>
                  <br>
                  <span>{{ demande.dateModification | formatDate }}</span>
                </div>
              </v-col>
              <v-col class="item-text-align-center item-break-words">
                <div>
                  <span>RCR</span>
                  <br>
                  <span>{{ demande.rcr }} - {{ demande.shortname }}</span>
                </div>
              </v-col>
              <v-col class="item-text-align-center item-break-words">
                <div>
                  <span>Type d'exemplarisation</span>
                  <br>
                  <span>{{ demande.typeExemp.libelle }}</span>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-alert :value="alert" :type="alertType" transition="scale-transition" dismissible>
          <span v-html="alertMessage"></span>
        </v-alert>
        <!-- CONTENU SIMULATION -->
        <v-card>
          <v-app-bar dark color="primary">
            <v-toolbar-title>Ecran de simulation</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- supprimerDemande(numDem) est importée depuis le mixin delete.js (voir plus bas) -->
            <v-btn depressed color="primary" @click="popupDelete = true" aria-label="Supprimer cette demande"><v-icon>delete</v-icon>Supprimer</v-btn>
          </v-app-bar>
          <!--TEMPLATE DE SIMULATION-->
          <v-container>
            <v-row no-gutters>
              <v-col :key="1" cols="12" sm="12">
                <!--Message de visualisation de la simulation-->
                <v-card flat>
                  <p>
                    Cet écran n'est qu'une visualisation du traitement.<br>
                    Les règles de validation ne sont pas prises en compte lors de cette simulation.<br>
                    Il s'agit de la dernière étape avant de lancer le traitement en base de
                    production.
                  </p>
                </v-card>
              </v-col>
              <v-col :key="2" cols="12" sm="12"> <!--Ligne du fichier-->
                <v-card class="pa-1" outlined tile>
                  <span class="headline mb-0" id="numLigne">Ligne de votre fichier : {{ noticeEnCours + 1 }} sur {{ numberLines }}</span>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col :key="1" cols="12" sm="12" md="5"> <!--Exemplaires existants-->
                <!--Carte grisée si absence d'exemplaires pour cette notice-->
                <v-card dark class="pa-1" outlined tile v-if="!exemplairesPresentsSurNoticeEnCours">
                  <span class="headline --text">Exemplaires existants</span>
                  <div class="notice">
                    <pre>Pas d'exemplaires pour cette notice avec ce RCR</pre>
                  </div>
                </v-card>
                <!--Carte activée si présence exemplaires pour cette notice-->
                <v-card class="pa-1" outlined tile v-if="exemplairesPresentsSurNoticeEnCours">
                  <span class="headline --text">Exemplaires existants</span>
                  <v-container id="scroll-target" style="max-height: 400px" class="overflow-y-auto">
                    <div class="notice">
                      <pre style="text-align: left; padding-top: 1em">
                        <span class="inner-pre">
{{ noticeAvant }}
                        </span>
                      </pre>
                    </div>
                  </v-container>
                </v-card>
              </v-col>
              <v-col :key="2" cols="12" sm="12" md="2"> <!--Boutons de navigation-->
                <!--Conteneur bouton 1-->
                <v-card flat class="item-vertical-padding">
                  <v-btn v-if="noticeEnCours === 0" color="disabled" depressed large dark
                         aria-label="Première notice" class="unhover">
                    <v-icon>first_page</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours > 0" color="success" large dark @click="getFirstSimu()"
                         aria-label="Première notice">
                    <v-icon>first_page</v-icon>
                  </v-btn>
                  <div>Première <br>notice</div>
                </v-card>
                <!--Conteneur bouton 2-->
                <v-card flat class="item-vertical-padding">
                  <v-btn v-if="noticeEnCours === 0" color="disabled" depressed large dark
                         aria-label="Notice précédente" class="unhover">
                    <v-icon>navigate_before</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours > 0" color="success" large dark
                         @click="getPreviousSimu()" aria-label="Notice précédente">
                    <v-icon>navigate_before</v-icon>
                  </v-btn>
                  <div>Notice <br>précédente</div>
                </v-card>
                <!--Conteneur bouton 3-->
                <v-card flat class="item-vertical-padding">
                  <v-btn v-if="noticeEnCours === numberLines - 1" color="disabled" depressed large
                         dark aria-label="Notice suivante" class="unhover">
                    <v-icon>navigate_next</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours !== numberLines - 1" color="success" large dark
                         @click="getNextSimu()" aria-label="Notice suivante">
                    <v-icon>navigate_next</v-icon>
                  </v-btn>
                  <div>Notice <br>suivante</div>
                </v-card>
                <!--Conteneur bouton 4-->
                <v-card flat class="item-vertical-padding">
                  <v-btn v-if="noticeEnCours === numberLines - 1" color="disabled" depressed large
                         dark aria-label="Dernière notice" class="unhover">
                    <v-icon>last_page</v-icon>
                  </v-btn>
                  <v-btn v-if="noticeEnCours !== numberLines - 1" color="success" large dark
                         @click="getLastSimu()" aria-label="Dernière notice">
                    <v-icon>last_page</v-icon>
                  </v-btn>
                  <div>Dernière <br>notice</div>
                </v-card>
              </v-col>
              <v-col v-if="autorisationExemplairesMultiples" :key="3" cols="12" sm="12" md="5"> <!--Exemplaire à créer-->
                <v-card class="pa-1" outlined tile>
                  <span class="headline --text">Exemplaire à créer</span>
                  <div class="notice">
                    <br>
                    <pre style="text-align: left; padding-top: 1em">
{{ noticeApres }}
                    </pre>
                  </div>
                </v-card>
              </v-col>
              <v-col v-else :key="3" cols="12" sm="12" md="5"> <!--Exemplaire à créer impossibles si exemplaires deja présents sur notice pour 1 rcr donné-->
                <v-card class="pa-1" outlined tile>
                  <span class="headline --text">Exemplaires à créer</span>
                  <div class="notice">
                    <br>
                    <p>Vous n'avez pas autorisé la création d'exemplaires multiples en
                      cas d'exemplaires déjà présents sur des notices pour ce rcr, à l'écran précédent.</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-row justify="end" id="layoutButtonOk" style="margin : 1em 0 0 0">
          <v-btn large color="info" @click="dialog = true"
                 aria-label="Lancer le traitement en production">Lancer le traitement en production
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import loading from 'vue-full-loading';
import axios from 'axios';
import moment from 'moment';
import stepperModif from '@/components/utils/stepperModif.vue';
import stepperExemp from '@/components/utils/stepperExemp.vue';
import supprMixin from '@/mixins/delete';
import constants from '@/components/utils/const';
import TYPEDEMANDE from '../enums/typeDemande';

export default {
  components: {
    loading,
    stepperModif,
    stepperExemp,
  },
  // Voilà le mixin en question
  mixins: [supprMixin],
  data() {
    return {
      noticeEnCours: 0,
      numberLines: 0,
      loading: false,
      demande: {
        typeExemp: {
          libelle: '',
        },
      },
      exauto: false,
      /* exauto a true pour modif de masse, false pour exauto */
      alertMessage: 'Erreur.',
      alertType: 'error',
      alert: false,
      user: {},
      noticeAvant: 'Exemplaire(s) existant(s) en cours de chargement...',
      noticeApres: 'Notice en cours de chargement...',
      dialog: false,
      dialogFinished: false,
      derniereNotice: false,
      numDem: 0,
      popupDelete: false,
      exemplairesPresentsSurNoticeEnCours: false,
      autorisationExemplairesMultiples: false,
    };
  },
  props: {
    // Modif de masse ou exemplarisation
    modif: {
      default: TYPEDEMANDE.DEMANDE_EXEMPLARISATION,
    },
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
        return moment(String(value)).format('DD/MM/YYYY à HH:mm');
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
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.numDem}?type=${this.modif}`,
      }).then(
        (result) => {
          this.demande = result.data;
          this.autorisationExemplairesMultiples = this.demande.exemplairesMultiplesAutorise;
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
        url: `${process.env.VUE_APP_ROOT_API}simulerLigne?type=${this.modif}&numDemande=${
          this.demande.numDemande
        }&numLigne=${this.noticeEnCours}`,
      }).then(
        (result) => {
          if (result.data[0] === '') {
            this.noticeAvant = 'Il n\'y a pas d\'exemplaires '
                + 'déjà existants pour cette notice sur ce RCR.';
          } else {
            this.noticeAvant = result.data[0]; // Exemplaires existants
          }
          if (result.data[1] === '') {
            this.noticeApres = 'Vous n\'avez pas autorisé la création d\'exemplaires en cas '
                + 'd\'exemplaires déja présents sur cette notice pour ce RCR, '
                + 'lors de l\'Etape précédente de cette Demande.';
          } else {
            this.noticeApres = result.data[1]; // Exemplaires à créer
          }

          // TODO corriger en back pour avoir un retour vide ou nul
          if (result.data[0] !== '\r\n') {
            this.exemplairesPresentsSurNoticeEnCours = true;
          }
          this.loading = false;
        },
        (error) => {
          this.noticeAvant = '';
          // this.noticeApres = '';
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
            this.alertMessage = "Vous êtes à la Dernière notice de votre demande, impossible d'aller plus loin.";
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
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}getNbLigneFichier/${this.numDem}?type=${this.modif}`,
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
        }&type=${this.modif}`,
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

<style scoped></style>
