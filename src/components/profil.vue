<template>
  <!-- MODIFICATION DE L'ADRESSE MAIL -->
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col md="7">
        <v-card class="elevation-12">
          <v-app-bar dark color="primary">
            <v-toolbar-title v-if="user.email === null || user.email === ''">Première connexion</v-toolbar-title>
            <v-toolbar-title v-else>Modifier les informations de votre compte</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <span v-if="user.email === null || user.email === ''">
                Votre adresse mail est obligatoire pour utiliser l'application. Pour ajouter plusieurs adresses mail, séparez-les par des points virgules ;
              </span>
              <span v-else>
                Adresse(s) mail déclarée(s) : {{user.email}}.<br> Pour ajouter plusieurs adresses mail, séparez-les par des points virgules ;
              </span>
              <v-text-field prepend-icon="email" type="email" name="email1" aria-label="Adresse mail" v-model="input.email1" placeholder="Adresse mail" :rules="[rules.required, rules.email]" @keyup.enter="majProfil()"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" :loading="loading" v-on:click="majProfil()">Valider</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert :value="alert" type="error" transition="scale-transition">
          Adresse mail vide ou différente
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import constants from '@/components/utils/const';

export default {
  name: 'Profil',
  data() {
    return {
      valid: true,
      input: {
        email1: '',
      },
      alert: false,
      user: {},
      rules: {
        required: (value) => !!value || 'Champ obligatoire.',
        email: (value) => {
          const pattern = /^((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[;]?)+$/;
          return pattern.test(value) || 'mail(s) invalide';
        },
      },
      loading: false,
    };
  },
  mounted() {
    // On récupère les infos utilisateur en session car on a besoin du jwt afin d'appeler les WS REST
    this.user = JSON.parse(sessionStorage.getItem('user'));
  },
  methods: {
    majProfil() {
      this.loading = true;
      this.alert = false;

      // Si l'adresse mail est valide
      if (
        this.$refs.form.validate()
      ) {
        axios({
          headers: { Authorization: this.user.jwt },
          method: 'PUT',
          url: `${process.env.VUE_APP_ROOT_API}utilisateurs/${this.user.userNum}`,
          data: {
            email: this.input.email1,
            numUser: this.user.userNum,
            nbtentatives: 0,
          },
        }).then(
          (result) => {
            // On met à jour l'objet utilisateur en session, puis redirige vers la page d'accueil
            this.user.email = result.data.email;
            sessionStorage.setItem('user', JSON.stringify(this.user));
            this.$router.replace({ name: 'home' });
          },
          (error) => {
            this.alertMessage = constants.erreur500;
            this.alert = true;
            this.loading = false;
            if (error.response.status === 401) {
              // Si 401 (token jwt invalide ou expiré) on fait remonter aux composants parents l'evenement "logout" afin d'afficher la popup de déconnexion et vider la session
              // C'est le composant principal (App.vue) qui s'en occupe
              this.$emit('logout');
            }
          },
        );
      } else {
        this.alert = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
