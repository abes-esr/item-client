<template>
  <v-container :class="(currentStep === 3) ? '' : 'fill-height'" fluid>
    <v-row align="center" justify="center">
      <v-col :md="(currentStep === 3) ? '' : '7'">
        <v-stepper  v-model="currentStep" alt-labels>
          <v-stepper-header>
            <v-stepper-item
              :color="currentStep >= 0 ? '#295494' : ''"
              :complete="currentStep > 0"
              :editable="currentStep > 0"
              icon="mdi-numeric-1"
              title="Séléction du RCR"
              :subtitle="demande ? 'Demande n°'+demande.id : 'Demande'"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 1 ? '#295494' : ''"
              :complete="currentStep > 1"
              :editable="currentStep > 1"
              icon="mdi-numeric-2"
              title="PPN/RCR/EPN"
              subtitle="fichier à récupérer"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 2 ? '#295494' : ''"
              :complete="currentStep > 2"
              :editable="currentStep > 2"
              icon="mdi-numeric-3"
              title="Choix traitement"
              subtitle="à effectuer"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 3 ? '#295494' : ''"
              :complete="currentStep > 3"
              :editable="currentStep > 3"
              icon="mdi-numeric-4"
              title="Envoi"
              subtitle="du fichier"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              icon="mdi-numeric-5"
              title="Simulation"
            >
            </v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item>
              <rcr v-model="rcrSelected" :is-loading="isLoading"></rcr>
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
              <upload-file v-if="!isLoaded" v-model="fileSelected" :is-loading="isLoading" @deleted="deleteDemande()">test</upload-file>
<!--              <download-file v-else v-model="fileSelected"></download-file>-->
              <v-alert
                v-if="alertMessage"
                :type="alertType"
              >
                <span v-html="alertMessage"></span>
              </v-alert>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  précédent
                </v-btn>
                <v-btn
                  :disabled="!fileSelected"
                  @click="uploadFile()"
                >
                  Lancer le traitement en simulation
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>

            </v-stepper-window-item>
            <v-stepper-window-item>

            </v-stepper-window-item>
            <v-stepper-window-item>
<!--              SIMULATION -->
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';
import demandesService from '@/service/DemandesService';
import Rcr from '@/components/Rcr.vue';
import UploadFile from '@/components/UploadFile.vue';
import DownloadFile from '@/components/DownloadFile.vue';

const currentStep = ref(0);
const demande = ref();
const rcrSelected = ref();
const fileSelected = ref();
const alertMessage = ref();
const alertType = ref();
const isLoaded = ref(false);
const isLoading = ref(false);
const emits = defineEmits(['backendError'])

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    isLoading.value = true;
    demandesService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'MODIF')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
        emits('backendError',err);
      }).finally(() => {
        isLoading.value = false;
    });
  } else {
    isLoading.value = true;
    demandesService.creerDemande(rcrSelected.value, 'MODIF')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
        emits('backendError',err);
      }).finally(() => {
        isLoading.value = false;
      });
  }
}

function uploadFile() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  demandesService.uploadDemande(demande.value.id, fileSelected.value, 'MODIF')
    .then(() => {
      alertMessage.value = "Fichier envoyé";
      isLoaded.value = true;
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
  demandesService.deleteDemande(demande.value.id, 'MODIF')
    .then(()=>{
      router.push('/accueil');
    }).catch(err => {
    emits('backendError', err);
  })
}
function next(){
  currentStep.value++;
}
function prev(){
  currentStep.value--;
}

</script>
