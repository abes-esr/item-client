<template>
  <v-container :class="(currentStep === 3) ? '' : 'fill-height'" fluid>
    <v-row align="center" justify="center">
      <v-col :md="(currentStep === 3) ? '' : '7'">
        <v-stepper  v-model="currentStep">
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
              title="Type Document"
              :subtitle="typeDocumentSelected ? typeDocumentSelected.libelle : ''"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 2 ? '#295494' : ''"
              :complete="currentStep > 2"
              :editable="currentStep > 2"
              icon="mdi-numeric-3"
              title="Chargement"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <!-- TODO ENLEVER LE EDITABLE -->
            <v-stepper-item
              editable
              icon="mdi-numeric-4"
              title="Simulation"
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
              <type-exemp v-model="typeDocumentSelected" @click="modifiTypeExemp"></type-exemp>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  précédent
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <upload-file v-model="fileSelected" :is-loading="isLoading">Charger le fichier des exemplaires à traiter</upload-file>
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
                  @click="launchTraitement"
                >
                  Lancer le traitement en simulation
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <simulation :demande="demande"></simulation>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  précédent
                </v-btn>
              </v-container>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
  <v-btn @click="console.log(demande)">demande</v-btn>
</template>

<script setup>

import { ref } from 'vue';
import UploadFile from '@/components/UploadFile.vue';
import Rcr from '@/components/Rcr.vue';
import DemandesService from '@/service/DemandesService';
import TypeExemp from '@/components/TypeExemp.vue';
import Simulation from "@/components/Simulation.vue";

const emits = defineEmits(['backendError', 'backendSuccess', 'login-success'])

const demande = ref();
const currentStep = ref(0);
const typeDocumentSelected = ref();
const rcrSelected = ref()
const fileSelected = ref();
const alertMessage = ref();
const alertType = ref();
const isLoading = ref(false);

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    DemandesService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'EXEMP')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
      emits('backendError',err);
    });
  } else {
    DemandesService.creerDemande(rcrSelected.value, 'EXEMP')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
      emits('backendError',err);
    });
  }
}

function modifiTypeExemp() {
  DemandesService.modifierTypeExempDemande(demande.value.id, typeDocumentSelected.value.id)
    .then(response => {
      demande.value = response.data
      next()
    }).catch(err => {
      emits('backendError',err);
  })
}

function launchTraitement() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  DemandesService.uploadDemande(demande.value.id, fileSelected.value, 'EXEMP')
    .then(() => {
      alertMessage.value = "Fichier envoyé";
      next();
    })
    .catch(err => {
      alertMessage.value = err.response.data.message;
      alertType.value = 'error';
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function next() {
  currentStep.value++;
}
function prev() {
  currentStep.value--;
}
</script>
