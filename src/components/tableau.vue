<template>
  <v-container fluid>
    <v-layout justify-center align-center>
      <v-flex text-xs-center>
        <v-card>
          <v-btn large block color="primary" v-on:click="$router.push({ name: 'rcr' })">
            <v-icon>add</v-icon>&nbsp; Créer une nouvelle demande
          </v-btn>
        </v-card>
        <br />
        <v-alert :value="alert" type="error" dismissible transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
        <v-card>
          <v-card-title>
            Mes demandes
            <v-spacer></v-spacer>
            <v-combobox v-model="selectedColumns" :items="searchCombo" label="Colonnes de recherche sélectionnées" multiple :return-object="false" hide-details></v-combobox>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Rechercher" single-line hide-details clearable v-on:keyup="computedItems('search')"></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="computedItems('guess')" rows-per-page-text="Lignes par page" :pagination.sync="pagination" no-data-text="Aucune demande" class="elevation-1" :rows-per-page-items='[10,25, {"text":"Toutes","value":-1}]'>
            <template slot="headers" slot-scope="props">

              <tr>
                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
              <tr>
                <th>
                  <v-text-field v-model="searchDate" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('date')"></v-text-field>
                </th>
                <th v-if="user.role == 'ADMIN'">
                  <v-text-field v-model="searchILN" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('iln')"></v-text-field>
                </th>
                <th>
                  <v-text-field v-model="searchRCR" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('rcr')"></v-text-field>
                </th>
                <th>
                  <v-text-field v-model="searchNum" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('num')"></v-text-field>
                </th>
                <th>
                  <v-text-field v-model="searchTraitement" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('traitement')"></v-text-field>
                </th>
                <th>
                  <v-text-field v-model="searchStatut" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('statut')"></v-text-field>
                </th>
                <th>
                  <v-combobox v-model="searchCodeStatut" :items="listCodeStatut" single-line hide-details clearable multiple chips hide-selected v-on:change="computedItems('codeStatut')">
                    <template slot="item" slot-scope="data">                      
                      <span v-if="data.item == 1">
                       <v-btn slot="activator" color="info" small disabled>
                        <v-icon>cloud_download</v-icon>
                      </v-btn>
                      </span>
                      <span v-if="data.item >= 2">
                       <v-btn slot="activator" color="info" small>
                        <v-icon>cloud_download</v-icon>
                      </v-btn>
                      </span>
                    </template>
                    <template
                      slot="selection"
                      slot-scope="{ item, parent, selected }"
                    >
                      <v-chip class="v-chip--select-multi">
                        <span v-if="item == 1">                      
                          <v-icon slot="activator" color="info" small disabled>cloud_download</v-icon>   
                          <v-icon small @click="parent.selectItem(item)">close</v-icon>                   
                        </span>
                        <span v-if="item >= 2">
                          <v-icon slot="activator" color="info" small >cloud_download</v-icon>
                          <v-icon small  @click="parent.selectItem(item)">close</v-icon>
                        </span>
                      </v-chip>
                    </template>
                  </v-combobox>
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
                <td class="text-xs-left" @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)">{{ props.item.date }}</td>
                <td v-if="user.role == 'ADMIN'" class="text-xs-left" @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)">{{ props.item.iln }}</td>
                <td class="text-xs-left" @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)">{{ props.item.rcr }}</td>
                <td class="text-xs-left" @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)">{{ props.item.num }}</td>
                <td class="text-xs-left" @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)">{{ props.item.traitement }}</td>
                <td class="text-xs-left" @click="clickRow(props.item.num, props.item.codeStatut, props.item.traitement)">{{ props.item.statut }}</td>
                <td class="text-xs-left">
                  <v-menu offset-y v-if="props.item.codeStatut >= 2">
                    <v-btn slot="activator" color="info" small>
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                    <v-list v-if="props.item.codeStatut >= 2">
                      <v-list-tile @click="downloadFile(props.item.num, 'epn')">
                        <v-list-tile-title>Télécharger le fichier PPN/EPN</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="downloadFile(props.item.num, 'result')" v-if="props.item.codeStatut >= 6">
                        <v-list-tile-title>Télécharger le fichier résultat</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <span v-if="props.item.codeStatut == 1">
                    <v-btn slot="activator" color="info" small disabled>
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                  </span>
                </td>
            </template>
            <template slot="pageText" slot-scope="props">
              Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Votre recherche sur "{{ search }}" ne donne aucun résultat.
            </v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Téléchargement du fichier
          </v-card-title>
          <v-card-text>
            <div v-if="fileReady">
              Votre fichier est en cours de téléchargement, veuillez patienter.
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
            <div v-if="!fileReady">
              <v-flex align-center justify-center fill-height class="text-xs-center">
                <v-btn outline large color="indigo" ref="fileLinkBtn" :href="fileLink" :download="blobName">Télécharger le fichier <v-icon right dark>cloud_download</v-icon>
                </v-btn>
              </v-flex>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">
              Fermer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from "axios";
  import loading from "vue-full-loading";

  export default {
    name: "tableauComponent",
    data() {
      return {
        pagination: {
          sortBy: "name"
        },
        search: "",
        selectedColumns: [],
        searchDate: "",
        searchILN: "",
        searchRCR: "",
        searchNum: "",
        searchTraitement: "",
        searchStatut: "",
        searchCodeStatut: ["1","2"],
        listCodeStatut:["1","2"],
        typeSearch: "search",
        searchCombo: [],
        headers: [],
        items: [],
        alert: false,
        alertMessage: "",
        user: {},
        fileLink: "",
        blobName: "demande.csv",
        dialog: false,
        fileReady: false
      };
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem("user"));

      this.initHeader();

      if (this.user !== null && this.user.jwt !== null) {
        let url = "";
        if (this.user.role == "ADMIN") {
          url = process.env.ROOT_API + "demandes";
        } else {
          url =
            process.env.ROOT_API +
            "chercherDemandes?userNum=" +
            this.user.userNum;
        }

        axios({
          headers: { Authorization: this.user.jwt },
          method: "GET",
          url: url
        }).then(
          result => {
            for (let key in result.data) {
              //pour éviter les erreurs si null
              if (
                result.data[key].traitement == null ||
                result.data[key].traitement == undefined
              ) {
                result.data[key].traitement = {};
                result.data[key].traitement.libelle = "Non défini";
              }

              this.items.push({
                date: result.data[key].dateModification,
                rcr: result.data[key].rcr + " - " + result.data[key].shortname,
                iln: result.data[key].iln,
                num: result.data[key].numDemande,
                traitement: result.data[key].traitement.libelle,
                statut: result.data[key].etatDemande.libelle,
                codeStatut: result.data[key].etatDemande.numEtat
              });
            }
          },
          error => {
            this.alertMessage =
              "Impossible de récupérer la liste des demandes. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
            this.alert = true;
            this.alertType = "error";

            if (error.response.status == 401) {
              this.$emit("logout");
            }
          }
        );
      }

      //Tri par défaut sur les numéros demandes
      this.changeSort("num");
      this.pagination.descending = true;
    },
    methods: {
      downloadFile(numDem, type) {
        this.fileReady = false;
        this.dialog = true;
        if (type == "epn") {
          var filename = "fichier_apresws_" + numDem + ".csv?id=" + numDem;
        } else {
          var filename = "??";
        }
        if (this.user !== null && this.user.jwt !== null) {
          return axios({
            headers: { Authorization: this.user.jwt },
            method: "GET",
            url: process.env.ROOT_API + "files/" + filename
          }).then(
            result => {
              var blob = new Blob([result.data], { type: "application/csv" });
              this.fileLink = window.URL.createObjectURL(blob);
              this.$refs.fileLinkBtn.click();
              this.fileReady = true;
            },
            error => {
              this.fileReady = false;
              this.dialog = false;
              this.alertMessage =
                "Impossible de récupérer votre fichier. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
              this.alert = true;
              this.alertType = "error";
              if (error.response.status == 401) {
                this.$emit("logout");
              }
            }
          );
        }
      },
      clickRow(numDem, codeStatut, traitement) {
        sessionStorage.setItem("dem", numDem);
        switch (codeStatut) {
          case 1:
            this.$router.push("upload");
            break;
          case 2:
            if (traitement !== "Non défini") {
              this.$router.push("uploadFinal");
            } else {
              this.$router.push("traitement");
            }
            break;
          case 3:
            this.$router.push("simulation");
            break;
          default:
            break;
        }
      },
      initHeader() {
        if (this.user.role == "ADMIN") {
          this.headers = [
            { text: "Date Création", value: "date" },
            { text: "ILN", value: "iln" },
            { text: "RCR", value: "rcr" },
            { text: "Numéro de demande", value: "num" },
            { text: "Traitement", value: "traitement" },
            { text: "Statut", value: "statut" },
            { text: "Résultat", value: "codeStatut" }
          ];
        } else {
          this.headers = [
            { text: "Date Création", value: "date" },
            { text: "RCR", value: "rcr" },
            { text: "Numéro de demande", value: "num" },
            { text: "Traitement", value: "traitement" },
            { text: "Statut", value: "statut" },
            { text: "Résultat", value: "codeStatut" }
          ];
        }

        this.searchCombo = Object.assign([], this.headers); 
        this.searchCombo.splice(this.searchCombo.length-1,1);
        for (var i = 0; i < this.searchCombo.length; i++) {
          this.selectedColumns[i] = this.searchCombo[i].value;
        }
      },
      computedItems(type) {
        //Si appeller pr peupler le tableau
        if (type != "guess") {
          this.typeSearch = type;
        }

        //Si recherche sur une colonne spécifique
        if (this.typeSearch != "search") {
          this.search = "";          
          return this.items.filter((currentValue, index, arr) => {
            if (
              (currentValue["date"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchDate) > -1 ||
                this.searchDate == null) &&
              (currentValue["iln"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchILN) > -1 ||
                this.searchRCR == null) &&
              (currentValue["rcr"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchRCR) > -1 ||
                this.searchRCR == null) &&
              (currentValue["num"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchNum) > -1 ||
                this.searchNum == null) &&
              (currentValue["traitement"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchTraitement) > -1 ||
                this.searchTraitement == null) &&
              (currentValue["statut"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchStatut) > -1 ||
                this.searchStatut == null) &&
              (this.searchCodeStatut.toString().indexOf(currentValue["codeStatut"])  > -1 ||
                this.searchCodeStatut.toString() == "")
            ) {              
              return true;
            }
          });          
        } //Recherche sur une ou plusieurs colonnes
        else {
          this.searchDate = "";
          this.searchILN = "";
          this.searchRCR = "";
          this.searchNum = "";
          this.searchTraitement = "";
          this.searchStatut = "";
          this.searchCodeStatut = "";
          return this.items.filter((currentValue, index, arr) => {
            if (this.selectedColumns.length == 0 || this.search == null) {
              return true;
            } else {
              for (var i = 0; i < this.selectedColumns.length; i++) {
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
            }
          });
        }
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      }
    }
  };
</script>

<style scoped>
  td {
    cursor: pointer;
  }
</style>
