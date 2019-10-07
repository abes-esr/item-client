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
      <!--Nouveau composant d'upload vuetify 2-->
      <v-card-text style="margin-bottom: -2.8em">
        <v-file-input :rules="rules" for="files" show-size outlined prepend-icon="attachment" type="file" aria-label="Dépôt du fichier" v-model="fichierCharge" @change="autorisationEnvoi" ref="fileInput" :label="text"></v-file-input>
      </v-card-text>
      <!--Zone de Choix d'exemplarisation multiple ne s'affiche pas si modif = true (en modification)-->
      <div v-if="!this.modif" class="item-flexbox-for-checkbox">
        <div class="item-margin-right-app-bar">
              <v-checkbox value="exempMulti" id="exempMulti" @click.native="getExemplairesMultiples()" label="Je souhaite créer des exemplaires supplémentaires"></v-checkbox>
        </div>
        <div class="item-margin-right-app-bar" style="margin-bottom: 0.5em">
              <v-dialog v-model="dialog" persistent max-width="400">
                <template v-slot:activator="{ on }">
                  <v-btn text small icon v-on="on">
                    <v-icon>info</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">Exemplaires multiples sur notice</v-card-title>
                  <v-card-text>Si des exemplaires sont déjà présents sur les notices et que vous souhaitez en créer de nouveaux, cochez la case.</v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn text @click="dialog = false">Compris</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
        </div>
        <!-- liste de sélection du code PEB ne s'affiche pas si modif = true -->
        <div class="item-margin-left-app-bar" style="margin-bottom: 0.5em">
            <v-select id="codesPebList" :items="codesPeb" v-model="defaultCodePebChild" @change="getCodePebSelected()">
            </v-select>
        </div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" v-if="precedent" @click="$emit('precedent')" aria-label="Annuler">Précédent</v-btn>
        <!-- Lors du clic sur "Envoyer", on emet un évenement "upload" avec le contenu du fichier en paramètre, afin que le composant père puisse récupérer le fichier-->
        <v-btn color="info" :disabled="!fichierPresent" @click="$emit('upload', fichierCharge)" aria-label="Envoyer">Envoyer</v-btn>
      </v-card-actions>
    </v-card>
    <!--Message d'alerte quand l'utilisateur clique sur supprimer demande-->
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
import axios from 'axios';

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
    // Modif de masse ou exemplarisation
    modif: {
      default: true,
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
      user: {},
      exemplairesMultiplesChild: false,
      codesPeb: [
      ],
      defaultCodePebChild: {},
      codesPebChild: '',
      codePebSelected: '',
      fichierCharge: [],
      rules: [
        value => ((value.type === 'text/csv') || (value.type === 'application/vnd.ms-excel') || (value.type === 'text/plain')) || 'Le fichier chargé n\'est pas dans un format autorisé (.txt ou .csv)',
      ],
      typeFile: [
        value => value.type,
      ],
    };
  },
  mounted() {
    // On récupère les infos utilisateur en session car on a besoin du jwt afin d'appeler les WS REST
    this.user = JSON.parse(sessionStorage.getItem('user'));
    // on récupère la liste des codes PEB
    this.getCodesPeb();
  },
  methods: {
    // changement statut bouton envoyer
    autorisationEnvoi() {
      if ((this.fichierCharge.type === 'text/csv') || (this.fichierCharge.type === 'application/vnd.ms-excel') || (this.fichierCharge.type === 'text/plain')) {
        this.fichierPresent = true;
      } else {
        this.fichierPresent = false;
      }
    },
    /**
         * Vérifie que le format du fichier déposé correspond bien à celui spécifié dans les props
         * Affiche une erreur si ce n'est pas le cas
         */
    checkFormat() {
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
      this.$emit('eventName', this.exemplairesMultiplesChild, this.defaultCodePebChild);
    },
    getCodePebSelected() {
      this.$emit('eventName', this.exemplairesMultiplesChild, this.defaultCodePebChild);
    },
    getCodesPeb() {
      axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}codesPeb`,
      }).then(
        (result) => {
          this.codesPeb = result.data;
          this.defaultCodePebChild = result.data[0];
        },
        (error) => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = `impossible de charger la liste des codes PEB ${error.response.data.message} <br /> Veuillez réessayer ultérieurement. Si le problème persiste merci de contacter l'assistance.`;
        },
      );
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
