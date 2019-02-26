<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Connexion</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                prepend-icon="person"
                type="text"
                name="username"
                v-model="input.username"
                placeholder="Nom utilisateur"
                :rules="[rules.required]"
                v-on:keyup.enter="login"
              />
              <v-text-field
                prepend-icon="lock"
                type="password"
                name="password"
                v-model="input.password"
                placeholder="Mot de passe"
                :rules="[rules.required]"
                v-on:keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" :loading="loading" :disabled="loading" v-on:click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert :value="alert" type="error" transition="scale-transition">{{ alertMessage }}</v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

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
        required: value => !!value || 'Champ obligatoire.',
      },
    };
  },
  methods: {
    login() {
      this.alert = false;
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
              this.authUser.user = this.input.username;
              this.authUser.username = result.data.shortName;
              this.authUser.jwt = `Bearer ${result.data.accessToken}`;
              this.authUser.userNum = result.data.userNum;
              this.authUser.iln = result.data.iln;
              this.authUser.role = result.data.role;
              this.authUser.email = result.data.email;
              sessionStorage.setItem('user', JSON.stringify(this.authUser));

              this.loading = false;

              if (result.data.accessToken !== null) {
                this.$emit('authenticated', true);
                this.authenticated = true;
                this.getMail();
              }
            },
            (error) => {
              this.loading = false;
              this.alertMessage = 'Service indisponible, veuillez réessayer ultérieurement. Si le problème persiste, merci de nous contacter.';
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
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user.email === null) {
        this.$router.replace({ name: 'profil' });
      } else {
        this.$router.replace({ name: 'home' });
      }
    },
  },
};
</script>
