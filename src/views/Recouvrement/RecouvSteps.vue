<template>
  <v-container class="fill-height" fluid>
    <v-col :class="(currentStep === 3) ? '' : 'fill-height'">
      <recap-demande :demande="demande"></recap-demande>
      <v-row align="center" justify="center">
        <v-col md="7">
          <v-stepper v-model="currentStep" alt-labels>
            <v-stepper-header>
              <v-stepper-item
                :color="currentStep >= 0 ? 'primary' : ''"
                :complete="currentStep > 0"
                :editable="demande"
                icon="mdi-numeric-1"
                title="Sélection du RCR"
                :subtitle="demande ? rcrSelected : 'Demande'"
              >
              </v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item
                :color="currentStep >= 1 ? 'primary' : ''"
                :editable="fileSelected"
                icon="mdi-numeric-2"
                title="Chargement"
                subtitle="du fichier"
              >
              </v-stepper-item>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item>
                <rcr v-model="rcrSelected"></rcr>
                <v-container class="d-flex justify-space-between">
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="!rcrSelected"
                    @click="createDemande"
                  >
                    Valider
                  </v-btn>
                </v-container>
              </v-stepper-window-item>
              <v-stepper-window-item>
                <select-file v-model="fileSelected" :is-loading="isLoading" @deleted="deleteDemande()">Charger le fichier du taux de recouvrement</select-file>
                <v-alert
                  v-if="alertMessage"
                  :type="alertType"
                >
                  <span v-html="alertMessage"></span>
                </v-alert>
                <v-container class="d-flex justify-space-between">
                  <v-btn
                    @click="prev"
                  >
                    Retour
                  </v-btn>
                  <v-btn
                    :disabled="!fileSelected"
                    @click="launchTraitement"
                  >
                    Lancer le traitement
                  </v-btn>
                </v-container>
              </v-stepper-window-item>
            </v-stepper-window>
          </v-stepper>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
  <dialog-lancer-traitement v-model="dialog"
                            :is-loading="isLoading"
                            rubrique="Gérer mes recouvrements"
                            route="recouvrement-tableau"
                            body="Voulez-vous démarrer le traitement de votre demande de recouvrement ?"
                            @launch="isLoading = false">
  </dialog-lancer-traitement>
  <dialog-suppression v-model="suppDialog" :demande="demande" return-to-accueil></dialog-suppression>
</template>

<script setup>
import Rcr from '@/components/Rcr.vue';
import SelectFile from '@/components/SelectFile.vue';
import {onMounted, ref, watch} from 'vue'
import itemService from '@/service/ItemService';
import router from '@/router';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';
import RecapDemande from '@/components/RecapDemande.vue';
import DialogLancerTraitement from '@/components/Dialog/DialogLancerTraitement.vue'

const props = defineProps({id : {type: String}});
const emits = defineEmits(['backendError']);
const demande = ref();
const rcrSelected = ref();
const fileSelected = ref();
const currentStep = ref(0);
const alertMessage = ref();
const alertType = ref();
const isLoading = ref(false);
const dialog = ref(false);
const suppDialog = ref(false);

watch(router.currentRoute, (newValue) => {
  if (newValue.fullPath.includes("empty")) {
    cleanPath()
    raz();
    currentStep.value = 1;
    prev();
  }
})

onMounted(() => {
  if((props.id !== 'empty') && (props.id != null)){
    itemService.getDemande(props.id, "RECOUV")
      .then(response => {
        demande.value = response.data;
        if(demande.value.etatDemande === 'En préparation'){
          currentStep.value = 1;
          rcrSelected.value = demande.value.rcr;
        }
      }).catch(() => {
        router.replace("/recouvrement");
    })
  } else {
    cleanPath();
  }
})

function cleanPath() {
  if (router.currentRoute.value.fullPath.includes("empty")) {
    router.replace('/recouvrement');
    router.currentRoute.value.fullPath = "/recouvrement";
  }
}

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    itemService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'RECOUV')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
        emits('backendError',err);
    });
  } else {
    itemService.creerDemande(rcrSelected.value, 'RECOUV')
      .then(response => {
        demande.value = response.data;
        router.replace(`/recouvrement/${demande.value.id}`)
        next();
      }).catch(err => {
        emits('backendError',err);
    });
  }
}

function launchTraitement() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  itemService.uploadDemande(demande.value.id, fileSelected.value, 'RECOUV')
    .then(() => {
      alertMessage.value = 'Fichier envoyé';
      dialog.value = true;
    })
    .catch(err => {
      alertMessage.value = err.response.data.message;
      alertType.value = 'error';
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function deleteDemande(){
  suppDialog.value = true;
}

function next() {
  currentStep.value++;
}

function prev() {
  currentStep.value--;
}

function raz() {
  isLoading.value = false;
  alertMessage.value = '';
  alertType.value = 'success';
}
</script>
