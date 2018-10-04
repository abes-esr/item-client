<template>
  <v-layout align-start justify-center>
    <loading :show="show" :label="label">
    </loading>
    <v-flex md7>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Envoi de votre fichier</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <form enctype="multipart/form-data">
            <div class="dropbox">
              <input type="file" accept=".csv" ref="fileInput" @change="checkFile(); checkCSV()" class="input-file">
              <p v-if="!fichierPresent">
                Faites glisser votre fichier<br> ou cliquez ici pour le rechercher
            </p>
            <p v-else><v-icon>file_copy</v-icon> Fichier : {{ $refs.fileInput.files[0].name }}</p>
            </div>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" :disabled="!fichierPresent" v-on:click="uploadFile()">Envoyer</v-btn>
        </v-card-actions>
      </v-card>
      <br/>
      <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from "axios";
  import loading from "vue-full-loading";

  export default {
    name: "uploadComponent",
    components: {
      loading
    },
    data() {
      return {
        file: "",
        fichierPresent: false,
        alert: false,
        alertMessage: "Erreur.",
        alertType: "error",
        show: false,
        label: "Envoi en cours..."
      };
    },
    mounted() {},
    methods: {
      uploadFile() {
        this.show = true;
        this.fichierPresent = false;
        this.file = this.$refs.fileInput.files[0];
        console.log(this.file);
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("numDemande", sessionStorage.getItem("dem"));

        axios
          .post(process.env.ROOT_API + "uploadDemande", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(
            result => {
              this.alertMessage = "Fichier envoyé.";
              this.alertType = "success";
              this.alert = true;
              this.show = false;
            },
            error => {
              this.alertMessage =
                "Une erreur est survenue lors de l'envoi du fichier. Veuillez réessayer ultérieurement. <br /> Si le problème persiste merci de nous contacter.";
              this.alertType = "error";
              this.alert = true;
              console.error(error);
              this.show = false;
            }
          );
      },
      checkFile() {
        if (this.$refs.fileInput.files[0].size > 0) {
          this.fichierPresent = true;
        } else {
          this.fichierPresent = false;
        }
      },
      checkCSV() {
        this.alert = false;
        if(!this.$refs.fileInput.files[0].name.includes(".csv")){
            this.alertMessage =
                "Le fichier doit être au format CSV.";
              this.alertType = "error";
              this.alert = true;
              this.fichierPresent = false;
              this.$refs.fileInput.files = null
        }
      }
    }
  };
</script>

<style scoped>
  .dropbox {
    outline: 2px dashed grey;
    outline-offset: -10px;
    min-height: 100px;
    color: dimgray;
    padding: 10px 10px;
    position: relative;
    cursor: pointer;
  }
  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
</style>
