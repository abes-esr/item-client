<template>
    <v-footer height="auto" color="secondary">
      <v-row>
          <v-chip color="secondary" href="http://abes.fr/">&copy; 2019 — ABES</v-chip>
           <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-chip color="secondary" v-on="on">
            Version
          </v-chip>
          </template>
          <span>{{ this.applicationVersion }}</span>
        </v-tooltip>
          <v-chip color="secondary" @click="$router.push({ name: 'donnees' })">
            Données Personnelles
          </v-chip>
          <v-chip color="secondary" @click="$router.push({ name: 'cgu' })">
            Conditions Générales d'Utilisation (CGU)
          </v-chip>
          <v-chip color="secondary" @click="$router.push({ name: 'mentions' })">
            Mentions Légales
          </v-chip>
      </v-row>
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
  },
};
</script>

<style scoped>
 .v-btn {
     text-transform: none !important;
      background: transparent;
 }
 </style>
