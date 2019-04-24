<template>
  <v-container fluid>
    <v-layout justify-center align-center>
      <v-flex text-xs-center>
        <v-alert :value="alert" :type="alertType" dismissible transition="scale-transition">
          <span v-html="alertMessage"></span>
        </v-alert>
        <v-card>
          <v-card-title v-if="archive" class="title">Mes demandes archivées</v-card-title>
          <v-card-title v-else class="title">Gérer mes demandes</v-card-title>
          <v-data-table
            :loading="tableLoading"
            :headers="headers"
            :items="computedItems('guess')"
            rows-per-page-text="Lignes par page"
            :pagination.sync="pagination"
            no-data-text="Aucune demande"
            class="elevation-1"
            item-key="num"
            :rows-per-page-items='[10,25, {"text":"Toutes","value":-1}]'
          >
            <template slot="headers" slot-scope="props">
              <tr>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
              <tr>
                <th></th>
                <th class="smallTD">
                  <v-text-field
                    v-model="searchNum"
                    aria-label="Recherche par numéro"
                    append-icon="search"
                    single-line
                    hide-details
                    clearable
                    v-on:keyup="computedItems('num')"
                  ></v-text-field>
                </th>
                <th class="smallTD">
                  <v-menu
                    :close-on-content-click="false"
                    v-model="menu"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="searchDateCreation"
                      aria-label="Recherche par date"
                      prepend-icon="event"
                      append-icon="search"
                      clearable
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="searchDateCreation"
                      @input="menu = false"
                      locale="fr-fr"
                      first-day-of-week="1"
                      no-title
                      scrollable
                      @change="computedItems('dateCreation')"
                    >
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false" aria-label="Annuler">Annuler</v-btn>
                    </v-date-picker>
                  </v-menu>
                </th>
                <th class="smallTD">
                  <v-menu
                    :close-on-content-click="false"
                    v-model="calendar2"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="searchDateModification"
                      aria-label="Recherche par date"
                      prepend-icon="event"
                      append-icon="search"
                      clearable
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="searchDateModification"
                      @input="calendar2 = false"
                      locale="fr-fr"
                      first-day-of-week="1"
                      no-title
                      scrollable
                      @change="computedItems('dateModification')"
                    >
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="calendar2 = false" aria-label="Annuler">Annuler</v-btn>
                    </v-date-picker>
                  </v-menu>
                </th>
                <th v-if="user.role == 'ADMIN'" class="smallTD">
                   <v-text-field
                    v-model="searchILN"
                    aria-label="Recherche par ILN"
                    append-icon="search"
                    single-line
                    hide-details
                    clearable
                    v-on:keyup="computedItems('iln')"
                  ></v-text-field>
                </th>
                <th>
                  <v-text-field
                    v-model="searchRCR"
                    append-icon="search"
                    aria-label="Recherche par RCR"
                    single-line
                    hide-details
                    clearable
                    v-on:keyup="computedItems('rcr')"
                  ></v-text-field>
                </th>
                <th>
                  <v-select
                    v-model="searchTraitement"
                    :items="listTraitements"
                    aria-label="Recherche par type de traitement"
                    item-value="libelle"
                    item-text="libelle"
                    no-data-text="Aucun traitement trouvé."
                    @change="computedItems('traitement')"
                    clearable
                  ></v-select>
                </th>
                <th v-if="!archive" class="smallTD">
                  <v-select
                    v-model="searchStatut"
                    aria-label="Recherche par statut"
                    :items="listStatut"
                    no-data-text="Aucun statut trouvé."
                    @change="computedItems('statut')"
                    clearable
                  ></v-select>
                </th>
                <th></th>
                <th v-if="!archive"></th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <td @click="props.expanded = !props.expanded; tableExpanded = props.expanded;">
                <v-icon v-if="props.expanded">keyboard_arrow_up</v-icon>
                <v-icon v-else>keyboard_arrow_down</v-icon>
              </td>
              <td
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.num }}</td>
              <td
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.dateCreation | formatDate }}</td>
              <td
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.dateModification | formatDate }}</td>
              <td
                v-if="user.role == 'ADMIN'"
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.iln }}</td>
              <td
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.rcr }}</td>
              <td
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.traitement }}</td>
              <td
                class="text-xs-left"
                @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)"
              >{{ props.item.statut }}</td>
              <td class="text-xs-center">
                <v-menu bottom left v-if="props.item.codeStatut >= 2">
                  <v-btn slot="activator" color="info" small aria-label="Télécharger les fichiers">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                  <v-list v-if="props.item.codeStatut >= 3">
                    <v-list-tile @click="downloadFile(props.item.num, 'ppn')">
                      <v-list-tile-title>Télécharger le fichier initial des PPN</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="downloadFile(props.item.num, 'epn')">
                      <v-list-tile-title>Télécharger le fichier de correspondance PPN/EPN</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click="downloadFile(props.item.num, 'enrichi')"
                      v-if="props.item.codeStatut >= 4"
                    >
                      <v-list-tile-title>Télécharger le fichier enrichi</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click="downloadFile(props.item.num, 'resultat')"
                      v-if="props.item.codeStatut >= 7"
                    >
                      <v-list-tile-title>Télécharger le fichier résultat</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <span v-if="props.item.codeStatut == 1">
                  <v-btn slot="activator" color="info" aria-label="Téléchargement impossible" small disabled>
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                </span>
              </td>
              <td v-if="!archive" class="text-xs-center">
                <span v-if="props.item.codeStatut < 5 && user.iln == props.item.iln">
                  <v-btn icon @click="current = props.item.num; popupDelete = true;" aria-label="Supprimer">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </span>
                <span v-else-if="props.item.codeStatut == 7 && user.iln == props.item.iln">
                  <v-btn icon @click="current = props.item.num; popupArchive = true;" aria-label="Supprimer">
                    <v-icon>archive</v-icon>
                  </v-btn>
                </span>
              </td>
            </template>
            <template v-slot:expand="props">
              <v-card flat>
              <v-card-text class="text-xs-left">
                <v-textarea
                  solo
                  name="comment"
                  label="Commentaire"
                  v-model="props.item.commentaire"
                ></v-textarea>
                <v-btn color="info" :loading="commentButton" @click="saveComment(props.item); props.expanded = false;">Enregistrer</v-btn>
              </v-card-text>
            </v-card>
            </template>
            <template
              slot="pageText"
              slot-scope="props"
            >Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Votre recherche sur "{{ search }}" ne donne aucun résultat.</v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Téléchargement du fichier</v-card-title>
          <v-card-text>
            <div v-if="fileReady">Votre fichier est en cours de téléchargement, veuillez patienter.
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
            <div v-if="!fileReady">
              <v-flex align-center justify-center fill-height class="text-xs-center">
                <v-btn
                  outline
                  large
                  color="secondary"
                  ref="fileLinkBtn"
                  :href="fileLink"
                  :download="blobName"
                >Télécharger le fichier
                  <v-icon right dark>cloud_download</v-icon>
                </v-btn>
              </v-flex>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false" aria-label="Fermer">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-if="!archive" v-model="popupDelete" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Suppression</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir supprimer définitivement cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="popupDelete = false" aria-label="Annuler">Annuler</v-btn>
            <v-btn color="primary" :loading="deleteLoading" :disabled="deleteLoading" flat @click="deleteDem" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-if="!archive" v-model="popupArchive" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Archiver</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir archiver cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="popupArchive = false" aria-label="Annuler">Annuler</v-btn>
            <v-btn color="primary" :loading="deleteLoading" :disabled="deleteLoading" flat @click="archiveDem" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'tableauComponent',
  data() {
    return {
      pagination: {
        sortBy: 'name',
      },
      search: '',
      selectedColumns: [],
      searchDateCreation: '',
      searchILN: '',
      searchRCR: '',
      searchNum: '',
      searchTraitement: '',
      searchStatut: '',
      searchCodeStatut: ['1', '2'],
      listCodeStatut: ['1', '2'],
      typeSearch: 'search',
      searchCombo: [],
      headers: [],
      items: [],
      alert: false,
      alertMessage: '',
      alertType: 'error',
      user: {},
      fileLink: '',
      blobName: 'demande.csv',
      dialog: false,
      fileReady: false,
      menu: false,
      calendar2: false,
      listTraitements: [],
      listStatut: [],
      tableLoading: true,
      popupDelete: false,
      popupArchive: false,
      deleteLoading: false,
      current: '',
      polling: null,
      commentButton: false,
      tableExpanded: false,
    };
  },
  props: {
    /** Tableau d'archive ou non ?
     * Si oui, on affiche uniquement les demandes archivées et désactive certaines fonctions
     * Si non, on affiche le tableau de gestion classique
     */
    archive: {
      default: false,
    },
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm');
      }
      return value;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.initHeader();
    this.fetchData();
    // Rafraichissement des données toutes les 10 sec
    this.polling = setInterval(() => { this.conditionalFetch(); }, 10000);
    this.getListTraitements();
    if (!this.archive) {
      this.getListStatus();
    }

    // Tri par défaut sur les numéros demandes
    this.changeSort('num');
    this.pagination.descending = true;
  },
  methods: {
    downloadFile(numDem, type) {
      this.fileReady = false;
      this.dialog = true;
      let filename = '';
      switch (type) {
        case 'ppn':
          filename = `fichier_initial_${numDem}.txt?id=${numDem}`;
          this.blobName = `fichier_initial_${numDem}.txt`;
          break;
        case 'epn':
          filename = `fichier_prepare_${numDem}.csv?id=${numDem}`;
          this.blobName = `fichier_epn_${numDem}.csv`;
          break;
        case 'enrichi':
          filename = `fichier_enrichi_${numDem}.csv?id=${numDem}`;
          this.blobName = `fichier_enrichi_${numDem}.csv`;
          break;
        case 'resultat':
          filename = `fichier_resultat_${numDem}.csv?id=${numDem}`;
          this.blobName = `fichier_resultat_${numDem}.csv`;
          break;
        default:
          filename = `fichier_prepare_${numDem}.csv?id=${numDem}`;
          this.blobName = `fichier_prepare_${numDem}.csv`;
          break;
      }
      if (this.user !== null && this.user.jwt !== null) {
        return axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url: `${process.env.VUE_APP_ROOT_API}files/${filename}`,
        }).then(
          (result) => {
            const blob = new Blob([result.data], { type: 'application/csv' });
            this.fileLink = window.URL.createObjectURL(blob);
            this.$refs.fileLinkBtn.click();
            this.fileReady = true;
          },
          (error) => {
            this.fileReady = false;
            this.dialog = false;
            this.alertMessage = 'Impossible de récupérer votre fichier. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
            this.alert = true;
            this.alertType = 'error';
            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
      return '';
    },
    getListTraitements() {
      if (this.user !== null && this.user.jwt !== null) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url: `${process.env.VUE_APP_ROOT_API}traitements`,
        }).then(
          (result) => {
            this.listTraitements = result.data;
            this.listTraitements.push({ libelle: 'Non défini' });
          },
          (error) => {
            this.alertMessage = 'Impossible de récupérer la liste des traitements. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
            this.alert = true;
            this.alertType = 'error';
            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
    },
    clickRow(numDem, codeStatut, traitement) {
      sessionStorage.setItem('dem', numDem);
      switch (codeStatut) {
        case 1:
          this.$router.push('fichier');
          break;
        case 3:
          if (traitement !== 'Non défini') {
            this.$router.push('fichierEnrichi');
          } else {
            this.$router.push('traitement');
          }
          break;
        case 4:
          this.$router.push('simulation');
          break;
        default:
          break;
      }
    },
    initHeader() {
      if (this.archive) {
        if (this.user.role === 'ADMIN') {
          this.headers = [
            { text: ' ', value: 'expand' },
            { text: 'Demande', value: 'num' },
            { text: 'Création', value: 'dateCreation' },
            { text: 'Modification', value: 'dateModification' },
            { text: 'ILN', value: 'iln' },
            { text: 'RCR', value: 'rcr' },
            { text: 'Traitement', value: 'traitement' },
            { text: 'Statut', value: 'statut' },
            { text: 'Résultat', value: 'codeStatut' },
          ];
        } else {
          this.headers = [
            { text: ' ', value: 'expand' },
            { text: 'Demande', value: 'num' },
            { text: 'Création', value: 'dateCreation' },
            { text: 'Modification', value: 'dateModification' },
            { text: 'RCR', value: 'rcr' },
            { text: 'Traitement', value: 'traitement' },
            { text: 'Statut', value: 'statut' },
            { text: 'Résultat', value: 'codeStatut' },
          ];
        }
      } else if (this.user.role === 'ADMIN') {
        this.headers = [
          { text: ' ', value: 'expand' },
          { text: 'Demande', value: 'num' },
          { text: 'Création', value: 'dateCreation' },
          { text: 'Modification', value: 'dateModification' },
          { text: 'ILN', value: 'iln' },
          { text: 'RCR', value: 'rcr' },
          { text: 'Traitement', value: 'traitement' },
          { text: 'Statut', value: 'statut' },
          { text: 'Résultat', value: 'codeStatut' },
          { text: '', value: 'delete' },
        ];
      } else {
        this.headers = [
          { text: ' ', value: 'expand' },
          { text: 'Demande', value: 'num' },
          { text: 'Création', value: 'dateCreation' },
          { text: 'Modification', value: 'dateModification' },
          { text: 'RCR', value: 'rcr' },
          { text: 'Traitement', value: 'traitement' },
          { text: 'Statut', value: 'statut' },
          { text: 'Résultat', value: 'codeStatut' },
          { text: '', value: 'delete' },
        ];
      }


      this.searchCombo = Object.assign([], this.headers);
      this.searchCombo.splice(this.searchCombo.length - 1, 1);
      for (let i = 0; i < this.searchCombo.length; i += 1) {
        this.selectedColumns[i] = this.searchCombo[i].value;
      }
    },
    // On met à jours les données toutes les 10sec uniquement si aucune demande n'est en cours d'édition (pour ne pas écraser les modifs en cours)
    conditionalFetch() {
      if (!this.tableExpanded) {
        this.fetchData();
      }
    },
    fetchData() {
      this.alert = false;
      if (this.user !== null && this.user.jwt !== null) {
        let url = '';
        if (this.archive) {
          url = `${process.env.VUE_APP_ROOT_API}chercherArchives?userNum=${
            this.user.userNum
          }`;
        } else if (this.user.role === 'ADMIN') {
          url = `${process.env.VUE_APP_ROOT_API}demandes?userNum=${
            this.user.userNum
          }`;
        } else {
          url = `${process.env.VUE_APP_ROOT_API}chercherDemandes?userNum=${
            this.user.userNum
          }`;
        }


        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url,
        }).then(
          (result) => {
            this.items = [];
            for (const key in result.data) {
            // pour éviter les erreurs si null
              if (
                result.data[key].traitement == null
                || result.data[key].traitement === undefined
              ) {
              // eslint-disable-next-line no-param-reassign
                result.data[key].traitement = {};
                // eslint-disable-next-line no-param-reassign
                result.data[key].traitement.libelle = 'Non défini';
              }
              this.items.push({
                dateModification: result.data[key].dateModification,
                rcr: `${result.data[key].rcr} - ${result.data[key].shortname}`,
                iln: result.data[key].iln,
                num: result.data[key].numDemande,
                traitement: result.data[key].traitement.libelle,
                statut: result.data[key].etatDemande.libelle,
                codeStatut: result.data[key].etatDemande.numEtat,
                commentaire: result.data[key].commentaire,
              });
            }
            this.tableLoading = false;
          },
          (error) => {
            this.alertMessage = 'Impossible de récupérer la liste des demandes. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
            this.alert = true;
            this.alertType = 'error';

            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
    },
    computedItems(type) {
      // Si appeller pr peupler le tableau
      if (type !== 'guess') {
        this.typeSearch = type;
      }

      // Si recherche sur une colonne spécifique
      if (this.typeSearch !== 'search') {
        this.search = '';
        /* fonction callback qui permet selon le choix dans la liste déroulante de ne récupérer que certaines demandes
           @param currentValue: objet représentant une ligne de demande de le tableau, acceder à son statut via
           la variable d'instance .statut
           @param searchStatut: le statut correspondant au choix dans la liste déroulante
         */
        return this.items.filter((currentValue) => {
          let statut = '';
          console.log(currentValue);
          if (currentValue.statut === 'Archivée' || currentValue.statut === 'A compléter'
            || currentValue.statut === 'En simulation' || currentValue.statut === 'En saisie'
            || currentValue.statut === 'Préparée') {
            statut = 'En saisie';
          } else if (currentValue.statut === 'En cours de traitement') {
            statut = 'En cours de traitement';
          } else if (currentValue.statut === 'Terminée') {
            statut = 'Terminée';
          } else if (currentValue.statut === 'En attente') {
            statut = 'En attente';
          } else if (currentValue.statut === 'En erreur') {
            statut = 'En erreur';
          }
          if (
            (currentValue.dateCreation
              .toString()
              .toLowerCase()
              .indexOf(this.searchDateCreation) > -1
              || this.searchDateCreation == null)
            && (currentValue.dateModification
              .toString()
              .toLowerCase()
              .indexOf(this.searchDateModification) > -1
            || this.searchDateModification == null)
            && (currentValue.iln
              .toString()
              .toLowerCase()
              .indexOf(this.searchILN) > -1
            || this.searchRCR == null)
            && (this.searchRCR == null || currentValue.rcr
              .toString()
              .toLowerCase()
              .indexOf(this.searchRCR.toLowerCase()) > -1)
            && (currentValue.num
              .toString()
              .toLowerCase()
              .indexOf(this.searchNum) > -1
            || this.searchNum == null)
            && (this.searchTraitement == null
            || currentValue.traitement
              .toString()
              .toLowerCase()
              .indexOf(this.searchTraitement.toLowerCase()) > -1)
            && (this.searchStatut == null || statut
              .toString()
              .toLowerCase()
              .indexOf(this.searchStatut.toLowerCase()) > -1)
            && (this.searchCodeStatut.toString().indexOf(currentValue.codeStatut)
            > -1
            || this.searchCodeStatut.toString() === '')
          ) {
            return true;
          }
          return false;
        });
      }

      // Recherche sur une ou plusieurs colonnes
      this.searchDateModification = '';
      this.searchDateCreation = '';
      this.searchILN = '';
      this.searchRCR = '';
      this.searchNum = '';
      this.searchTraitement = '';
      this.searchStatut = '';
      this.searchCodeStatut = '';
      return this.items.filter((currentValue) => {
        if (this.selectedColumns.length === 0 || this.search == null) {
          return true;
        }
        for (let i = 1; i < this.selectedColumns.length; i += 1) {
          if (
            currentValue[this.selectedColumns[i]]
              .toString()
              .toLowerCase()
              .indexOf(this.search) > -1
          ) {
            return true;
          }
        }
        return false;
      });
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    getListStatus() {
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}EtatDemande`,
      }).then(
        (result) => {
          for (let i = 0; i < result.data.length; i++) {
            if (
              (result.data[i].libelle === 'Archivée'
              || result.data[i].libelle === 'A compléter'
              || result.data[i].libelle === 'En simulation'
              || result.data[i].libelle === 'En saisie')
            ) {
              if (this.listStatut.find(element => element === 'En saisie') === undefined) {
                this.listStatut.push('En saisie');
              }
            } else {
              this.listStatut.push(result.data[i].libelle);
            }
          }
        },
        (error) => {
          this.alertMessage = 'Impossible de récupérer la liste des statuts. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.';
          this.alert = true;
          this.alertType = 'error';
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    saveComment(demande) {
      this.commentButton = true;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'PUT',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${sessionStorage.getItem('dem')}`,
        data: demande,
      }).then(
        () => {
          this.commentButton = false;
        },
        (error) => {
          this.commentButton = false;
          this.alertMessage = 'Impossible de mettre à jour les commentaires. <br /> Si le problème persiste merci de nous contacter.';
          this.alert = true;
          this.alertType = 'error';
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    deleteDem() {
      this.deleteLoading = true;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'DELETE',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.current}`,
      }).then(
        () => {
          this.alertMessage = 'Demande supprimée.';
          this.alertType = 'success';
          this.alert = true;
          this.fetchData();
          this.popupDelete = false;
          this.deleteLoading = false;
        },
        (error) => {
          this.alertMessage = 'Impossible de supprimer votre demande, merci de réessayer plus tard. Si le problème persiste, contactez nous.';
          this.alertType = 'error';
          this.alert = true;
          this.popupDelete = false;
          this.deleteLoading = false;
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    archiveDem() {
      this.deleteLoading = true;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}archiverDemande?numDemande=${this.current}`,
      }).then(
        () => {
          this.alertMessage = 'Demande archivée.';
          this.alertType = 'success';
          this.alert = true;
          this.fetchData();
          this.popupArchive = false;
          this.deleteLoading = false;
        },
        (error) => {
          this.alertMessage = 'Impossible d\'archiver votre demande, merci de réessayer plus tard. Si le problème persiste, contactez nous.';
          this.alertType = 'error';
          this.alert = true;
          this.popupArchive = false;
          this.deleteLoading = false;
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
  td {
    cursor: pointer;
  }
  table.v-table thead th {
    font-size: 14px;
  }
  .smallTD {
    width: 10%
  }
  /* Ne me demandez pas pourquoi, mais ça marche pour aligner les barres de recherche... */
  .v-select {
    height: 43px !important;
  }
  .v-menu  {
    height: 49px !important;
  }
</style>
