<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-toolbar flat class="transparent" v-if="authenticated">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Bienvenue {{ username }}</v-list-tile-title>
              </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list dense>
        <v-divider v-if="authenticated"></v-divider>
        <v-list-tile href="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Accueil</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="authenticated" @click="logout()">
          <v-list-tile-action>
            <v-icon>block</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Déconnexion</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="https://stp.abes.fr/">
          <v-list-tile-action>
            <v-icon>email</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Nous contacter</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Kopya</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex text-xs-center>
            <router-view @authenticated="setAuthenticated" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; ABES - 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        authenticated: false,
        drawer: true,
        username: ""
      };
    },
    mounted() {
      if (sessionStorage.getItem("jwt") !== null) {
        this.authenticated = true;
      }
      if (!this.authenticated) {
        this.$router.replace({ name: "login" });
      } else {
        this.username = sessionStorage.getItem("user");
      }
    },
    methods: {
      setAuthenticated(status) {
        this.authenticated = status;
      },
      logout() {
        this.authenticated = false;
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("user");
        this.$router.push({ name: "login" });
      }
    }
  };
</script>

<style>
</style>
