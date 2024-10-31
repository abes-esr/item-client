<template>
  <v-footer style="bottom: 0px; left: 0px; width: 100%; height: auto" class="mt-auto py-0" color="secondary">
    <div class="d-flex flex-wrap justify-space-between align-center mt-0 mb-0" style="width: 100%">
      <div class="d-flex flex-wrap justify-start align-center text-body-2">
        <a class="ma-2 text-white text-decoration-none" href="https://abes.fr">{{ currentYear }} - ABES</a>
      </div>
      <div class="d-flex flex-wrap justify-end align-center text-body-2">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <a class="ma-2 text-white" v-bind="props" @mouseenter="getHealthOfServices" style="cursor: pointer;">Etat des serveurs</a>
          </template>
          <div style="display: flex; flex-direction: column;">
          <v-chip class="ma-1" :color="healthServices.STATUT_CBS ? 'green' : 'red'" variant="text"><v-icon icon="mdi-server" start></v-icon>CBS</v-chip>
          <v-chip class="ma-1" :color="healthServices.STATUT_BASE_XML ? 'green' : 'red'" variant="text"><v-icon icon="mdi-server" start></v-icon>XML</v-chip>
          <v-chip class="ma-1" :color="healthServices.STATUT_BASE_ITEM ? 'green' : 'red'" variant="text"><v-icon icon="mdi-server" start></v-icon>ITEM</v-chip>
          </div>
        </v-tooltip>
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <a class="ma-2 text-white" v-bind="props" style="cursor: pointer;">Version de l'application</a>
          </template>
          <div style="display: flex; flex-direction: column;">
            <v-chip class="ma-1 text-white" variant="text">Interface : {{ packageVersion }}</v-chip>
            <v-chip class="ma-1 text-white" variant="text">Serveur : {{ backVersion }}</v-chip>
          </div>
        </v-tooltip>
        <a class="ma-2 text-white text-decoration-none" href="/donnees">Données personnelles</a>
        <a class="ma-2 text-white text-decoration-none" href="https://abes.fr/pages-cgu/conditions-generales-utilisation-sites-abes.html">Conditions générales d'utilisation (CGU)</a>
        <a class="ma-2 text-white text-decoration-none" href="/mentions">Mentions légales</a>
        <a class="ma-2 text-white text-decoration-none" href="https://abes.fr/pages-accessibilite/item.sudoc.html">Accessibilité Numérique</a>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import itemService from '@/service/ItemService'
import statusService from "@/service/StatusService";

const currentYear = computed(() => new Date().getFullYear())

const  test = ref(false)

const packageVersion = process.env.PACKAGE_VERSION.replaceAll('\"', '');
const backVersion = ref()
const healthServices = ref({
  STATUT_CBS:false,
  STATUT_BASE_XML:false,
  STATUT_BASE_ITEM:false
})

onMounted(async () => {
  try {
    let version = await itemService.getApplicationVersion()
    backVersion.value = version.data
  } catch (error) {
    console.error('Erreur lors de la récupération de la version de l\'application :', error)
  }
})

const getHealthOfServices = async () => {
  statusService.getStatusBaseXML().then(isOk => {
      healthServices.value.STATUT_BASE_XML = isOk;
    })
  statusService.getStatusCBS().then(isOk => {
      healthServices.value.STATUT_CBS = isOk;
    })

  // try {
  //   const response = await itemService.getHealthOfServices()
  //   if (response.data) {
  //     healthServices.value = response.data
  //   }
  // } catch (error) {
  //   healthServices.value = [{
  //     'STATUT CBS':false,
  //     'STATUT BASE_XML':false,
  //     'STATUT BASE_ITEM':false
  //   }]
  //   console.error('Erreur lors de la récupération des statuts des services :', error)
  // }
}
</script>
