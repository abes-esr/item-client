<template>
    <v-footer height="50" color="secondary">
      <v-row>
          <v-chip color="secondary" href="http://abes.fr/">&copy; 2020 — ABES</v-chip>
           <v-spacer></v-spacer>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-chip color="secondary" v-on="on">
              Détails Application
            </v-chip>
          </template>
          <span>
          <div v-for="(value, name) in applicationDetails" :key="name">
            {{ name }} : {{ value }}
          </div>
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-chip color="secondary" v-on="on">
            Etat des serveurs
          </v-chip>
          </template>
          <span>
          <div v-for="(value, name) in applicationStatus" :key="name">
            {{ name }} : {{ convertBooleanHumanReadeable(value) }}
          </div>
          </span>
        </v-tooltip>
          <v-chip color="secondary" href="https://abes.fr/pages-donnees-personnelles/item.sudoc.html">
            Données Personnelles
          </v-chip>
          <v-chip color="secondary" href="https://abes.fr/pages-cgu/conditions-generales-utilisation-sites-abes.html" target="_blank">
            Conditions Générales d'Utilisation (CGU)
          </v-chip>
          <v-chip color="secondary" href="https://abes.fr/pages-mentions-legales/item.sudoc.html" target="_blank">
            Mentions Légales
          </v-chip>
          <v-chip color="secondary" href="https://abes.fr/pages-accessibilite/item.sudoc.html" target="_blank">
            Accessibilité numérique
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
      applicationDetailsKeys: [],
      applicationDetailsValues: [],
      applicationStatusKeys: [],
      applicationStatusEntries: [],
    };
  },
  props: {
    applicationDetails: {
      type: Object,
    },
    applicationStatus: {
      type: Object,
    },
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  },
  beforeUpdate() {
    this.feedApplicationDetails();
  },
  methods: {
    feedApplicationDetails() {
      this.applicationDetailsKeys = Object.keys(this.applicationDetails);
      this.applicationDetailsValues = Object.values(this.applicationDetails);
    },
    convertBooleanHumanReadeable(value) {
      if (value === true) {
        return 'FONCTIONNEL';
      }
      return 'HORS SERVICE';
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
