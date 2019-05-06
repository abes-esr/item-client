<template>
  <v-app :dark="isDark" id="inspire">
    <!-- MENU LATERAL -->
    <v-navigation-drawer app fixed v-if="authenticated" v-model="drawer">
      <v-toolbar class="transparent mb-4" flat>
        <v-list three-line>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Bienvenue {{ user.username }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="!isAdmin">Vous êtes habilité à intervenir sur les exemplaires des RCR de l'ILN {{ user.iln }}</v-list-tile-sub-title>
              <v-list-tile-sub-title :style="styling" v-else>Vous disposez des permissions administrateur.</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-divider></v-divider>
        <v-list-tile>
          <v-switch label="Mode nuit" color="red" v-model="isDark" ></v-switch>
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
        <v-list-tile v-on:click="$router.push({ name: 'archive' })">
          <v-list-tile-action>
            <v-icon>archive</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Demandes archivées</v-list-tile-title>
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
    <!-- BARRE DE TITRE SUPERIEURE -->
    <v-toolbar app color="primary" dark fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" aria-label="menu latéral" v-if="authenticated"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip left nudge-bottom="20">
          <span slot="activator"><a href="https://stp.abes.fr/" rel="noopener" target="_blank"><img alt="icone assistance" height="38px" href="http://documentation.abes.fr/sudoc/formats/loc/index2.htm#TOP" src="@/assets/assistance.png" target="_blank" width="38px"></a></span>
          <span>Assistance</span>
        </v-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <v-tooltip left nudge-bottom="20">
          <span slot="activator"><a href="http://documentation.abes.fr/sudoc/formats/loc/index2.htm#TOP" rel="noopener" target="_blank"><img alt="icone documentation" height="38px" href="http://documentation.abes.fr/sudoc/formats/loc/index2.htm#TOP" src="@/assets/documentation.png" target="_blank" width="38px"></a></span>
          <span>Documentation</span>
        </v-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <v-tooltip left nudge-bottom="20" v-if="authenticated">
          <span @click="logout()" slot="activator"><a><img alt="icone déconnexion" height="38px" src="@/assets/deconnexion.png" width="38px"></a></span>
          <span>Déconnexion</span>
        </v-tooltip>
    </v-toolbar>
    <v-content>
      <transition name="fade">
        <router-view @authenticated="setAuthenticated" @logout="logoutExpired" />
      </transition>
    </v-content>
    <!-- FOOTER -->
    <footerDesc v-if="!authenticated"></footerDesc>
    <footerAbes></footerAbes>
    <!-- POPUP EN CAS DE DECONNEXION AUTOMATIQUE -->
    <logout :dialog=dialog @closePopup="dialog = false;"></logout>
  </v-app>
</template>

<script>
import footerAbes from '@/components/footer/footer.vue';
import footerDesc from '@/components/footer/desc.vue';
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
  computed: {
    styling() {
      if (this.isDark) {
        return {
          color: 'white',
        };
      }
      return {
        color: 'black',
      };
    },
  },
  mounted() {
    this.getUserData();

    // Bannière pour prévenir de l'utilisation de cookies
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
    // Vide la session en cas de déconnexion, puis renvoie vers la page de logn
    logout() {
      this.authenticated = false;
      sessionStorage.clear();
      this.user = {};
      this.isAdmin = false;

      this.$router.push({ name: 'login' });
    },
    // Affiche la popup de déconnexion automatique, puis lance la déconnexion
    logoutExpired() {
      this.dialog = true;
      this.logout();
    },
    // Récupère les données de l'utilisateur depuis la session
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

  .fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  }
  .v-btn:hover {
    background-color: #ec6839 !important;
    border-color: #ec6839 !important;
  }
</style>
