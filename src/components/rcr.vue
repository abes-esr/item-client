<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <loading :show="show" :label="label">
      </loading>
      <v-flex md7>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Séléction du RCR</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-flex xs6>
              <v-text-field v-model="search" append-icon="search" label="Rechercher dans les RCR" single-line hide-details></v-text-field>
            </v-flex>
            <br />
            <v-select v-model="selected" :items="filteredData" item-value="rcr" item-text="name" label="Séléctionnez votre RCR dans la liste" no-data-text="Aucun RCR correspondant." @change="active = true;">
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" :disabled="!active" v-on:click="selectRCR()">Valider</v-btn>
          </v-card-actions>
        </v-card>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from "axios";
  import loading from "vue-full-loading";

  export default {
    name: "Rcr",
    components: {
      loading
    },
    data() {
      return {
        json: "",
        listRcr: [],
        selected: "",
        active: false,
        alert: false,
        alertMessage: "Erreur.",
        alertType: "error",
        show: false,
        user: {},
        label: "Initialisation de la demande en cours...",
        search: ""
      };
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem("user"));
      if (this.user !== null && this.user.jwt !== null) {
        axios({
          method: "GET",
          url:
            "https://www.idref.fr/services/iln2rcr/" +
            this.user.iln +
            "&format=text/json"
        }).then(
          result => {
            this.json = result.data.sudoc.query.result;
            let item;
            for (let key in this.json) {
              item = {
                rcr: this.json[key].library.rcr,
                name:
                  this.json[key].library.rcr +
                  " - " +
                  this.json[key].library.shortname
              };
              this.listRcr.push(item);
            }
          },
          error => {
            this.alertMessage =
              "Impossible de récupérer la liste des RCR. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
            this.alert = true;
            this.alertType = "error";
            console.error(error);
          }
        );
      }
    },
    methods: {
      selectRCR() {
        if (this.user !== null && this.user.jwt !== null) {
          this.active = false;
          this.show = true;
          axios({
            headers: { Authorization: this.user.jwt },
            method: "GET",
            url:
              process.env.ROOT_API +
              "creerdemande?rcr=" +
              this.selected +
              "&userNum=" +
              this.user.userNum
          }).then(
            result => {
              sessionStorage.setItem("dem", result.data.numDemande);
              this.alertMessage = "Demande initialisée.";
              this.alert = true;
              this.alertType = "success";
              this.$router.replace({ name: "upload" });
              this.show = false;
              this.active = true;
            },
            error => {
              this.alertMessage =
                "Impossible de créer la demande.Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
              this.alert = true;
              this.alertType = "error";
              this.show = false;
              this.active = true;
            }
          );
        }
      }
    },
    computed: {
      filteredData() {
        let filteredRCR = this.listRcr;
        return filteredRCR.filter(filteredRCR => {
          if (
            filteredRCR.rcr.toLowerCase().includes(this.search.toLowerCase()) ||
            filteredRCR.name.toLowerCase().includes(this.search.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
    }
  };
</script>

<style scoped>
</style>
