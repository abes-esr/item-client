<template>
  <v-app id="inspire" :dark="isDark">
    <v-navigation-drawer v-model="drawer" fixed app v-if="authenticated">
      <v-toolbar flat class="transparent mb-4">
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
      <v-list>
        <v-divider></v-divider>
        <v-list-tile>
          <v-switch label="Mode nuit" v-model="isDark"></v-switch>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-on:click="$router.push({ name: 'home' })">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Accueil</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="$router.push({ name: 'rcr' })">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Modifier des exemplaires</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="$router.push({ name: 'tab' })">
          <v-list-tile-action>
            <v-icon>list</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Gérer mes demandes</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-on:click="$router.push({ name: 'profil' })">
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Modifier mon adresse mail</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="authenticated"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat v-if="authenticated" @click="logout()"><v-icon>power_settings_new</v-icon>&nbsp;&nbsp;Déconnexion</v-btn>
        <v-tooltip right nudge-bottom="20">
          <span slot="activator"><a href="http://documentation.abes.fr/sudoc/formats/loc/index2.htm#TOP" target="_blank"><img src="@/assets/aide.png" width="38px" height="38px" href="http://documentation.abes.fr/sudoc/formats/loc/index2.htm#TOP" target="_blank"></a></span>
        <span>Documentation</span>
    </v-tooltip>
    </v-toolbar>
    <v-content>
      <router-view @authenticated="setAuthenticated" @logout="logoutExpired" />
    </v-content>
    <footerDesc v-if="!authenticated"></footerDesc>
    <footerAbes></footerAbes>
    <logout :dialog=dialog></logout>
  </v-app>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import footerAbes from '@/components/footer/footer.vue';
// eslint-disable-next-line import/no-unresolved
import footerDesc from '@/components/footer/desc.vue';
// eslint-disable-next-line import/no-unresolved
import logout from '@/components/utils/logoutPopup.vue';

export default {
  name: 'App',
  components: {
    footerAbes,
    logout,
    footerDesc,
  },
  data() {
    return {
      authenticated: false,
      drawer: false,
      user: {},
      isDark: false,
      isAdmin: false,
      dialog: false,
    };
  },
  mounted() {
    this.getUserData();
    const cookieScript = document.createElement('script');
    cookieScript.setAttribute(
      'src',
      'https://outils.abes.fr/cookie-banner/bandeau.js',
    );
    cookieScript.setAttribute(
      'id',
      'cookie-banner-script',
    );
    cookieScript.setAttribute(
      'data-cookie-banner-style',
      'z-index: 10000; background-color: black; position: absolute; width: 100%; top: 0; padding: 0.5%; color: white; font-family: Roboto,sans-serif;',
    );
    cookieScript.setAttribute(
      'data-cookie-banner-url',
      '/donnees',
    );
    document.head.appendChild(cookieScript);
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

      this.$router.push({ name: 'login' });
    },
    logoutExpired() {
      this.dialog = true;
      this.logout();
    },
    getUserData() {
      if (sessionStorage.getItem('user') != null) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        if (this.user !== null && this.user.jwt !== null) {
          this.authenticated = true;
          if (this.user.role === 'ADMIN') {
            this.isAdmin = true;
          }
        }
      }
    },
  },
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
  footer .layout {
    padding: 0;
  }
  footer a {
    text-decoration: none;
    color: white;
  }
  #stepper{
  margin-bottom: 20px;
  }
</style>
