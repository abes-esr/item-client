<template>
  <v-container :class="(currentStep === 3) ? '' : 'fill-height'" fluid>
    <v-row align="center" justify="center">
      <v-col :md="(currentStep === 3) ? '' : '7'">
        <v-stepper  v-model="currentStep" @update:model-value="changeEtat()" alt-labels>
          <v-stepper-header>
            <v-stepper-item
              :color="currentStep >= 0 ? 'primary' : ''"
              :complete="currentStep > 0"
              :editable="currentStep > 0"
              icon="mdi-numeric-1"
              title="Sélection du RCR"
              :subtitle="demande ? 'Demande n°'+demande.id : 'Demande'"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 1 ? 'primary' : ''"
              :complete="currentStep > 1"
              :editable="currentStep > 1"
              icon="mdi-numeric-2"
              title="Type Document"
              :subtitle="typeDocumentSelected ? typeDocumentSelected.libelle : ''"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 2 ? 'primary' : ''"
              :complete="currentStep > 2"
              :editable="currentStep > 2"
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
              <type-exemp v-model="typeDocumentSelected" :is-loading="isLoading" @deleted="deleteDemande()" @click="modifiTypeExemp"></type-exemp>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  précédent
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <select-file v-model="fileSelected" :is-loading="isLoading" @deleted="deleteDemande()">Charger le fichier des exemplaires à traiter</select-file>
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
                  @click="uploadFile"
                >
                  Lancer le traitement en simulation
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <simulation :demande="demande" label-before="Exemplaire(s) existant(s)" label-after="Exemplaire à créer" @deleted="deleteDemande()"></simulation>
              <v-container class="d-flex justify-space-between">
                <v-btn @click="prev">
                  précédent
                </v-btn>
                <v-btn large @click="dialog = true"
                       aria-label="Lancer le traitement en production">Lancer le traitement en production
                </v-btn>
              </v-container>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
  <dialog-lancer-traitement v-model="dialog" :is-loading="isLoading" rubrique="Gérer mes créations" route="/exemplarisation-tableau" @launch="launchDemande()"></dialog-lancer-traitement>
  <dialog-suppression  v-model="suppDialog" :demande="demande" return-to-accueil></dialog-suppression>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import itemService from '@/service/DemandesService';
import router from '@/router';
import SelectFile from '@/components/SelectFile.vue';
import Rcr from '@/components/Rcr.vue';
import TypeExemp from '@/components/Exemp/TypeExemp.vue';
import Simulation from "@/components/Simulation.vue";
import DialogLancerTraitement from '@/components/Dialog/DialogLancerTraitement.vue';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';

const emits = defineEmits(['backendError', 'backendSuccess', 'login-success'])
const props = defineProps({id : {type: String}});

const demande = ref();
const currentStep = ref(0);
const typeDocumentSelected = ref();
const rcrSelected = ref()
const fileSelected = ref();
const alertMessage = ref();
const alertType = ref();
const isLoading = ref(false);
const dialog = ref(false);
const suppDialog = ref(false);

onMounted(()=>{
  if(props.id){
    itemService.getDemande(props.id, "EXEMP")
      .then(response => {
        demande.value = response.data;
        switch (demande.value.etatDemande) {
          case 'En préparation':
            currentStep.value = 1;
            rcrSelected.value = demande.value.rcr;
            break;
          case 'A compléter':
            currentStep.value = 2;
            rcrSelected.value = demande.value.rcr;
            typeDocumentSelected.value = {
              id: -1,
              libelle: demande.value.typeExemp
            };
            break;
          case 'En simulation':
            currentStep.value = 3;
            rcrSelected.value = demande.value.rcr;
            typeDocumentSelected.value = {
              id: -1,
              libelle: demande.value.typeExemp
            };
            break;
        }
      }).catch(() => {
      router.replace("/exemplarisation");
    })
  }
})

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    isLoading.value = true;
    itemService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'EXEMP')
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
    itemService.creerDemande(rcrSelected.value, 'EXEMP')
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

function modifiTypeExemp() {
  if(demande.value.typeExemp === typeDocumentSelected.value.libelle){
    next();
  } else {
    isLoading.value = true;
    itemService.modifierTypeExempDemande(demande.value.id, typeDocumentSelected.value.id)
      .then(response => {
        demande.value = response.data
        next()
      })
      .catch(err => {
        emits('backendError', err);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
}

function uploadFile() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  itemService.uploadDemande(demande.value.id, fileSelected.value, 'EXEMP')
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

function launchDemande(){
  isLoading.value = true;
  itemService.lancerDemande(demande.value.id,'EXEMP')
    .then(response => {
      demande.value = response.data;
    }).finally(() => {
      isLoading.value = false;
  })
}

function deleteDemande(){
  suppDialog.value = true;
}

function next() {
  currentStep.value++;
}
function prev() {
  currentStep.value--;
  changeEtat();
}

function changeEtat() {
  if((currentStep.value + 1) === 3) { //Changement d'etat pour le chargement du fichier car le back est perdu sinon
    itemService.choixEtape(demande.value.id, currentStep.value + 1, 'EXEMP')
      .then(response => {
        demande.value = response.data;
      });
  }
}
</script>
