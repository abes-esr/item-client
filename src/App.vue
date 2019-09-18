<template>
  <v-app :dark="isDark" id="inspire">
    <v-app-bar
      color="#295494" max-height="4.2em" dark
    >
      <div class="item-margin-left-app-bar"></div> <!--Marge à gauche des icones de la barre de navigation-->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" aria-label="menu latéral" v-if="authenticated">
        <v-icon large>menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="item-margin-left-icon">Item</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon class="item-margin-around-single-icon">
        <v-tooltip>
          <span slot="activator"><a href="https://stp.abes.fr/node/3?origine=sudocpro" rel="noopener" target="_blank"><img alt="icone assistance" height="38px" href="https://stp.abes.fr/node/3?origine=sudocpro" src="@/assets/assistance.png" target="_blank" width="38px"></a></span>
          <span>Assistance</span>
        </v-tooltip>
      </v-btn>

      <v-btn icon class="item-margin-around-single-icon">
        <v-tooltip>
          <span slot="activator"><a href="http://documentation.abes.fr/aideitem/index.html" rel="noopener" target="_blank"><img alt="icone documentation" height="38px" href="http://documentation.abes.fr/aideitem/index.html" src="@/assets/documentation.png" target="_blank" width="38px"></a></span>
          <span>Documentation</span>
        </v-tooltip>
      </v-btn>

      <v-btn icon class="item-margin-around-single-icon" v-if="authenticated">
        <v-tooltip >
          <span @click="logout()" slot="activator"><a><img alt="icone déconnexion" height="38px" src="@/assets/deconnexion.png" width="38px"></a></span>
          <span>Déconnexion</span>
        </v-tooltip>
      </v-btn>
      <div class="item-margin-right-app-bar"></div> <!--Marge à droite des icones de la barre de navigation-->
    </v-app-bar>

    <v-navigation-drawer app v-if="authenticated" v-model="drawer" temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ user.username }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span v-if="!isAdmin">Vous êtes habilité à intervenir<br> sur les exemplaires des RCR de<br> l'ILN {{ user.iln }}</span>
            <span v-else>Vous disposez des permissions <br>administrateur</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-on:click="$router.push({ name: 'home' })">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'profil' })">
          <v-list-item-action>
            <v-icon>mail_outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Modifier mon adresse mail</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-title class="title">
            Exemplarisations
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'rcrEx' })">
          <v-list-item-action>
            <v-icon>edit</v-icon>
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
            <v-list-item-title>Gérer mes demandes<br> d'exemplarisation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archiveEx' })">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mes demandes <br>d'exemplarisation archivées</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-title class="title">
            Modifications
          </v-list-item-title>
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
            <v-list-item-title>Gérer mes demandes<br> de modification</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archive' })">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mes demandes <br>de modification archivées</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-title class="title">
            Taux de recouvrement
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'tab' })">
          <v-list-item-action>
            <v-icon>pie_chart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Calculer mon taux <br>de recouvrement</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <transition>
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

<style src="../src/assets/global.css">
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
