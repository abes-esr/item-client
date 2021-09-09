<template>
    <v-footer height="50" color="secondary">
      <v-row>
          <v-chip color="secondary" href="http://abes.fr/">&copy; 2020 — ABES</v-chip>
           <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-chip color="secondary" v-on="on">
            Version / Etat
          </v-chip>
          </template>
          <span>Front <v-chip x-small color="yellow">{{ applicationVersion[0][0] }}</v-chip>
            Back <v-chip x-small color="yellow">{{ applicationVersion[0][1] }}</v-chip>
            Etat CBS <v-chip v-if="applicationVersion[1][0] === 'OK'" x-small color="green">{{ applicationVersion[1][0] }}</v-chip><v-chip v-if="applicationVersion[1][0] === 'KO'" x-small color="red">{{ applicationVersion[1][0] }}</v-chip>
            Etat Base Xml <v-chip v-if="applicationVersion[1][1] === 'OK'" x-small color="green">{{ applicationVersion[1][1] }}</v-chip><v-chip v-if="applicationVersion[1][1] === 'KO'" x-small color="red">{{ applicationVersion[1][1] }}</v-chip>
            Etat BDD Item <v-chip v-if="applicationVersion[1][2] === 'OK'" x-small color="green">{{ applicationVersion[1][2] }}</v-chip><v-chip v-if="applicationVersion[1][2] === 'KO'" x-small color="red">{{ applicationVersion[1][2] }}</v-chip>
          </span>
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

export default {
  name: 'footerComponent',
  data() {
    return {
      user: {},
    };
  },
  props: {
    applicationVersion: {
      type: Array,
    },
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  },
};
</script>

<style scoped>
 .v-btn {
     text-transform: none !important;
      background: transparent;
 }
 </style>
