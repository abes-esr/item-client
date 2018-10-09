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
        Utilisateur ou mot de passe incorrect.
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        input: {
          authenticated: false,
          username: "",
          password: ""
        },
        mockAccount: {
          username: "test",
          password: "test"
        },
        alert: false
      };
    },
    methods: {
      login() {
        alert = false;
        if (this.input.username !== "" && this.input.password !== "") {
          if (
            this.input.username === this.mockAccount.username &&
            this.input.password === this.mockAccount.password
          ) {
            this.$emit("authenticated", true);
            sessionStorage.setItem("user", this.input.username);
            sessionStorage.setItem("jwt", this.input.username);
            sessionStorage.setItem("usernum", "29884");
            this.authenticated = true;

            if (sessionStorage.getItem("jwt") !== null) {
              this.$router.replace({ name: "tab" });
            }
          } else {
            this.alert = true;
          }
        } else {
          this.alert = true;
        }
      }
    }
  };
</script>

<style scoped>
</style>
