<template>
  <v-footer app>
    <div class="d-flex flex-wrap align-center">
      <div class="d-flex flex-wrap align-center">
        <v-chip class="ma-2" :color="chipColorCbsBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>CBS</v-chip>
        <v-chip class="ma-2" :color="chipColorItemBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>XML</v-chip>
        <v-chip class="ma-2" :color="chipColorXmlBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>ITEM</v-chip>
      </div>

      <div class="ml-auto d-flex flex-wrap align-center text-caption">
        <a class="ma-2 text-disabled" href="http://item-dev.sudoc.fr">Détails de l'application</a>
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
