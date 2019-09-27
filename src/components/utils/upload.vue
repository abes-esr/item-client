<template>
    <v-container>
        <loading :show="loading" :label="loadingMessage">
        </loading>
        <v-card class="elevation-12">
            <v-app-bar dark color="primary">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
              <show-at breakpoint="mediumAndAbove">
                <v-btn depressed color="primary" @click="popupDelete = true"><v-icon>delete</v-icon>Supprimer cette demande</v-btn>
              </show-at>
            </v-app-bar>
            <v-card-text style="margin-bottom: -2.8em">
                 <v-file-input :rules="rules" for="files" show-size outlined prepend-icon="attachment" type="file" aria-label="Dépôt du fichier" v-model="fichierCharge" @change="autorisationEnvoi" ref="fileInput" class="input-file" :label="text"></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-container fluid>
                <v-layout row>
                  <v-flex xs11>
                    <v-checkbox value="exempMulti" id ="exempMulti" @click.native="getExemplairesMultiples()" label="Je souhaite créer des exemplaires supplémentaires"></v-checkbox>
                  </v-flex>
                  <v-flex xs1 style="padding-top: 1.3em">
                  <v-dialog v-model="dialog" persistent max-width="400">
                    <template v-slot:activator="{ on }">
                      <v-btn text small icon v-on="on">
                        <v-icon>info</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="headline">Exemplaires multiples sur notices</v-card-title>
                      <v-card-text>Si des exemplaires sont déjà présents sur les notices et que vous souhaitez en créer de nouveaux, cochez la case.</v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn text @click="dialog = false">Compris</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  </v-flex>
                </v-layout>
              </v-container>
                <v-spacer></v-spacer>
                <v-btn color="info" v-if="precedent" @click="$emit('precedent')" aria-label="Annuler">Précédent</v-btn>
                <!-- Lors du clic sur "Envoyer", on emet un évenement "upload" avec le contenu du fichier en paramètre, afin que le composant père puisse récupérer le fichier-->
                <v-btn color="info" :disabled="!fichierPresent" @click="$emit('upload', fichierCharge)" aria-label="Envoyer">Envoyer</v-btn>
            </v-card-actions>
        </v-card>
        <br />
        <v-alert :value="alert" :type="alertType" transition="scale-transition"><span v-html="alertMessage"></span>
        </v-alert>
        <v-dialog v-model="popupDelete" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Suppression</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir supprimer définitivement cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="popupDelete = false" aria-label="Annuler">Annuler</v-btn>
            <v-btn color="primary" text @click="$emit('supprimer')" aria-label="Confirmer">Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import loading from 'vue-full-loading';
import { showAt } from 'vue-breakpoints';

export default {
  name: 'upload',
  components: {
    loading,
    showAt,
  },
  props: {
    /** Titre de la carte vuetify */
    title: {
      default: 'Envoi de votre fichier',
    },
    /** Text que contient le champ d'uload de fichier */
    text: {
      default: 'Cliquez ici pour charger votre fichier (obligatoirement au format .csv ou .txt)',
    },
    /** Active le chargement (plein écran) */
    loading: {
      default: false,
    },
    /** Message affiché lors du chargement */
    loadingMessage: {
      default: 'Envoi en cours. Ce traitement peut prendre plusieurs minutes.',
    },
    /** Extension de fichier acceptée par le composant upload */
    format: {
      default: ['csv, txt'],
    },
    /** Afficher le bouton précédent */
    precedent: {
      default: false,
    },
  },
  data() {
    return {
      fichierPresent: false,
      alert: false,
      alertMessage: 'Erreur.',
      alertType: 'error',
      popupDelete: false,
      dialog: false,
      exemplairesMultiplesChild: false,
      fichierCharge: [],
      rules: [
        value => ((value.type === 'text/csv') || (value.type === 'text/plain')) || 'Le fichier chargé n\'est pas dans un format autorisé (.txt ou .csv)',
      ],
      typeFile: [
        value => value.type,
      ],
    };
  },
  methods: {
    // changement statut bouton envoyer
    autorisationEnvoi() {
      if ((this.fichierCharge.type === 'text/csv') || (this.fichierCharge.type === 'text/plain')) {
        this.fichierPresent = true;
        console.log(this.fichierPresent);
      } else {
        this.fichierPresent = false;
        console.log(this.fichierPresent);
      }
    },
    /**
         * Vérifie que le format du fichier déposé correspond bien à celui spécifié dans les props
         * Affiche une erreur si ce n'est pas le cas
         */
    checkFormat() {
      console.log('salut');
      console.log(this.format);
      console.log(this.$refs.fileInput.files[0].name.split('.')[1]);
      this.alert = false;
      if (!(this.format.includes(this.$refs.fileInput.files[0].name.split('.')[1]))) {
        this.alertMessage = `Le fichier doit être au format(s) suivants : ${this.format}`;
        this.alertType = 'error';
        this.alert = true;
        this.fichierPresent = false;
        this.$refs.fileInput.files = null;
      }
    },
    getRefName() {
      // Obligatoire car $refs n'est plus réactif depuis Vue 2.0
      this.filename = this.$refs.fileInput.files[0].name;
    },
    getExemplairesMultiples() {
      const elt = document.getElementById('exempMulti');
      this.exemplairesMultiplesChild = elt.checked;
      this.$emit('eventName', this.exemplairesMultiplesChild);
    },
  },
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
