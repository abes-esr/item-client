<template>
  <v-footer style="background-color: white" height="40">
    <div class="d-flex flex-wrap align-center">
      <div class="ml-auto d-flex flex-wrap align-center text-caption">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <a class="ma-2 text-disabled" v-bind="props">Etat des serveurs</a>
          </template>
              <v-chip class="ma-1" :color="chipColorCbsBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>CBS</v-chip>
              <v-chip class="ma-1" :color="chipColorItemBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>XML</v-chip>
              <v-chip class="ma-1" :color="chipColorXmlBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>ITEM</v-chip>
        </v-tooltip>
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <a class="ma-2 text-disabled" v-bind="props">Détail de l'application</a>
          </template>
              <v-chip class="ma-1" variant="text">Interface Version : {{}}</v-chip>
              <v-chip class="ma-1" variant="text">Serveur Version</v-chip>
        </v-tooltip>
        <a class="ma-2 text-disabled" href="http://item-dev.sudoc.fr">Données personnelles</a>
        <a class="ma-2 text-disabled" href="https://abes.fr/pages-cgu/conditions-generales-utilisation-sites-abes.html">Conditions générales d'utilisation (CGU)</a>
        <a class="ma-2 text-disabled" href="http://item-dev.sudoc.fr">Mentions légales</a>
        <a class="ma-2 text-disabled" href="https://abes.fr/pages-accessibilite/item.sudoc.html">Accessibilité Numérique</a>
        <span class="ma-2 d-none d-sm-inline-block">{{ currentYear }} - ABES</span>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
import { ref, computed } from 'vue'


const chipColorCbsBaseStatus = ref('green')
const chipColorItemBaseStatus = ref('green')
const chipColorXmlBaseStatus = ref('red')
const currentYear = computed(() => new Date().getFullYear())



</script>
