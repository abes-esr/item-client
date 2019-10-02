<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col class="text-center" >
        <v-alert :type="alertType" :value="alert" dismissible transition="scale-transition">
          <span v-html="alertMessage"></span>
        </v-alert>
        <v-card :loading="tableLoading">
          <v-card-title class="title" v-if="archive && modif" >Mes demandes de modification archivées</v-card-title>
          <v-card-title class="title" v-if="!archive && modif">Gérer mes demandes de modification</v-card-title>
          <v-card-title class="title" v-if="archive && !modif">Mes demandes d'exemplarisation archivées</v-card-title>
          <v-card-title class="title" v-if="!archive && !modif">Gérer mes demandes d'exemplarisation</v-card-title>
          <!--Ligne d'entête du tableau d'EXEMPLARISATION-->
          <v-data-table v-if="!modif" :headers="headers" :items="computedItems('guess')" :items-per-page="10" class="elevation-1" item-key="num" loading-text="chargement.." multi-sort no-data-text="Aucune demande trouvée" no-results-text="Aucun resultat trouvé" :headers-length="3" :sort-desc="[false, true]" :footer-props="{showFirstLastPage: true, itemsPerPageOptions:[10,15,20,-1], itemsPerPageAllText:'Toutes', itemsPerPageText:'Lignes par page'}">
            <!--
            Tableau d'exemplarisation
            -->
            <template v-slot:body="{ items }">
              <!--Ligne avec les champs de recherche : EXEMPLARISATION-->
              <thead>
              <tr>
                <!--COM--><th></th>
                <!--DEM--><th><v-text-field append-icon="search" aria-label="Recherche par numéro" clear-icon='clear' clearable hide-details single-line v-model="searchNum" v-on:keyup="computedItems('num')"></v-text-field></th>
                <!--MAJ--><th><v-menu :close-on-content-click="true" ref="menu" v-model="menu"><template v-slot:activator="{ on }"><v-text-field class="item-calendar-searchfield-item" persistent-hint v-model="searchDateModification" v-on="on"></v-text-field></template><v-date-picker @change="computedItems('dateModification')" first-day-of-week="1" locale="fr-fr" no-title v-model="searchDateModification"></v-date-picker></v-menu></th>
                <!--ILN--><th v-if="user.role === 'ADMIN'"><v-text-field append-icon="search" aria-label="Recherche par ILN" clear-icon='clear' clearable hide-details single-line v-model="searchILN" v-on:keyup="computedItems('iln')"></v-text-field></th>
                <!--RCR--><th><v-text-field append-icon="search" aria-label="Recherche par RCR"  clear-icon='clear' clearable hide-details single-line v-model="searchRCR" v-on:keyup="computedItems('rcr')"></v-text-field></th>
                <!--IND--><th><v-text-field append-icon="search" aria-label="Recherche par Index"  clear-icon='clear' clearable hide-details single-line v-model="searchIndexRecherche" v-on:keyup="computedItems('indexRecherche')"></v-text-field></th>
                <!--TYP--><th><v-select :items="listTypeExemp" @change="computedItems('typeExemp')" aria-label="Recherche par type d'exemplarisation" clear-icon='clear' clearable item-text="libelle" item-value="libelle" no-data-text="Aucun type trouvé." v-model="searchTypeExemp"></v-select></th>
                <!--STA--><th v-if="!archive"><v-select :items="listStatut" @change="computedItems('statut')" aria-label="Recherche par statut" clear-icon='clear' clearable no-data-text="Aucun statut trouvé." v-model="searchStatut"></v-select></th>
                <!--TL1--><th></th>
                <!--AR2--><th v-if="!archive"></th>
              </tr>
              </thead>
              <!--Lignes de données : EXEMPLARISATION-->
              <tbody>
              <tr :key="item.name" v-for="item in items">
                <!--COM--><td></td>
                <!--DEM--><td @click="clickRow(item.num, item.codeStatut)">{{ item.num }}</td>
                <!--MAJ--><td @click="clickRow(item.num, item.codeStatut)">{{ item.dateModification | formatDate }}</td>
                <!--ILN--><td @click="clickRow(item.num, item.codeStatut)">{{ item.iln }}</td>
                <!--RCR--><td @click="clickRow(item.num, item.codeStatut)">{{ item.rcr }}</td>
                <!--IND--><td @click="clickRow(item.num, item.codeStatut)">{{ item.indexRecherche }}</td>
                <!--TYP--><td @click="clickRow(item.num, item.codeStatut)">{{ item.typeExemp }}</td>
                <!--STA--><td @click="clickRow(item.num, item.codeStatut)">{{ item.statut }}</td>
                <!--TL1--><td>
                <v-menu bottom left v-if="item.codeStatut >= 2"><template v-slot:activator="{ on }"><v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info" small v-on="on"><v-icon>cloud_download</v-icon></v-btn></template>
                  <!-- FICHIERS MODIF -->
                  <v-list v-if="item.codeStatut >= 3 && modif">
                    <v-list-item @click="downloadFile(item.num, 'ppn')"><v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'epn')"><v-list-item-title>Télécharger le fichier de correspondance PPN/EPN</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'enrichi')" v-if="item.codeStatut >= 4"><v-list-item-title>Télécharger le fichier enrichi</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultat')" v-if="item.codeStatut >= 7"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                  <!-- FICHIERS EXEMPLARISATION -->
                  <v-list v-if="item.codeStatut >= 3 && !modif">
                    <v-list-item @click="downloadFile(item.num, 'initEx')"><v-list-item-title>Télécharger le fichier déposé</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultatEx')" v-if="item.codeStatut >= 7"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                </v-menu>
                <span v-if="item.codeStatut === 1">
                  <v-btn aria-label="Téléchargement impossible" class="cloudButton" color="info" disabled small><v-icon>cloud_download</v-icon></v-btn>
                </span>
              </td>
                <!--AR2--><td class="text-center" v-if="!archive">
                <span v-if="item.codeStatut < 5 && user.iln === item.iln">
                  <v-btn @click="current = item.num; popupDelete = true;" aria-label="Supprimer" icon><v-icon>delete</v-icon></v-btn>
                </span>
                <span v-else-if="item.codeStatut === 7 && user.iln === item.iln">
                  <v-btn @click="current = item.num; popupArchive = true;" aria-label="Archiver" icon><v-icon>archive</v-icon></v-btn>
                </span>
              </td>
              </tr>
              </tbody>
            </template>
          </v-data-table>
          <!--Ligne d'entête du tableau de MODIFICATION-->
          <v-data-table v-if="modif" :headers="headers" :items="computedItems('guess')" :items-per-page="10" class="elevation-1" item-key="num" loading-text="chargement.." multi-sort no-data-text="Aucune demande trouvée" no-results-text="Aucun resultat trouvé" :headers-length="3" :sort-desc="[false, true]" :footer-props="{showFirstLastPage: true, itemsPerPageOptions:[10,15,20,-1], itemsPerPageAllText:'Toutes', itemsPerPageText:'Lignes par page'}">
            <!--
            Tableau de modification
            -->
            <template v-slot:body="{ items }">
              <!--Ligne avec les champs de recherche : MODIFICATION-->
              <thead>
              <tr>
                <!--COM--><th></th>
                <!--DEM--><th><v-text-field append-icon="search" aria-label="Recherche par numéro" clear-icon='clear' clearable hide-details single-line v-model="searchNum" v-on:keyup="computedItems('num')"></v-text-field></th>
                <!--MAJ--><th><v-menu :close-on-content-click="true" ref="menu" v-model="menu"><template v-slot:activator="{ on }"><v-text-field class="item-calendar-searchfield-item" aria-label="recherche par date" persistent-hint v-model="searchDateModification" v-on="on"></v-text-field></template><v-date-picker @change="computedItems('dateModification')" first-day-of-week="1" locale="fr-fr" no-title v-model="searchDateModification"></v-date-picker></v-menu></th>
                <!--ILN--><th v-if="user.role === 'ADMIN'"><v-text-field append-icon="search" aria-label="Recherche par ILN" clear-icon='clear' clearable hide-details single-line v-model="searchILN" v-on:keyup="computedItems('iln')"></v-text-field></th>
                <!--RCR--><th><v-text-field append-icon="search" aria-label="Recherche par RCR"  clear-icon='clear' clearable hide-details single-line v-model="searchRCR" v-on:keyup="computedItems('rcr')"></v-text-field></th>
                <!--ZON--><th><v-text-field append-icon="search" aria-label="Recherche par zone et sous-zone" clear-icon='clear' clearable hide-details single-line v-model="searchZoneSousZone" v-on:keyup="computedItems('zoneSousZone')"></v-text-field></th>
                <!--TRT--><th><v-select :items="listTraitements" @change="computedItems('traitement')" aria-label="Recherche par type de traitement" clear-icon='clear' clearable item-text="libelle" item-value="libelle" no-data-text="Aucun type trouvé." v-model="searchTraitement"></v-select></th>
                <!--STA--><th v-if="!archive"><v-select :items="listStatut" @change="computedItems('statut')" aria-label="Recherche par statut" clear-icon='clear' clearable no-data-text="Aucun statut trouvé." v-model="searchStatut"></v-select></th>
                <!--TL1--><th></th>
                <!--AR2--><th v-if="!archive"></th>
              </tr>
              </thead>
              <!--Lignes de données : MODIFICATION-->
              <tbody>
              <tr :key="item.name" v-for="item in items">
                <!--COM--><td></td>
                <!--DEM--><td @click="clickRow(item.num, item.codeStatut)">{{ item.num }}</td>
                <!--MAJ--><td @click="clickRow(item.num, item.codeStatut)">{{ item.dateModification | formatDate }}</td>
                <!--ILN--><td @click="clickRow(item.num, item.codeStatut)">{{ item.iln }}</td>
                <!--RCR--><td @click="clickRow(item.num, item.codeStatut)">{{ item.rcr }}</td>
                <!--ZON--><td @click="clickRow(item.num, item.codeStatut)">{{ item.zoneSousZone }}</td>
                <!--TRT--><td @click="clickRow(item.num, item.codeStatut)">{{ item.traitement }}</td>
                <!--STA--><td @click="clickRow(item.num, item.codeStatut)">{{ item.statut }}</td>
                <!--TL1--><td>
                <v-menu bottom left v-if="item.codeStatut >= 2"><template v-slot:activator="{ on }"><v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info" small v-on="on"><v-icon>cloud_download</v-icon></v-btn></template>
                  <!-- FICHIERS MODIF -->
                  <v-list v-if="item.codeStatut >= 3 && modif">
                    <v-list-item @click="downloadFile(item.num, 'ppn')"><v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'epn')"><v-list-item-title>Télécharger le fichier de correspondance PPN/EPN</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'enrichi')" v-if="item.codeStatut >= 4"><v-list-item-title>Télécharger le fichier enrichi</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultat')" v-if="item.codeStatut >= 7"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                  <!-- FICHIERS EXEMPLARISATION -->
                  <v-list v-if="item.codeStatut >= 3 && !modif">
                    <v-list-item @click="downloadFile(item.num, 'initEx')"><v-list-item-title>Télécharger le fichier déposé</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultatEx')" v-if="item.codeStatut >= 7"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                </v-menu>
                <span v-if="item.codeStatut == 1">
                  <v-btn aria-label="Téléchargement impossible" class="cloudButton" color="info" disabled small><v-icon>cloud_download</v-icon></v-btn>
                </span>
              </td>
                <!--AR2--><td class="text-center" v-if="!archive">
                <span v-if="item.codeStatut < 5 && user.iln == item.iln">
                  <v-btn @click="current = item.num; popupDelete = true;" aria-label="Supprimer" icon><v-icon>delete</v-icon></v-btn>
                </span>
                <span v-else-if="item.codeStatut == 7 && user.iln == item.iln">
                  <v-btn @click="current = item.num; popupArchive = true;" aria-label="Archiver" icon><v-icon>archive</v-icon></v-btn>
                </span>
              </td>
              </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Téléchargement du fichier</v-card-title>
          <v-card-text>
            <div v-if="!fileReady">Votre fichier est en cours de téléchargement, veuillez patienter.
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
            <div v-if="fileReady">
              <v-col class="text-center align justify fill-height"><v-btn :download="blobName" :href="fileLink" color="secondary" large outlined ref="fileLinkBtn">Télécharger le fichier<v-icon dark right>cloud_download</v-icon></v-btn></v-col>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false" aria-label="Fermer" text>Fermer</v-btn>
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
            <v-btn @click="popupDelete = false" aria-label="Annuler" text>Annuler</v-btn>
            <v-btn :disabled="deleteLoading" :loading="deleteLoading" @click="deleteDem"  aria-label="Confirmer" text>Confirmer</v-btn>
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
            <v-btn @click="popupArchive = false" aria-label="Annuler" color="primary" text>Annuler</v-btn>
            <v-btn :disabled="deleteLoading" :loading="deleteLoading" @click="archiveDem" aria-label="Confirmer" color="primary" text>Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import constants from '@/components/utils/const';

