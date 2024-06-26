<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col md="7">
        <v-stepper v-model="currentStep">
          <v-stepper-header>
            <v-stepper-item
              editable
              value="1"
              title="Séléction du RCR"
              :subtitle="demande ? 'Demande n°'+demande.id : 'Demande'"
            >
            </v-stepper-item>
            <v-stepper-item
              value="2"
              title="Téléchargement"
              subtitle="du fichier"
            >
            </v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item
              value="1"
            >
              <rcr v-model="rcrSelected"></rcr>
            </v-stepper-window-item>
            <v-stepper-window-item
              value="2"
            >
              <upload-file v-model="fileSelected"></upload-file>
            </v-stepper-window-item>
          </v-stepper-window>
          <v-container class="d-flex justify-space-between">
            <v-spacer
              v-if="currentStep === 0"
            ></v-spacer>
            <v-btn
              v-if="currentStep === 1"
              @click="prev"
            >
              Retour
            </v-btn>
            <v-btn
              v-if="currentStep === 0"
              :disabled="!rcrSelected"
              @click="createDemande"
            >
              Valider
            </v-btn>
            <v-btn
              v-if="currentStep === 1"
              :disabled="!fileSelected"
              @click="launchTraitement"
            >
              Lancer le traitement
            </v-btn>
          </v-container>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
    <p>step : {{currentStep}} et rcr : {{rcrSelected}} et file : {{fileSelected}}</p>
</template>

<script setup>
import Rcr from '@/components/Rcr.vue';
import UploadFile from '@/components/UploadFile.vue';
import {ref} from 'vue';
import DemandesService from "@/service/DemandesService";

const rcrSelected = ref();
const fileSelected = ref();
const currentStep = ref(0);
const demande = ref();

function createDemande(){
  if(demande.value && (rcrSelected.value === demande.value.rcr)){
    next();
  } else if(demande.value) {
    DemandesService.modifierDemande(demande.value.id, rcrSelected.value, "RECOUV")
      .then(response => {
        demande.value = response.data;
        next();
      })
  } else {
    DemandesService.creerDemande(rcrSelected.value,"RECOUV")
      .then(response => {
        demande.value = response.data;
        next();
      })
  }
}

function launchTraitement(){

}

function next() {
  currentStep.value++
}

function prev() {
  currentStep.value--
}
</script>
