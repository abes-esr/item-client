<template>


  <v-layout align-start justify-center>
    <v-flex md7>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Séléction du RCR</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-select v-model="selected"
                    :items="listRcr"
                    item-value="rcr"
                    item-text="name"
                    label="Séléctionnez votre RCR"
          >
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" v-on:click="selectRCR()">Valider</v-btn>
        </v-card-actions>
      </v-card>
      <br/>
      <v-alert
        :value="alert"
        type="error"
        transition="scale-transition"
      >Impossible de récupérer la liste des bibliothèques. Veuillez réessayer.<br/>
        Si le problème persiste, merci de nous contacter.
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Rcr",
    data() {
      return {
        json: "",
        listRcr: [],
        selected: "",
        alert: false
      };
    },
    mounted() {
      axios({
        method: "GET",
        url: "https://www.idref.fr/services/iln2rcr/5&format=text/json"
      }).then(
        result => {
          this.json = result.data.sudoc.query.result;
          let item;
          for (let key in this.json) {
            item = {
              rcr: this.json[key].library.rcr,
              name: this.json[key].library.rcr + " - " + this.json[key].library.name
            }
            this.listRcr.push(item)
          }
          console.log(this.listRcr)
        },
        error => {
          this.alert = true;
          console.error(error);
        }
      );
    },
    methods: {
      selectRCR() {
        console.log(this.selected)
      }
    }
  };
</script>

<style scoped>
</style>
