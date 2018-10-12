<template>
  <v-layout align-center justify-center>
    <v-flex md7>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Connexion</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="person" type="text" name="username" v-model="input.username" placeholder="Nom utilisateur" required />
            <v-text-field prepend-icon="lock" type="password" name="password" v-model="input.password" placeholder="Mot de passe" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" v-on:click="login()">Login</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert :value="alert" type="error" transition="scale-transition">
        {{ alertMessage }}
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Login",
    data() {
      return {
        input: {
          authenticated: false,
          username: "",
          password: ""
        },
        authUser: {},
        alert: false,
        alertMessage: "Nom d'utilisateur ou mot de passe incorrect"
      };
    },
    methods: {
      login() {
        alert = false;
        if (this.input.username !== "" && this.input.password !== "") {
          axios
            .post(process.env.ROOT_API + "signin", {
              username: this.input.username,
              password: this.input.password
            })
            .then(
              result => {
                this.$emit("authenticated", true);
                this.authenticated = true;

                console.log(this.authUser);

                this.authUser.user = this.input.username;
                this.authUser.username = result.data.shortName;
                this.authUser.jwt = "Bearer " + result.data.accessToken;
                this.authUser.userNum = result.data.userNum;
                this.authUser.iln = result.data.iln;
                this.authUser.role = result.data.role;
                sessionStorage.setItem("user", JSON.stringify(this.authUser));

                if (this.authUser.jwt !== null) {
                  this.$router.replace({ name: "tab" });
                }
              },
              error => {
                console.log(error.response.status);
                if (error.response.status == 401) {
                  this.alertMessage =
                    "Nom d'utilisateur ou mot de passe incorrect";
                } else {
                  this.alertMessage =
                    "Service indisponible, veuillez réessayer ultérieurement. Si le problème persiste, merci de nous contacter.";
                }
                this.alert = true;
              }
            );
        } else {
          this.alertMessage = "Nom d'utilisateur ou mot de passe incorrect";
          this.alert = true;
        }
      }
    }
  };
</script>

<style scoped>
</style>
