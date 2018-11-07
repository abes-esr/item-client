<template>
  <v-container fluid>
    <v-layout justify-center align-center>
      <v-flex text-xs-center>
        <v-card>
          <v-btn fab dark color="indigo" v-on:click="$router.replace({ name: 'rcr' })">
            <v-icon dark>add</v-icon>
          </v-btn>
          <v-btn large outline color="indigo" v-on:click="$router.replace({ name: 'rcr' })">Créer une nouvelle demande</v-btn>
        </v-card>
        <br />
        <v-card>
          <v-card-title>
            Mes demandes
            <v-spacer></v-spacer>
            <v-combobox v-model="selectedColumns" :items="headers" label="Colonnes de recherche sélectionnées" multiple :return-object="false" hide-details></v-combobox>
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
                  <v-text-field v-model="searchResultat" append-icon="search" single-line hide-details clearable v-on:keyup="computedItems('resultat')"></v-text-field>
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.date }}</td>
              <td :v-if="user.role == 'ADMIN'" class="text-xs-left">{{ props.item.iln }}</td>
              <td class="text-xs-left">{{ props.item.rcr }}</td>
              <td class="text-xs-left">{{ props.item.num }}</td>
              <td class="text-xs-left">{{ props.item.traitement }}</td>
              <td class="text-xs-left">{{ props.item.statut }}</td>
              <td class="text-xs-left">{{ props.item.resultat }}</td>
            </template>
            <template slot="pageText" slot-scope="props">
              Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Votre recherche sur "{{ search }}" ne donne aucun résultat.
            </v-alert>
          </v-data-table>
          <v-alert :value="alert" type="error" transition="scale-transition"><span v-html="alertMessage"></span>
          </v-alert>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from "axios";

  export default {
    name: "tableauComponent",
    data() {
      return {
        pagination: {
          sortBy: "name"
        },
        search: "",
        selectedColumns: [
          "date",
          "rcr",
          "num",
          "traitement",
          "statut",
          "resultat"
        ],
        searchDate: "",
        searchRCR: "",
        searchNum: "",
        searchTraitement: "",
        searchStatut: "",
        searchResultat: "",
        typeSearch: "search",
        headers: [],
        items: [],
        alert: false,
        alertMessage: "",
        user: {}
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
                resultat: "??"
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
    },
    methods: {
      initHeader() {
        if (this.user.role == "ADMIN") {
          this.headers = [
            { text: "Date Création", value: "date" },
            { text: "ILN", value: "iln" },
            { text: "RCR", value: "rcr" },
            { text: "Numéro de demande", value: "num" },
            { text: "Traitement", value: "traitement" },
            { text: "Statut", value: "statut" },
            { text: "Résultat", value: "resultat" }
          ];
        } else {
          this.headers = [
            { text: "Date Création", value: "date" },
            { text: "RCR", value: "rcr" },
            { text: "Numéro de demande", value: "num" },
            { text: "Traitement", value: "traitement" },
            { text: "Statut", value: "statut" },
            { text: "Résultat", value: "resultat" }
          ];
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
              (currentValue["resultat"]
                .toString()
                .toLowerCase()
                .indexOf(this.searchResultat) > -1 ||
                this.searchResultat == null)
            ) {
              return true;
            }
          });
        } //Recherche sur une ou plusieurs colonnes
        else {
          this.searchDate = "";
          this.searchRCR = "";
          this.searchNum = "";
          this.searchTraitement = "";
          this.searchStatut = "";
          this.searchResultat = "";
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