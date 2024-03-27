<template>
  <!-- PAGE DE LOGIN -->
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col sm="8" md="4">
        <v-card>
          <v-app-bar dark color="primary">
            <v-toolbar-title><strong>Connexion</strong></v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                prepend-icon="person"
                type="text"
                name="username"
                aria-label="Nom utilisateur"
                v-model="input.username"
                placeholder="Nom utilisateur"
                :rules="[rules.required]"
                v-on:keyup.enter="login"
              />
              <v-text-field
                prepend-icon="lock"
                type="password"
                name="password"
                aria-label="Mot de passe"
                v-model="input.password"
                placeholder="Mot de passe"
                :rules="[rules.required]"
                v-on:keyup.enter="login"
                autocomplete="on"
              />
            </v-form>
            <v-alert type="error" icon="do_disturb_on">Le service est en maintenance. Nous vous remercions de patienter jusqu'à une information de levée d'alerte pour reprendre votre travail dans l'application. Merci pour votre compréhension</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="loading" :disabled="loading" color="primary" v-on:click="login()">Se connecter</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert :value="alert" type="error" transition="scale-transition">{{ alertMessage }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import constants from '@/components/utils/const';

export default {
  name: 'Login',
  data() {
    return {
      input: {
        authenticated: false,
        username: '',
        password: '',
      },
      authUser: {},
      user: {},
      alert: false,
      alertMessage: "Nom d'utilisateur ou mot de passe incorrect",
      loading: false,
      rules: {
        required: (value) => !!value || 'Champ obligatoire.',
      },
    };
  },
  methods: {
    login() {
      this.alert = false;
      // Si on passe la validation (et non vide)
      if (
        this.$refs.form.validate()
        && this.input.username !== ''
        && this.input.password !== ''
      ) {
        this.loading = true;
        axios
          .post(`${process.env.VUE_APP_ROOT_API}signin`, {
            username: this.input.username,
            password: this.input.password,
          })
          .then(
            (result) => {
              // On construit un objet utilisateur contenant les informations, et on l'enregistre dans sessionStorage
              this.authUser.user = this.input.username;
              this.authUser.username = result.data.shortName;
              this.authUser.jwt = `Bearer ${result.data.accessToken}`;
              this.authUser.userNum = result.data.userNum;
              this.authUser.iln = result.data.iln;
              this.authUser.role = result.data.role;
              this.authUser.email = result.data.email;
              sessionStorage.setItem('user', JSON.stringify(this.authUser));

              this.loading = false;

              // Si on a bien reçu le token, le login a bien fonctionné, on vérifie ensuite si l'utilisateur a renseigné son mail
              if (result.data.accessToken !== null) {
                this.$emit('authenticated', true);
                this.authenticated = true;
                this.getMail();
              }
            },
            (error) => {
              this.loading = false;
              this.alertMessage = constants.erreur500;
              this.alert = true;
              if (error.response.status === 401) {
                this.alertMessage = "Nom d'utilisateur ou mot de passe incorrect";
              }
            },
          );
      } else {
        this.alertMessage = "Nom d'utilisateur ou mot de passe incorrect";
        this.alert = true;
      }
    },
    getMail() {
      // Si un mail existe, on va vers la page d'accueil, sinon vers /profil ou l'utilisateur doit renseigner son mail
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user.email === null || this.user.email === '') {
        this.$router.replace({ name: 'profil' });
      } else {
        this.$router.replace({ name: 'home' });
      }
    },
  },
};
</script>

<style scoped></style>
