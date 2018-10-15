<template>
  <v-app id="inspire" :dark="isDark">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-toolbar flat class="transparent" v-if="authenticated">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Bienvenue {{ username }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list dense>
        <v-divider v-if="authenticated"></v-divider>
        <v-list-tile v-on:click="$router.replace({ name: 'tab' })">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Accueil</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="authenticated" v-on:click="$router.replace({ name: 'profil' })">
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Profil</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group v-if="authenticated" prepend-icon="description" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Documentation</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="http://documentation.abes.fr/aidecolodus/index.html#ManuelColodus_1" target="_blank">
            <v-list-tile-content>
              <v-list-tile-title>Manuel utilisateur</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="http://documentation.abes.fr/sudoc/formats/loc/index.htm#TOP" target="_blank">
            <v-list-tile-content>
              <v-list-tile-title>Description des exemplaires</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="http://documentation.abes.fr/sudoc/formats/loc/index2.htm#TOP" target="_blank">
            <v-list-tile-content>
              <v-list-tile-title>Données locales</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile href="https://stp.abes.fr/" target="_blank">
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Assistance (STP)</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="authenticated"></v-divider>
        <v-list-tile v-if="authenticated" @click="logout()">
          <v-list-tile-action>
            <v-icon>block</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Déconnexion</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-switch label="Mode nuit" v-model="isDark"></v-switch>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img src="/static/logo.png" width="38px" height="38px">
      <v-toolbar-title>Kopya</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view @authenticated="setAuthenticated" />
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
        username: "",
        user: {},
        isDark: false
      };
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem("user"));
      if (this.user !== null && this.user.jwt !== null) {
        this.authenticated = true;
      }
      if (!this.authenticated) {
        this.$router.replace({ name: "login" });
      } else {
        this.username = this.user.username;
      }
    },
    methods: {
      setAuthenticated(status) {
        this.authenticated = status;
      },
      logout() {
        this.authenticated = false;
        sessionStorage.clear();

        this.$router.push({ name: "login" });
      }
    }
  };
</script>

<style>
  .container {
    max-width: 100%;
    padding: 0;
  }
  .layout {
    padding: 10px;
  }
</style>