export default {
  name: 'tableauComponent',
  data() {
    return {
      pagination: {
        sortBy: 'name',
      },
      search: '',
      selectedColumns: [],
      searchDateModification: '',
      searchILN: '',
      searchRCR: '',
      searchNum: '',
      searchTypeExemp: '',
      searchStatut: '',
      searchIndexRecherche: '',
      searchCodeStatut: ['1', '2'],
      searchZoneSousZone: '',
      listCodeStatut: ['1', '2'],
      typeSearch: 'search',
      searchCombo: [],
      headers: [],
      items: [],
      itemsUnaltered: [],
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
      listTypeExemp: [],
      listStatut: [],
      listStatutSorted: new Map(),
      tableLoading: true,
      popupDelete: false,
      popupArchive: false,
      deleteLoading: false,
      current: '',
      polling: null,
      commentButton: false,
      tableExpanded: false,
      expanded: [],
      listTraitements: ['pomme', 'raisin'],
    };
  },
  props: {
    darkMode: Boolean,
    /** Tableau d'archive ou non ?
             * Si oui, on affiche uniquement les demandes archivées et désactive certaines fonctions
             * Si non, on affiche le tableau de gestion classique
             */
    archive: {
      default: false,
    },
    /** Modifdemasse ou exemplarisation ?
             *  L'intitulé et les colonnes varient
             *  Les paramètres des appels WS également
             */
    modif: {
      default: true,
    },
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY HH:mm');
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
    this.getListTypeExemp();
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
        case 'initEx':
          filename = `fichier_enrichi_${numDem}.csv?id=${numDem}`;
          this.blobName = `fichier_enrichi_${numDem}.csv`;
          break;
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
        case 'resultatEx':
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
            this.fileReady = true;
            const blob = new Blob([result.data], { type: 'application/csv' });
            this.fileLink = window.URL.createObjectURL(blob);
            this.$refs.fileLinkBtn.click();
          },
          (error) => {
            this.fileReady = false;
            this.dialog = false;
            this.alertMessage = constants.erreurDownload;
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
    getListTypeExemp() {
      const addr = `${process.env.VUE_APP_ROOT_API}typeExemp`;
      if (this.user !== null && this.user.jwt !== null) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url: addr,
        }).then(
          (result) => {
            this.listTypeExemp = result.data;
            this.listTraitements = result.data;
            this.listTypeExemp.push({ libelle: 'Non défini' });
          },
          (error) => {
            this.alertMessage = constants.erreurListeTraitements;
            this.alert = true;
            this.alertType = 'error';
            if (error.response.status === 401) {
              this.$emit('logout');
            }
          },
        );
      }
    },
    clickRow(numDem, codeStatut) {
      sessionStorage.setItem('dem', numDem);
      switch (codeStatut) {
        case 1:
          this.$router.push('type');
          break;
        case 3:
          this.$router.push('fichierExemplarisation');
          break;
        case 4:
          this.$router.push('simulationTest');
          break;
        default:
          break;
      }
    },
    initHeader() {
      /* Initialisation des en-têtes du tableau */
      if (this.archive) {
        if (this.user.role === 'ADMIN') {
          if (this.modif) { this.headers = constants.headersArchiveAdminModif; } else { this.headers = constants.headerExempArchiveAdmin; }
        } else if (this.modif) { this.headers = constants.headersArchiveModif; } else { this.headers = constants.headerExempArchive; }
      } else if (this.user.role === 'ADMIN') {
        if (this.modif) { this.headers = constants.headerModifAdmin; } else { this.headers = constants.headerExempAdmin; }
      } else if (this.modif) { this.headers = constants.headerModif; } else { this.headers = constants.headerExemp; }


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
          }&modif=${this.modif}`;
        } else if (this.user.role === 'ADMIN') {
          url = `${process.env.VUE_APP_ROOT_API}demandes?userNum=${
            this.user.userNum
          }&modif=${this.modif}`;
        } else {
          url = `${process.env.VUE_APP_ROOT_API}chercherDemandes?userNum=${
            this.user.userNum
          }&modif=${this.modif}`;
        }


        axios({
          headers: { Authorization: this.user.jwt },
          method: 'GET',
          url,
        }).then(
          (result) => {
            this.items = [];
            this.itemsUnaltered = result.data;
            for (const key in result.data) {
              // Controle que la zone et la sous zone on déjà été selectionnée afin d'eviter d'afficher null
              let tempIndexRecherche = '';
              let tempTypeExemp = '';
              let tempStatus = '';

              // En cas de modification
              let tempZone = '';
              let tempSousZone = '';

              if (result.data[key].etatDemande.libelle === 'A compléter'
                                    || result.data[key].etatDemande.libelle === 'En saisie'
                                    || result.data[key].etatDemande.libelle === 'En simulation'
                                    || result.data[key].etatDemande.libelle === 'En préparation'
              ) {
                tempStatus = 'En saisie';
              } else {
                tempStatus = result.data[key].etatDemande.libelle;
              }

              // Si l'on est en modification
              if (this.modif) {
                if (result.data[key].zone === null) {
                  tempZone = '';
                } else {
                  tempZone = result.data[key].zone;
                }
                if (result.data[key].sousZone === null) {
                  tempSousZone = '';
                } else {
                  tempSousZone = result.data[key].sousZone;
                }
              }

              // Si l'on est en exemplarisation
              if (!this.modif) {
                if (result.data[key].indexRecherche === null) {
                  tempIndexRecherche = '';
                } else {
                  tempIndexRecherche = result.data[key].indexRecherche.libelle;
                }

                if (result.data[key].typeExemp === null) {
                  tempTypeExemp = 'Non défini';
                } else {
                  tempTypeExemp = result.data[key].typeExemp.libelle;
                }
              }

              // pour éviter les erreurs si null
              this.items.push({
                dateCreation: result.data[key].dateCreation,
                dateModification: result.data[key].dateModification,
                rcr: `${result.data[key].rcr}`,
                iln: result.data[key].iln,
                num: result.data[key].numDemande,
                zoneSousZone: `${tempZone} ${tempSousZone}`,
                indexRecherche: `${tempIndexRecherche}`,
                // index: result.data[key].indexRecherche.libelle,
                typeExemp: tempTypeExemp,
                statut: tempStatus,
                color: this.getColor(result.data[key].etatDemande.libelle),
                codeStatut: result.data[key].etatDemande.numEtat,
                commentaire: result.data[key].commentaire,
              });
            }

            this.tableLoading = false;
          },
          (error) => {
            this.alertMessage = constants.erreur500;
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
          if (currentValue.statut === 'A compléter'
                            || currentValue.statut === 'En simulation' || currentValue.statut === 'En saisie'
                            || currentValue.statut === 'Préparée' || currentValue.statut === 'En préparation') {
            statut = 'En saisie';
          } else if (currentValue.statut === 'En cours de traitement') {
            statut = 'En cours de traitement';
          } else if (currentValue.statut === 'Terminée' || currentValue.statut === 'Archivée') {
            statut = 'Terminée';
          } else if (currentValue.statut === 'En attente') {
            statut = 'En attente';
          } else if (currentValue.statut === 'En erreur') {
            statut = 'En erreur';
          }
          if (
            (currentValue.dateCreation.toString().toLowerCase().indexOf(this.searchDateCreation) > -1 || this.searchDateCreation == null)
            && (currentValue.dateModification.toString().toLowerCase().indexOf(this.searchDateModification) > -1 || this.searchDateModification == null)
            && (currentValue.iln.toString().toLowerCase().indexOf(this.searchILN) > -1 || this.searchILN == null)
            && (currentValue.rcr.toString().toLowerCase().indexOf(this.searchRCR.toLowerCase()) > -1 || this.searchRCR == null)
            && (currentValue.zoneSousZone.toString().toLowerCase().indexOf(this.searchZoneSousZone.toLowerCase()) > -1 || this.searchZoneSousZone == null)
            && (currentValue.indexRecherche.toString().toLowerCase().indexOf(this.searchIndexRecherche.toLowerCase()) > -1 || this.searchIndexRecherche == null)
            && (currentValue.num.toString().toLowerCase().indexOf(this.searchNum) > -1 || this.searchNum == null)
            && (currentValue.typeExemp.toString().toLowerCase().indexOf(this.searchTypeExemp.toLowerCase()) > -1 || this.searchTypeExemp == null)
            && (statut.toString().toLowerCase().indexOf(this.searchStatut.toLowerCase()) > -1 || this.searchStatut == null)
            && (this.searchCodeStatut.toString().indexOf(currentValue.codeStatut) > -1 || this.searchCodeStatut.toString() === '')
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
      this.searchZoneSousZone = '';
      this.searchIndexRecherche = '';
      this.searchTypeExemp = '';
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
              result.data[i].libelle === 'Preparée'
                                || result.data[i].libelle === 'Archivée'
                                || result.data[i].libelle === 'A compléter'
                                || result.data[i].libelle === 'En simulation'
                                || result.data[i].libelle === 'En saisie'
            ) {
              this.listStatutSorted.set(1, 'En saisie');
            } else if (result.data[i].libelle === 'En attente') {
              this.listStatutSorted.set(2, 'En attente');
            } else if (result.data[i].libelle === 'En cours de traitement') {
              this.listStatutSorted.set(3, result.data[i].libelle);
            } else if (result.data[i].libelle === 'Terminée') {
              this.listStatutSorted.set(4, result.data[i].libelle);
            } else if (result.data[i].libelle === 'En erreur') {
              this.listStatutSorted.set(5, result.data[i].libelle);
            }
          }
          for (let i = 1; i < this.listStatutSorted.size + 1; i++) {
            this.listStatut.push(this.listStatutSorted.get(i));
          }
        },
        (error) => {
          this.alertMessage = constants.erreur500;
          this.alert = true;
          this.alertType = 'error';
          if (error.response.status === 401) {
            this.$emit('logout');
          }
        },
      );
    },
    saveComment(numDem, comment) {
      this.commentButton = true;
      const demande = this.itemsUnaltered.find(element => element.numDemande === numDem);
      demande.commentaire = comment;
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'PUT',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${numDem}`,
        data: demande,
      }).then(
        () => {
          this.commentButton = false;
        },
        (error) => {
          this.commentButton = false;
          this.alertMessage = constants.erreur500;
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
        url: `${process.env.VUE_APP_ROOT_API}demandes/${this.current}?modif=false`,
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
          this.alertMessage = constants.erreur500;
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
        url: `${process.env.VUE_APP_ROOT_API}archiverDemande?numDemande=${this.current}?modif=false`,
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
          this.alertMessage = constants.erreur500;
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
    getColor(statut) {
      if (statut === 'En saisie') return 'green';
      return 'orange';
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
  /* Ne me demandez pas pourquoi, mais ça marche pour aligner les barres de recherche... */
  .v-select {
    height: 43px !important;
  }
  .v-menu  {
    height: 49px !important;
  }
  abbr {
    border-bottom: none !important;
    cursor: inherit !important;
    text-decoration: none !important;
  }
  .colorGreen{
    color: #4da432;
  }
  .colorGreenDark{
    color: #C4FF32;
  }
  .colorRed{
    color: #d50b52;
  }
  .colorRedDark{
    color: #FDC8EF;
  }
  .cloudButton{
    height: 37px;
  }
  .underline { color: red }
  .colored{
    background-color: #326BB1;
    border-radius: 50%;
  }
</style>
