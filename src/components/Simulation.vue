<template>
  <v-overlay v-model="isLoading" class="justify-center align-center">
    <v-progress-circular
      color="info"
      indeterminate
      :size="128"
      :width="12"
    ></v-progress-circular>
  </v-overlay>

  <recap-demande :demande="demande"></recap-demande>
  <!-- CONTENU SIMULATION -->
  <v-alert icon="mdi-alert" type="error" v-if="alertMessageError" class="my-3">Simulation impossible :
    {{ alertMessageError }}
  </v-alert>
  <v-card flat class="pb-2">
    <v-card-title class="d-flex justify-space-between custom-card-title">
      <span>Ecran de simulation</span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <!--TEMPLATE DE SIMULATION-->
    <v-alert type="warning" class="my-3 pa-2" dense prominent>
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
        <v-card class="pa-1 ml-1" outlined tile>
          <h5 class="d-flex justify-center border-b-md">{{ labelBefore }}</h5>
          <v-container id="scroll-target" style="max-height: 400px" class="overflow-auto">
            <pre style="text-align: left" class="py-4">{{ noticeAvant }}</pre>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="2" class="pb-10">
        <navigate-notice v-model="nbNotice" @clicked="refresh(nbNotice.nbNoticeEnCours)"></navigate-notice>
      </v-col>
      <v-col cols="12" sm="12" md="5"> <!--Exemplaire à créer-->
        <v-card class="pa-1 mr-1" outlined tile>
          <h5 class="d-flex justify-center border-b-md">{{ labelAfter }}</h5>
          <v-container id="scroll-target" style="max-height: 400px" class="overflow-auto">
            <pre style="text-align: left" class="py-4">{{ noticeApres }}</pre>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>

import RecapDemande from '@/components/RecapDemande.vue';
import NavigateNotice from '@/components/NavigateNotice.vue';
import { onMounted, ref, watchEffect } from 'vue';
import itemService from '@/service/ItemService';

const props = defineProps({
  demande: {
    type: Object,
    required: true
  },
  labelBefore: {
    type: String,
    default: 'Avant'
  },
  labelAfter: {
    type: String,
    default: 'Après'
  }
});
const emits = defineEmits(['deleted']);

const nbNotice = ref({
  nbNoticeEnCours: 0,
  nbTotalNotice: 0
});
const numeroPPNNotice = ref();
const noticeAvant = ref('');
const noticeApres = ref('');
const isLoading = ref(true);
const alertMessageError = ref();

onMounted(() => {
  refresh(0);
});

watchEffect(() => {
  if (props.demande.etatDemande === 'En simulation') {
    refresh(0);
  }
});

//nbNotice.value.nbNoticeEnCours
function refresh(nbNoticeEnCours) {
  isLoading.value = true;
  alertMessageError.value = null;
  itemService.getNbLigneFichier(props.demande.id, props.demande.type)
    .then(response => {
      nbNotice.value.nbTotalNotice = response.data;
    });
  itemService.simulerLigne(props.demande.id, nbNoticeEnCours, props.demande.type)
    .then(response => {
      numeroPPNNotice.value = response.data[0];
      noticeAvant.value = response.data[1];
      noticeApres.value = response.data[2];
    })
    .catch(err => {
      alertMessageError.value = err.response.data.message;
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
  font-size: x-large;
  font-weight: normal;
}

h5 {
  font-size: x-large;
  font-weight: normal;
}
</style>
