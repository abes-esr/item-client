<template>
  <v-footer style="background-color: white" height="40">
    <div class="d-flex flex-wrap align-center">
      <div class="ml-auto d-flex flex-wrap align-center text-caption">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <a class="ma-2 text-disabled" v-bind="props" @mouseenter="getHealthOfServices">Etat des serveurs</a>
          </template>
              <v-chip class="ma-1" :color="healthServices['STATUT CBS'] ? 'green' : 'red'" variant="text"><v-icon icon="mdi-server" start></v-icon>CBS</v-chip>
              <v-chip class="ma-1" :color="healthServices['STATUT BASE_XML'] ? 'green' : 'red'" variant="text"><v-icon icon="mdi-server" start></v-icon>XML</v-chip>
              <v-chip class="ma-1" :color="healthServices['STATUT BASE_ITEM'] ? 'green' : 'red'" variant="text"><v-icon icon="mdi-server" start></v-icon>ITEM</v-chip>
        </v-tooltip>
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <a class="ma-2 text-disabled" v-bind="props">Détail de l'application</a>
          </template>
              <v-chip class="ma-1" variant="text">Interface Version : {{ packageVersion }}</v-chip>
              <v-chip class="ma-1" variant="text">Serveur Version : {{ backVersion }}</v-chip>
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
import {ref, computed, onMounted} from 'vue'
import itemService from '@/service/ItemService'

const currentYear = computed(() => new Date().getFullYear())

const packageVersion = process.env.PACKAGE_VERSION.replaceAll('\"', '');
const backVersion = ref()
const healthServices = ref([{
  'STATUT CBS':false,
  'STATUT BASE_XML':false,
  'STATUT BASE_ITEM':false
}])

onMounted(async () => {
  try {
    const version = await itemService.getApplicationVersion()
    backVersion.value = version.data
  } catch (error) {
    console.error('Erreur lors de la récupération de la version de l\'application :', error)
  }
})

const getHealthOfServices = async () => {
  try {
    const response = await itemService.getHealthOfServices()
    console.log('Response:', response)

    if (response.data) {
      console.log('Response Data:', response.data)
      healthServices.value = response.data
    } else {
      console.warn('La réponse ne contient pas de propriété "data".')
    }

    console.log('Health Services:', healthServices.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des statuts des services :', error)
  }
}
</script>
