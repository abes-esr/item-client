<template>
  <v-container>
    <v-card color="purple">Test</v-card>
    <br />
    <v-card>
      <v-card-title>
        Mes demandes
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Rechercher" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="items" rows-per-page-text="Lignes par page" no-data-text="Aucune demande" :search="search" class="elevation-1" :rows-per-page-items='[10,25, {"text":"Toutes","value":-1}]'>
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.rcr }}</td>
          <td class="text-xs-left">{{ props.item.num }}</td>
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
  </v-container>
</template>

<script>
  import axios from "axios";

  export default {
    name: "tableauComponent",
    data() {
      return {
        search: "",
        headers: [
          { text: "Date Création", value: "date" },
          { text: "RCR", value: "rcr" },
          { text: "Numéro", value: "num" },
          { text: "Statut", value: "statut" },
          { text: "Résultat", value: "resultat" }
        ],
        items: [],
        alert: false,
        alertMessage: "",
        user: {}
      };
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem("user"));
      if (sessionStorage.getItem("email") == null) {
        this.testMail();
      }
      if (this.user !== null && this.user.jwt !== null) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: "GET",
          url: process.env.ROOT_API + "demandes"
        }).then(
          result => {
            for (let key in result.data) {
              this.items.push({
                date: result.data[key].dateModification,
                rcr: result.data[key].rcr,
                num: result.data[key].numDemande,
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
            console.error(error);
          }
        );
      }
    },
    methods: {
      testMail() {
        axios({
          headers: { Authorization: this.user.jwt },
          method: "GET",
          url: process.env.ROOT_API + "utilisateurs/" + this.user.userNum
        }).then(
          result => {
            if (result.data === null) {
              this.$router.replace({ name: "profil" });
            } else {
              sessionStorage.setItem("email", result.data.email);
            }
          },
          error => {
            console.log(error);
            this.alertMessage =
              "Service indisponible, veuillez réessayer ultérieurement. Si le problème persiste, merci de nous contacter.";
            this.alert = true;
          }
        );
      }
    }
  };
</script>
