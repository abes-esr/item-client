<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-flex text-xs-center>
        <v-alert :type="alertType" :value="alert" dismissible transition="scale-transition">
          <span v-html="alertMessage"></span>
        </v-alert>
        <v-card>
          <v-card-title class="title" v-if="archive && modif">Mes demandes de modification
            archivées
          </v-card-title>
          <v-card-title class="title" v-if="!archive && modif">Gérer mes demandes de modification
          </v-card-title>
          <v-card-title class="title" v-if="archive && !modif">Mes demandes d'exemplarisation
            archivées
          </v-card-title>
          <v-card-title class="title" v-if="!archive && !modif">Gérer mes demandes
            d'exemplarisation
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="computedItems('guess')"
            :loading="tableLoading"
            :pagination.sync="pagination"
            :rows-per-page-items='[10,25, {"text":"Toutes","value":-1}]'
            class="elevation-1"
            item-key="num"
            no-data-text="Aucune demande"
            rows-per-page-text="Lignes par page"
          >
            <template slot="headers" slot-scope="props">
              <tr>
                <th
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  :key="header.text"
                  @click="changeSort(header.value)"
                  v-for="header in props.headers"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
              <tr>
                <th></th> <!--Champ vierge pour fleche déroulant de la note d'une demande-->
                <th class="smallTD"> <!--Champ de recherche d'une demande-->
                  <v-text-field
                    append-icon="search"
                    aria-label="Recherche par numéro"
                    hide-details
                    single-line
                    v-model="searchNum"
                    v-on:keyup="computedItems('num')"
                  ></v-text-field>
                </th>
                <th class="smallTD"> <!--Champ de recherche d'une date de MAJ demande-->
                  <v-menu
                    :close-on-content-click="false"
                    full-width
                    lazy
                    min-width="290px"
                    offset-y
                    transition="scale-transition"
                    v-model="calendar2"
                  >
                    <v-text-field
                      append-icon="search"
                      aria-label="Recherche par date"
                      prepend-icon="event"
                      readonly
                      slot="activator"
                      v-model="searchDateModification"
                    ></v-text-field>
                    <v-date-picker
                      @change="computedItems('dateModification')"
                      @input="calendar2 = false"
                      first-day-of-week="1"
                      locale="fr-fr"
                      no-title
                      scrollable
                      v-model="searchDateModification"
                    >
                      <v-spacer></v-spacer>
                      <v-btn @click="calendar2 = false" aria-label="Annuler" color="primary" flat>
                        Annuler
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </th>
                <th class="smallTD" v-if="user.role == 'ADMIN'"> <!--Champ de recherche de l'ILN-->
                  <v-text-field
                    append-icon="search"
                    aria-label="Recherche par ILN"
                    hide-details
                    single-line
                    v-model="searchILN"
                    v-on:keyup="computedItems('iln')"
                  ></v-text-field>
                </th>
                <th> <!--Champ de recherche de RCR-->
                  <v-text-field
                    append-icon="search"
                    aria-label="Recherche par RCR"
                    hide-details
                    single-line
                    v-model="searchRCR"
                    v-on:keyup="computedItems('rcr')"
                  ></v-text-field>
                </th>
                <th> <!-- Champ de recherche Type d'exemplarisation-->
                  <v-select
                    :items="listTypeExemp"
                    @change="computedItems('traitement')"
                    aria-label="Recherche par type d'exemplarisation"
                    item-text="libelle"
                    item-value="libelle"
                    no-data-text="Aucun traitement trouvé."
                    v-model="searchTypeExemp"
                  ></v-select>
                </th>
                <th> <!-- Champ de recherche Index de recherche-->
                  <v-text-field
                    append-icon="search"
                    aria-label="Recherche par Index de Recherche"
                    hide-details
                    single-line
                    v-model="searchIndexRecherche"
                    v-on:keyup="computedItems('indexRecherche')"
                  ></v-text-field>
                </th>
                <th class="smallTD" v-if="!archive"> <!--Champ de recherche etat de la demande-->
                  <v-select
                    :items="listStatut"
                    @change="computedItems('statut')"
                    aria-label="Recherche par statut"
                    no-data-text="Aucun statut trouvé."
                    v-model="searchStatut"
                  ></v-select>
                </th>
                <th></th> <!--Champ vierge pour vignette de téléchargement-->
                <th v-if="!archive"></th>
                <!--Champ vierge pour la corbeille en cas de demande non archivée-->
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <td @click="props.expanded = !props.expanded; tableExpanded = props.expanded;">
                <v-icon :class="{colored: props.item.commentaire}"
                        :color='props.item.commentaire !== null && props.item.commentaire !== "" ? "white" : "default"'
                        v-if="props.expanded">keyboard_arrow_up
                </v-icon>
                <v-icon :class="{colored: props.item.commentaire}"
                        :color='props.item.commentaire !== null && props.item.commentaire !== "" ? "white" : "default"'
                        v-else>keyboard_arrow_down
                </v-icon>
              </td>
              <td
                @click="clickRow(props.item.num,props.item.codeStatut)"
                class="text-xs-left"
              >{{ props.item.num }}
              </td>
              <td
                @click="clickRow(props.item.num,props.item.codeStatut)"
                class="text-xs-left"
              >{{ props.item.dateModification | formatDate }}
              </td>
              <td
                @click="clickRow(props.item.num,props.item.codeStatut)"
                class="text-xs-left"
                v-if="user.role == 'ADMIN'"
              >{{ props.item.iln }}
              </td>
              <td
                @click="clickRow(props.item.num,props.item.codeStatut)"
                class="text-xs-left"
              ><abbr v-bind:title="props.item.rcr">
                {{ props.item.rcr }}</abbr>
              </td>
              <td
                @click="clickRow(props.item.num,props.item.codeStatut)"
                class="text-xs-left"
              >{{ props.item.typeExemp }}
              </td>
              <td
                @click="clickRow(props.item.num,props.item.codeStatut)"
                class="text-xs-left"
              >
                <span>{{ props.item.indexRecherche }}</span>
              </td>
              <td @click="clickRow(props.item.num,props.item.codeStatut)"
                  class="text-xs-left"
                  v-bind:class="props.item.color"
                  v-if="!archive"
              >{{ props.item.statut }}
              </td>
              <td class="text-xs-center">
                <v-menu bottom left v-if="props.item.codeStatut >= 2">
                  <v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info"
                         slot="activator" small>
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                  <!--FICHIERS MODIF -->
                  <v-list v-if="props.item.codeStatut >= 3 && modif">
                    <v-list-tile @click="downloadFile(props.item.num, 'ppn')">
                      <v-list-tile-title>Télécharger le fichier initial des PPN</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="downloadFile(props.item.num, 'epn')">
                      <v-list-tile-title>Télécharger le fichier de correspondance PPN/EPN
                      </v-list-tile-title>
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
                  <!--FICHIERS EXEMPLARISATION -->
                  <v-list v-if="props.item.codeStatut >= 3 && !modif">
                    <v-list-tile @click="downloadFile(props.item.num, 'initEx')">
                      <v-list-tile-title>Télécharger le fichier initial</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click="downloadFile(props.item.num, 'resultatEx')"
                      v-if="props.item.codeStatut >= 7"
                    >
                      <v-list-tile-title>Télécharger le fichier résultat</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <span v-if="props.item.codeStatut == 1">
                  <v-btn aria-label="Téléchargement impossible" class="cloudButton" color="info"
                         disabled slot="activator" small>
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                </span>
              </td>
              <td class="text-xs-center" v-if="!archive">
                <span v-if="props.item.codeStatut < 5 && user.iln == props.item.iln">
                  <v-btn @click="current = props.item.num; popupDelete = true;"
                         aria-label="Supprimer" icon>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </span>
                <span v-else-if="props.item.codeStatut == 7 && user.iln == props.item.iln">
                  <v-btn @click="current = props.item.num; popupArchive = true;"
                         aria-label="Supprimer" icon>
                    <v-icon>archive</v-icon>
                  </v-btn>
                </span>
              </td>
            </template>
            <template v-slot:expand="props">
              <v-card flat>
                <v-card-text class="text-xs-left">
                  <v-textarea
                    :disabled="props.item.iln != user.iln"
                    label="Commentaire (150 caractères maximum)"
                    maxlength="150"
                    name="comment"
                    solo
                    v-model="props.item.commentaire"
                  ></v-textarea>
                  <v-btn :loading="commentButton"
                         @click="saveComment(props.item.num, props.item.commentaire); props.expanded = false;"
                         color="info" v-if="user.iln == props.item.iln">Enregistrer
                  </v-btn>
                </v-card-text>
              </v-card>
            </template>
            <template
              slot="pageText"
              slot-scope="props"
            >Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
            </template>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
              slot="no-results"
            >Votre recherche sur "{{ search }}" ne donne aucun résultat.
            </v-alert>
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
              <v-flex align-center class="text-xs-center" fill-height justify-center>
                <v-btn
                  :download="blobName"
                  :href="fileLink"
                  color="secondary"
                  large
                  outline
                  ref="fileLinkBtn"
                >Télécharger le fichier
                  <v-icon dark right>cloud_download</v-icon>
                </v-btn>
              </v-flex>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false" aria-label="Fermer" color="primary" flat>Fermer</v-btn>
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
            <v-btn @click="popupDelete = false" aria-label="Annuler" color="primary" flat>Annuler
            </v-btn>
            <v-btn :disabled="deleteLoading" :loading="deleteLoading" @click="deleteDem"
                   aria-label="Confirmer" color="primary" flat>Confirmer
            </v-btn>
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
            <v-btn @click="popupArchive = false" aria-label="Annuler" color="primary" flat>Annuler
            </v-btn>
            <v-btn :disabled="deleteLoading" :loading="deleteLoading" @click="archiveDem"
                   aria-label="Confirmer" color="primary" flat>Confirmer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
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
                searchDateCreation: '',
                searchILN: '',
                searchRCR: '',
                searchNum: '',
                searchTypeExemp: '',
                searchStatut: '',
                searchIndexRecherche: '',
                searchCodeStatut: ['1', '2'],
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
            this.polling = setInterval(() => {
                this.conditionalFetch();
            }, 10000);
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
                        headers: {Authorization: this.user.jwt},
                        method: 'GET',
                        url: `${process.env.VUE_APP_ROOT_API}files/${filename}`,
                    }).then(
                        (result) => {
                            const blob = new Blob([result.data], {type: 'application/csv'});
                            this.fileLink = window.URL.createObjectURL(blob);
                            this.$refs.fileLinkBtn.click();
                            this.fileReady = true;
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
                        headers: {Authorization: this.user.jwt},
                        method: 'GET',
                        url: addr,
                    }).then(
                        (result) => {
                            this.listTypeExemp = result.data;
                            this.listTypeExemp.push({libelle: 'Non défini'});
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
                /*
                 Changement de l'entête du tableau selon 3 conditions
                 ADMINISTRATEUR | UTILISATEUR ; DEMANDE ARCHIVEE | DEMANDE EN COURS ; EXEMPLARISATION | MODIFICATION
                */
                if (this.user.role === 'ADMIN') {
                    if (this.modif) {
                        if (this.archive) { // Demande de modification archivées en administrateur
                            this.headers = constants.headersArchiveAdminModif;
                        } else { // Demande de modification en cours en administrateur
                            this.headers = constants.headerModifAdmin;
                        }
                    } else if (this.archive) { // Demande d'exemplarisation archivées en administrateur
                        this.headers = constants.headerExempArchiveAdmin;
                    } else { // Demande d'exemplarisation en cours en administrateur
                        this.headers = constants.headerExempAdmin;
                    }
                } else if (this.modif) {
                    if (this.archive) { // Demande de modification archivées en Utilisateur
                        this.headers = constants.headersArchiveModif;
                    } else { // Demande de modification en cours en Utilisateur
                        this.headers = constants.headerModif;
                    }
                } else if (this.archive) { // Demande d'exemplarisation archivées en Utilisateur
                    this.headers = constants.headerExempArchive;
                } else { // Demande d'exemplarisation en cours en Utilisateur
                    this.headers = constants.headerExemp;
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
                        headers: {Authorization: this.user.jwt},
                        method: 'GET',
                        url,
                    }).then(
                        (result) => {
                            this.items = [];
                            this.itemsUnaltered = result.data;
                            for (const key in result.data) {
                                // Controle que la zone et la sous zone on déjà été selectionnée afin d'eviter d'afficher null
                                let tempIndexRecherche;
                                let tempTypeExemp;
                                let tempStatus;

                                if (result.data[key].etatDemande.libelle === 'A compléter'
                                    || result.data[key].etatDemande.libelle === 'En saisie'
                                    || result.data[key].etatDemande.libelle === 'En simulation'
                                    || result.data[key].etatDemande.libelle === 'En préparation'
                                ) {
                                    tempStatus = 'En saisie';
                                } else {
                                    tempStatus = result.data[key].etatDemande.libelle;
                                }

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


                                // pour éviter les erreurs si null
                                this.items.push({
                                    dateCreation: result.data[key].dateCreation,
                                    dateModification: result.data[key].dateModification,
                                    rcr: `${result.data[key].rcr}`,
                                    iln: result.data[key].iln,
                                    num: result.data[key].numDemande,
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
                            && (this.searchIndexRecherche == null || currentValue.indexRecherche
                                .toString()
                                .toLowerCase()
                                .indexOf(this.searchIndexRecherche.toLowerCase()) > -1)
                            && (currentValue.num
                                .toString()
                                .toLowerCase()
                                .indexOf(this.searchNum) > -1
                            || this.searchNum == null)
                            && (this.searchTypeExemp == null
                            || currentValue.typeExemp
                                .toString()
                                .toLowerCase()
                                .indexOf(this.searchTypeExemp.toLowerCase()) > -1)
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
                    headers: {Authorization: this.user.jwt},
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
                    headers: {Authorization: this.user.jwt},
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
                    headers: {Authorization: this.user.jwt},
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
                    headers: {Authorization: this.user.jwt},
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
                if (statut === 'Terminée') {
                    if (this.darkMode) {
                        return 'colorGreenDark';
                    }
                    return 'colorGreen';
                }
                if (statut === 'En erreur') {
                    if (this.darkMode) {
                        return 'colorRedDark';
                    }
                    return 'colorRed';
                }
                return '';
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

  .v-menu {
    height: 49px !important;
  }

  abbr {
    border-bottom: none !important;
    cursor: inherit !important;
    text-decoration: none !important;
  }

  .colorGreen {
    color: #4da432;
  }

  .colorGreenDark {
    color: #C4FF32;
  }

  .colorRed {
    color: #d50b52;
  }

  .colorRedDark {
    color: #FDC8EF;
  }

  .cloudButton {
    height: 37px;
  }

  .underline {
    color: red
  }

  .colored {
    background-color: #326BB1;
    border-radius: 50%;
  }
</style>
