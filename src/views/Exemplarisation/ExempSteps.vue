<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col md="7">
        <v-stepper v-model="currentStep" alt-labels>
          <v-stepper-header>
            <v-stepper-item
              editable
              icon="mdi-numeric-1"
              title="Séléction du RCR"
              :subtitle="demande ? 'Demande n°'+demande.id : 'Demande'"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              editable
              icon="mdi-numeric-2"
              title="Type Document"
              :subtitle="typeDocumentSelected"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              editable
              icon="mdi-numeric-3"
              title="Chargement"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
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
              <v-btn @click="next">
                next
              </v-btn>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <type-exemp></type-exemp>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  prev
                </v-btn>
                <v-btn @click="next">
                  next
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <upload-file v-model="fileSelected" >Charger le fichier des exemplaires à traiter</upload-file>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  prev
                </v-btn>
                <v-btn @click="next">
                  next
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <p>simulation</p>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  prev
                </v-btn>
              </v-container>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

import { ref } from 'vue';
import UploadFile from '@/components/UploadFile.vue';
import Rcr from '@/components/Rcr.vue';
import DemandesService from '@/service/DemandesService';
import TypeExemp from '@/components/TypeExemp.vue';

const demande = ref();
const currentStep = ref(0);
const typeDocumentSelected = ref();
const rcrSelected = ref()
const fileSelected = ref();

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    DemandesService.modifierDemande(demande.value.id, rcrSelected.value, 'EXEMP')
      .then(response => {
        demande.value = response.data;
        next();
      });
  } else {
    DemandesService.creerDemande(rcrSelected.value, 'EXEMP')
      .then(response => {
        demande.value = response.data;
        next();
      });
  }
}

function next() {
  currentStep.value++;
}
function prev() {
  currentStep.value--;
}
</script>
