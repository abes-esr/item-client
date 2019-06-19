<template>
    <v-footer height="auto" color="secondary">
      <v-layout>
          <v-btn color="white" flat round href="http://abes.fr/">&copy; 2019 — <strong>ABES</strong></v-btn>
          <!--<span hidden>{{this.applicationVersion}}</span>-->
           <v-spacer></v-spacer>
          <v-btn color="white" flat round @click="$router.push({ name: 'donnees' })">
            Données Personnelles
          </v-btn>
          <v-btn color="white" flat round @click="$router.push({ name: 'cgu' })">
            Conditions Générales d'Utilisation (CGU)
          </v-btn>
          <v-btn color="white" flat round @click="$router.push({ name: 'mentions' })">
            Mentions Légales
          </v-btn>
      </v-layout>
    </v-footer>
</template>

<script>
import axios from 'axios';

export default {
  name: 'footerComponent',
  data() {
    return {
      user: {},
      applicationVersion: '',
    };
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.getApplicationVersion();
  },
  methods: {
    getApplicationVersion() {
      return axios({
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}versionApplication`,
      }).then(
        (result) => {
          this.applicationVersion = result.data;
        },
      );
    },
  },
};
</script>

<style scoped>
 .v-btn {
     text-transform: none !important;
 }
 </style>
