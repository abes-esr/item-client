<template>
  <v-app :dark="isDark" id="inspire">
    <!-- MENU LATERAL -->
    <v-navigation-drawer app fixed v-if="authenticated" v-model="drawer">
      <v-app-bar class="transparent mb-4" flat>
        <v-list three-line dense fixed style="text-overflow: ellipsis !important; white-space: nowrap !important;">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle :class="wrapped" :style="styling">Bienvenue {{ user.username }}</v-list-item-subtitle>
              <v-list-item-subtitle :class="wrapped" :style="styling" v-if="!isAdmin">Vous êtes habilité à intervenir sur les exemplaires des RCR de l'ILN {{ user.iln }}</v-list-item-subtitle>
              <v-list-item-subtitle :class="wrapped" :style="styling" v-else>Vous disposez des permissions administrateur.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-app-bar>
      <v-list>
        <v-divider></v-divider>
        <v-list-item>
          <v-switch label="Mode nuit" color="red" v-model="isDark"></v-switch>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-on:click="$router.push({ name: 'home' })">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'rcr' })">
          <v-list-item-action>
            <v-icon>edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Modifier des exemplaires</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'tab' })">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mes demandes de modification</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archive' })">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Archives Modification</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'rcrEx' })">
          <v-list-item-action>
            <v-icon>add</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Créer des exemplaires</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'tabEx' })">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mes demandes d'exemplarisation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archiveEx' })">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Archives Exemplarisation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'profil' })">
          <v-list-item-action>
            <v-icon>face</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Modifier mon adresse mail</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- BARRE DE TITRE SUPERIEURE -->
    <v-app-bar color="primary" dark fixed>
      <v-app-bar-side-icon @click.stop="drawer = !drawer" aria-label="menu latéral" v-if="authenticated"></v-app-bar-side-icon>
      <v-app-bar-title></v-app-bar-title>
        <v-spacer></v-spacer>
        <v-tooltip left nudge-bottom="20">
          <span slot="activator"><a href="https://stp.abes.fr/node/3?origine=sudocpro" rel="noopener" target="_blank"><img alt="icone assistance" height="38px" href="https://stp.abes.fr/node/3?origine=sudocpro" src="@/assets/assistance.png" target="_blank" width="38px"></a></span>
          <span>Assistance</span>
        </v-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <v-tooltip left nudge-bottom="20">
          <span slot="activator"><a href="http://documentation.abes.fr/aideitem/index.html" rel="noopener" target="_blank"><img alt="icone documentation" height="38px" href="http://documentation.abes.fr/aideitem/index.html" src="@/assets/documentation.png" target="_blank" width="38px"></a></span>
          <span>Documentation</span>
        </v-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <v-tooltip left nudge-bottom="20" v-if="authenticated">
          <span @click="logout()" slot="activator"><a><img alt="icone déconnexion" height="38px" src="@/assets/deconnexion.png" width="38px"></a></span>
          <span>Déconnexion</span>
        </v-tooltip>
    </v-app-bar>
    <v-content>
      <transition name="fade">
        <router-view @authenticated="setAuthenticated" @logout="logoutExpired" :darkMode="isDark"/>
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
      wrapped: '',
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

<style scoped src="../src/assets/global.css">
  .wrapped {
    hyphens: auto;
  }
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
