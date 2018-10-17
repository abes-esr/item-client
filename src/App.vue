<template>
  <v-app id="inspire" :dark="isDark">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-toolbar flat class="transparent mb-4" v-if="authenticated">
        <v-list three-line>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Bienvenue {{ user.username }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="!isAdmin">Vous êtes habilité à intervenir sur les exemplaires des RCR de l'ILN {{ user.iln }}</v-list-tile-sub-title>
              <v-list-tile-sub-title v-else>Vous disposez des permissions admnistrateur.</v-list-tile-sub-title>
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
        <v-list-tile v-if="authenticated && !isAdmin" v-on:click="$router.replace({ name: 'rcr' })">
          <v-list-tile-action>
            <v-icon>add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Créer une demande</v-list-tile-title>
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
            <v-icon>power_settings_new</v-icon>
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
      <router-view @authenticated="setAuthenticated" @logout="logoutExpired" />
    </v-content>
    <v-footer height="auto" color="indigo">
      <v-layout justify-center row wrap>
        <v-btn color="white" flat round @click="$router.replace({ name: 'about' })">
          A Propos
        </v-btn>
        <v-btn color="white" flat round @click="$router.replace({ name: 'donnees' })">
          Données Personnelles
        </v-btn>
        <v-btn color="white" flat round @click="$router.replace({ name: 'mentions' })">
          Mentions Légales
        </v-btn>
        <v-btn color="white" flat round @click="$router.replace({ name: 'cgu' })">
          Conditions Générales d'Utilisation (CGU)
        </v-btn>
        <v-flex indigo lighten-1 py-2 text-xs-center white--text xs12>
          &copy;2019 — <strong><a href="http://abes.fr/">ABES</a></strong>
        </v-flex>
      </v-layout>
    </v-footer>

    <!-- POP UP SESSION EXPIREE -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Déconnexion
        </v-card-title>

        <v-card-text>
          Vous avez été déconnecté car votre session a expiré. <br />Vous pouvez dès maintenant vous reconnecter et reprendre votre activité.
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        authenticated: false,
        drawer: true,
        user: {},
        isDark: false,
        isAdmin: false,
        dialog: false
      };
    },
    mounted() {
      this.getUserData();
    },
    methods: {
      setAuthenticated(status) {
        this.authenticated = status;
        this.getUserData();
      },
      logout() {
        this.authenticated = false;
        sessionStorage.clear();
        this.user = {};
        this.isAdmin = false;

        this.$router.push({ name: "login" });
      },
      logoutExpired() {
        this.dialog = true;
        this.logout();
      },
      getUserData() {
        if (sessionStorage.getItem("user") != null) {
          this.user = JSON.parse(sessionStorage.getItem("user"));
          if (this.user !== null && this.user.jwt !== null) {
            this.authenticated = true;
            if (this.user.role == "ADMIN") {
              this.isAdmin = true;
            }
          }
        }
      }
    }
  };
</script>

<style>
  .container {
    max-width: 100% !important;
    padding: 0 !important;
  }
  .layout {
    padding: 10px;
  }
  footer .layout{
    padding: 0;
  }
  footer a{
    text-decoration: none;
    color: white;
  }
</style>
