<template>
  <v-app id="inspire">
    <!--BARRE DU HAUT DE L'APP-->
    <v-app-bar color="primary" max-height="4.2em" dark>
      <div class="item-margin-left-app-bar"></div> <!--Marge à gauche des icones de la barre de navigation-->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" aria-label="menu latéral" v-if="authenticated">
        <v-icon large>menu</v-icon>
      </v-app-bar-nav-icon>
      <img alt="icone assistance" height="41px" v-on:click="$router.push({ path: '/' })" src="@/assets/item_logo.svg" target="_blank" width="41px" style="margin-left: 1em">
      <v-toolbar-title class="item-margin-left-icon" v-on:click="$router.push({ path: '/' })">Item</v-toolbar-title>

      <!--Icones de la barre de menu à droite-->
      <div class="flex-grow-1"></div>
      <div class="item-margin-around-single-icon">
        <v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary">
            <span><a href="https://stp.abes.fr/node/3?origine=sudocpro" title="Assistance" rel="noopener" target="_blank"><img alt="icone assistance" height="41px" href="https://stp.abes.fr/node/3?origine=sudocpro" src="@/assets/item_assistance.svg" target="_blank" width="41px"></a></span>
        </v-btn>
      </div>
      <div class="item-margin-around-single-icon">
        <v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary">
            <span><a href="http://documentation.abes.fr/aideitem/index.html" title="Documentation" rel="noopener" target="_blank"><img alt="icone documentation" height="41px" href="http://documentation.abes.fr/aideitem/index.html" src="@/assets/item_documentation.svg" target="_blank" width="41px"></a></span>
        </v-btn>
      </div>
      <div class="item-margin-around-single-icon">
      <v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary" v-if="authenticated">
          <span @click="logout()" title="Déconnexion"><a><img alt="icone déconnexion" height="41px" src="@/assets/item_deconnexion.svg" width="41px"></a></span>
      </v-btn>
      </div>
      <div class="item-margin-right-app-bar"></div> <!--Marge à droite des icones de la barre de navigation-->
    </v-app-bar>
    <!--BARRE LATERALE DE MENU-->
    <v-navigation-drawer width="18em" app v-if="authenticated" v-model="drawer" temporary>
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
        <v-list-item v-on:click="$router.push({ name: 'home' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'profil' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>mail_outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Modifier mon adresse mail</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="saveTheme()">
          <v-switch v-model="$vuetify.theme.dark" style="margin-top: 8px" inset ></v-switch>
          <v-list-item-title style="padding-bottom: 1.2em">Changer de thème</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-title class="title">
            Recouvrement
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'rcrRecouv' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>mdi-percent</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Calculer mon taux <br>de recouvrement</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'tabRecouv' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gérer mes taux<br>de recouvrement</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archiveRecouv' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gérer mes taux<br>de recouvrement archivés</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-title class="title">
            Creations
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'rcrEx' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Créer des exemplaires</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'tabExemp' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gérer mes créations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archiveEx' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gérer mes créations<br>archivées</v-list-item-title>
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
        <v-list-item v-on:click="$router.push({ name: 'rcr' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Modifier des exemplaires</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'tabModif' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gérer mes modifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="$router.push({ name: 'archive' }).catch(err => {})">
          <v-list-item-action>
            <v-icon>archive</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gérer mes modifications<br>archivées</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!--COMPOSANTS IMBRIQUES CREES-->
    <v-content>
      <transition name="fade">
        <router-view @authenticated="setAuthenticated" @logout="logoutExpired"/>
      </transition>
    </v-content>
    <!-- FOOTER -->
    <footerDesc v-if="!authenticated"></footerDesc>
    <footerAbes :applicationVersion="this.applicationVersion"></footerAbes>
    <!-- POPUP EN CAS DE DECONNEXION AUTOMATIQUE -->
    <logout :dialog=dialog @closePopup="dialog = false;"></logout>
  </v-app>
</template>

<script>
import axios from 'axios';
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
      isAdmin: false,
      dialog: false,
      wrapped: '',
      applicationVersion: '',
    };
  },
  mounted() {
    // Récupération du thème sombre/clair en localStorage
    // le 'true' est une String car le localStorage gère mal les booléens
    if (localStorage.dark === 'true') {
      this.$vuetify.theme.dark = true;
    }

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
      this.getApplicationVersion();
    },
    // récupère le numero de version de l'application
    getApplicationVersion() {
      return axios({
        headers: { Authorization: this.user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}applicationVersion`,
      }).then(
        (result) => {
          console.log(result);
          this.applicationVersion = result.data;
        },
      );
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
    saveTheme() {
      localStorage.dark = this.$vuetify.theme.dark;
    },
  },
};

</script>

<style>
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
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  }
  .v-btn:hover {
    background-color: #ec6839 !important;
    border-color: #ec6839 !important;
  }
  .item-margin-around-single-icon{
    margin: 0 1em 0 1em
  }
  .item-margin-left-icon{
    margin: 1em
  }
  .item-margin-left-app-bar{
    margin-left: 0.2em
  }
  .item-margin-right-app-bar{
    margin-right: 1em
  }
  .item-stepper-bottom-margin{
    margin-bottom: 1em
  }
  .item-global-margin-bottom{
    margin-bottom: 1em
  }
  .item-vertical-center-element{
    margin-top: 20vh;
    transform: translateY(-20%)
  }
  .item-flexbox-vertical-align-for-parent{
    display: flex;
    flex-direction: column;
    justify-content: center
  }
  .item-text-align-center{
    text-align: center
  }
  .item-vertical-padding{
    padding-top: 1em;
    padding-bottom: 1em
  }
  .item-button:hover{
    background-color: red;
  }
  .item-calendar-searchfield-item{
    max-height: 2.8em
  }
  @media all and (max-width: 10em){
    .item-break-words{
      word-break: break-all
    }
  }
  @media all and (max-width: 6em) {
    .container {
      width: 100%
    }
  }
</style>
