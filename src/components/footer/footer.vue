<template>
    <v-footer height="auto" color="secondary">
      <v-row>
          <v-chip color="secondary" href="http://abes.fr/">&copy; 2020 — ABES</v-chip>
           <v-spacer></v-spacer>
        <v-tooltip v-if="applicationVersion !== ''" top>
          <template v-slot:activator="{ on }">
            <v-chip color="secondary" v-on="on">
            Version / Etat
          </v-chip>
          </template>
          <span>{{ applicationVersion }}</span>
        </v-tooltip>
        <!--Si l'application n'est pas lancée en local ou sur le serveur (plantée) on retourne KO pour le back-->
        <v-tooltip v-if="applicationVersion === ''" top>
          <template v-slot:activator="{ on }">
            <v-chip color="secondary" v-on="on">
              Version / Etat
            </v-chip>
          </template>
          <span>Etat application item partie serveur : KO</span>
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
      type: String,
      default: '',
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
