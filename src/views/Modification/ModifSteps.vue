<template>
  <v-container :class="(currentStep === 3) ? '' : 'fill-height'" fluid>
    <v-row align="center" justify="center">
      <v-col :md="(currentStep === 3) ? '' : '7'">
        <v-stepper v-model="currentStep" @update:model-value="changeEtape()" alt-labels>
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
              :subtitle="typeTraitementSelected ? typeTraitementSelected.libelle : 'à effectuer'"
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
              <select-file v-if="!isLoaded" v-model="fileSelected" :is-loading="isLoading" @deleted="deleteDemande()"></select-file>
              <download-file v-else :file-link="fileLink" :file-name="fileName" @clicked="downloaded">Récupération du fichier de correspondances PPN / EPN</download-file>
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
                  v-if="!isLoaded"
                >
                  Envoyé
                </v-btn>
                <v-btn
                  v-else
                  :disabled="!isDownloaded"
                  @click="razBeforeNext()"
                >
                  Suivant
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <type-traitement v-model="typeTraitementSelected" :is-loading="isLoading" @clicked="modifierTypeTraitementModifDemande()"></type-traitement>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  précédent
                </v-btn>
              </v-container>
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
import SelectFile from '@/components/SelectFile.vue';
import DownloadFile from '@/components/Modif/DownloadFile.vue';
import TypeTraitement from '@/components/Modif/TypeTraitement.vue';


const currentStep = ref(0);
const demande = ref();
const rcrSelected = ref();
const fileSelected = ref();
const alertMessage = ref();
const alertType = ref();
const isLoaded = ref(false);
const isLoading = ref(false);
const isDownloaded = ref(false);
const fileLink = ref('');
const fileName = ref('');
const typeTraitementSelected = ref();

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
      demandesService.getFilePreparer(demande.value.id, 'MODIF')
        .then(response => {
          let blob = new Blob([response.data], { type: 'application/csv' });
          fileLink.value = window.URL.createObjectURL(blob);
          fileName.value = `fichier_demande_${demande.value.id}.csv`;
        })
    })
    .catch(err => {
      alertMessage.value = err.response.data.message;
      alertType.value = 'error';
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function modifierTypeTraitementModifDemande(){
  isLoading.value = true;
  demandesService.modifierTypeTraitementModifDemande(demande.value.id, typeTraitementSelected.value.id)
    .then(response => {
      demande.value = response.data;
      next()
    }).catch(err => {
      emits('backendError', err);
  }).finally(() => {
      isLoading.value = false;
    });
}
function downloaded(){
  isDownloaded.value = true;
}
function deleteDemande(){
  demandesService.deleteDemande(demande.value.id, 'MODIF')
    .then(()=>{
      router.push('/accueil');
    }).catch(err => {
    emits('backendError', err);
  })
}

function razBeforeNext(){
  isLoaded.value = false;
  isLoading.value = false;
  isDownloaded.value = false;
  next();
}
function next(){
  currentStep.value++;
}
function prev(){
  currentStep.value--;
  changeEtape();
}

function changeEtape() {
  if((currentStep.value + 1) <= 2) { //Changement d'etat pour le chargement du fichier car le back est perdu sinon
    demandesService.choixEtape(demande.value.id, 2, 'MODIF')
      .then(response => {
        demande.value = response.data;
      });
  }
}

</script>
