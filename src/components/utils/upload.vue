<template>
    <v-container>
        <loading :show="loading" :label="loadingMessage">
        </loading>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <form enctype="multipart/form-data">
                    <div class="dropbox">
                        <input type="file" :accept="format" ref="fileInput" @change="checkFile(); checkFormat();" class="input-file">
                        <p v-if="!fichierPresent">
                            Faites glisser votre fichier<br> ou cliquez ici pour le rechercher
                        </p>
                        <p v-else>
                            <v-icon>file_copy</v-icon> Fichier : {{ $refs.fileInput.files[0].name }}
                        </p>
                    </div>
                </form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="info" :disabled="!fichierPresent" v-on:click="$emit('upload', $refs.fileInput.files[0])">Envoyer</v-btn>
            </v-card-actions>
        </v-card>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
    </v-container>
</template>

<script>
import loading from 'vue-full-loading'

export default {
  name: 'upload',
  components: {
    loading
  },
  props: {
    /** Titre de la carte vuetify */
    title: {
      default: 'Envoi de votre fichier'
    },
    /** Active le chargement (plein écran) */
    loading: {
      default: false
    },
    /** Message affiché lors du chargement */
    loadingMessage: {
      default: 'Envoi en cours...'
    },
    /** Extension de fichier acceptée par le composant upload */
    format: {
      default: '.txt'
    }
  },
  data () {
    return {
      fichierPresent: false,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error'
    }
  },
  methods: {
    /**
         * Modifie l'attribut fichierPresent à true/false selon si l'utilisateur a ajouté un fichier au formulaire ou non
         */
    checkFile () {
      if (this.$refs.fileInput.files[0].size > 0) {
        this.fichierPresent = true
      } else {
        this.fichierPresent = false
      }
    },
    /**
         * Vérifie que le format du fichier déposé correspond bien à celui spécifié dans les props
         * Affiche une erreur si ce n'est pas le cas
         */
    checkFormat () {
      this.alert = false
      if (!this.$refs.fileInput.files[0].name.includes(this.format)) {
        this.alertMessage = 'Le fichier doit être au format ' + this.format
        this.alertType = 'error'
        this.alert = true
        this.fichierPresent = false
        this.$refs.fileInput.files = null
      }
    }
  }
}
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
      top: 0;
      left: 0;
    }
</style>
