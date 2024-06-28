<template>
  <recap-demande :demande="demande"></recap-demande>

  <v-overlay v-model="isLoading" class="justify-center align-center">
    <v-progress-circular
      color="blue-lighten-3"
      indeterminate
      :size="128"
      :width="12"
    ></v-progress-circular>
  </v-overlay>
  <!-- CONTENU SIMULATION -->
  <v-card>
    <v-card-title style="background-color: #295494; color: white" class="d-flex justify-space-between">
      <span>Ecran de simulation</span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <!--TEMPLATE DE SIMULATION-->
    <v-alert type="warning" align="center" class="my-3 pa-2" dense prominent border="left">
      Cet écran est une <strong>prévisualisation</strong> du traitement.<br>
      Il s'agit de la <strong>dernière étape</strong> avant de lancer le traitement en <strong>base de
      production</strong>. Merci de <strong>vérifier vos données</strong>.
    </v-alert>
    <h3 class="d-flex justify-center" style="border: 1px solid lightgrey">Ligne de votre fichier :
      {{ nbNotice.nbNoticeEnCours + 1 }} sur {{ nbNotice.nbTotalNotice }}</h3>
    <h4 class="d-flex justify-center py-4" v-if="numeroPPNNotice">PPN n° {{ numeroPPNNotice }}</h4>
    <v-row class="pt-5">
      <v-col cols="12" sm="12" md="5"> <!--Exemplaires existants-->
        <!--Carte activée si présence exemplaires pour cette notice-->
        <v-card class="pa-1" outlined tile>
          <span>Exemplaire(s) existant(s)</span>
          <v-container id="scroll-target" style="max-height: 400px" class="overflow-y-auto">
            <pre style="text-align: left; padding-top: 1em">
              <span class="inner-pre" style="text-align: left; padding-top: 1em; overflow-x:scroll;">
                {{ noticeAvant }}
              </span>
            </pre>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="2" class="pb-10">
        <navigate-notice v-model="nbNotice" @clicked="refresh()"></navigate-notice>
      </v-col>
      <v-col cols="12" sm="12" md="5"> <!--Exemplaire à créer-->
        <v-card class="pa-1" outlined tile>
          <span>Exemplaire à créer</span>
          <pre style="text-align: left; padding-top: 1em; overflow-x:scroll;">
            {{ noticeApres }}
          </pre>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>

import RecapDemande from '@/components/RecapDemande.vue';
import NavigateNotice from '@/components/NavigateNotice.vue';
import { onMounted, ref } from 'vue';
import demandesService from '@/service/DemandesService';

const props = defineProps({
  demande: {
    type: Object,
    required: true
  }
});
const emits = defineEmits(['deleted'])

const nbNotice = ref({
  nbNoticeEnCours: 0,
  nbTotalNotice: 0
});
const numeroPPNNotice = ref();
const noticeAvant = ref();
const noticeApres = ref();
const isLoading = ref(true);

onMounted(() => {
  demandesService.getNbLigneFichier(props.demande.id, 'EXEMP')
    .then(response => {
      console.log(response.data);
      nbNotice.value.nbTotalNotice = response.data;
    });
  demandesService.simulerLigne(props.demande.id, 0, 'EXEMP')
    .then(response => {
      numeroPPNNotice.value = response.data[0];
      noticeAvant.value = response.data[1];
      noticeApres.value = response.data[2];
    })
    .finally(() => {
      isLoading.value = false;
    });
});

function refresh() {
  isLoading.value = true;
  demandesService.simulerLigne(props.demande.id, nbNotice.value.nbNoticeEnCours, 'EXEMP')
    .then(response => {
      numeroPPNNotice.value = response.data[0];
      noticeAvant.value = response.data[1];
      noticeApres.value = response.data[2];
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function deleted() {
  emits('deleted');
}
</script>

<style>
h3 {
  font-size: x-large;
  font-weight: normal;
}

h4 {
  font-size: large;
  font-weight: normal;
}
</style>
