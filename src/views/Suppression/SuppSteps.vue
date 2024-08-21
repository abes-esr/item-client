<template>
  <v-container :class="(currentStep === 4) ? '' : 'fill-height'" fluid>
    <v-row align="center" justify="center">
      <v-col :md="(currentStep === 4) ? '' : '7'">
        <v-stepper v-model="currentStep" @update:model-value="changeEtape()" alt-labels>
          <v-stepper-header>
            <v-stepper-item
              :color="currentStep >= 0 ? '#295494' : ''"
              :complete="currentStep > 0"
              editable
              icon="mdi-numeric-1"
              title="Séléction du RCR"
              :subtitle="demande ? 'Demande n°'+demande.id : 'Demande'"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 1 ? '#295494' : ''"
              :complete="currentStep > 1"
              editable
              icon="mdi-numeric-2"
              title="PPN/RCR/EPN"
              :subtitle="typeFileSelected ? 'Fichier '+ typeFileSelected : 'fichier envoyé'"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 2 ? '#295494' : ''"
              :complete="currentStep > 2"
              editable
              icon="mdi-numeric-3"
              title="Envoi"
              subtitle="du fichier"
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
                  :loading="isLoading"
                  @click="createDemande"
                >
                  Valider
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <type-file v-if="!typeFileSelected" v-model="typeFileSelected" @clicked="setTypeSelected()"></type-file>
              <select-file v-else-if="!isLoaded" :is-loading="isLoading" v-model="fileSelected" :typeFile="typeFileSelected">Selection du fichier {{typeFileSelected}}</select-file>
              <download-file v-if="isLoaded" :file-link="fileLink" :file-name="fileName" @clicked="isDownloaded = true">Téléchargement du fichier PPN/RCR/EPN</download-file>
              <v-alert
                v-if="alertMessage"
                :type="alertType"
              >
                <span v-html="alertMessage"></span>
              </v-alert>
              <v-container class="d-flex justify-space-between">
                <v-btn v-if="typeFileSelected && !isLoaded" @click="prevSelectTypeFile">
                  précédent
                </v-btn>
                <v-btn v-else-if="isLoaded" @click="prevSelectFile">
                  précédent
                </v-btn>
                <v-btn v-else @click="prev">
                  précédent
                </v-btn>
                <v-btn
                  v-if="typeFileSelected && !isLoaded"
                  :disabled="!fileSelected"
                  :loading="isLoading"
                  @click="uploadFile()"
                >
                  Envoyer
                </v-btn>
                <v-btn
                  v-if="isLoaded"
                  :disabled="!isDownloaded"
                  @click="next"
                >
                  Suivant
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <select-file v-model="fileFinalSelected" :is-loading="isLoading" @deleted="deleteDemande()">Charger le
                fichier des exemplaires à supprimer
              </select-file>
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
                  :disabled="!fileFinalSelected"
                  @click="uploadFileFinal()"
                  :loading="isLoading"
                >
                  Lancer le traitement en production
                </v-btn>
              </v-container>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-card-title class="headline" primary-title>Traitement validé</v-card-title>
            <v-card-text>Votre demande est en cours de traitement.<br/>Un mail vous sera envoyé quand celui-ci sera
              terminé.
              <br>Vous pouvez retrouver l'ensemble de vos demandes sur votre tableau de bord ITEM. Rubrique "Gérer mes
              suppressions".
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="router.push('suppression-tableau')" aria-label="OK">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import TypeFile from '@/components/Supp/TypeFile.vue';
import SelectFile from '@/components/SelectFile.vue';
import demandesService from '@/service/DemandesService';
import DownloadFile from "@/components/Modif/DownloadFile.vue";
import router from '@/router'
import Rcr from '@/components/Rcr.vue';




const currentStep = ref(0);
const demande = ref();

const emits = defineEmits(['backendError']);
const props = defineProps({id: {type: String}});

const rcrSelected = ref('');
const typeFileSelected = ref('');
const fileFinalSelected = ref();
const fileSelected = ref();
const fileLink = ref('');
const fileName = ref('');
const isLoaded = ref(false);
const isDownloaded = ref(false);
const isLoading = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const dialog = ref(false);


function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    isLoading.value = true;
    demandesService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'SUPP')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
      emits('backendError', err);
    }).finally(() => {
      isLoading.value = false;
    });
  } else {
    isLoading.value = true;
    demandesService.creerDemande(rcrSelected.value, 'SUPP')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
      emits('backendError', err);
    }).finally(() => {
      isLoading.value = false;
    });
  }
}

function uploadFile() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  demandesService.uploadDemande(demande.value.id, fileSelected.value, 'SUPP')
    .then(() => {
      alertMessage.value = "Fichier envoyé";
      isLoaded.value = true;
      demandesService.getFile(demande.value.id, 'SUPP','fichier_prepare', '.csv')
        .then(response => {
          let blob = new Blob([response.data], {type: 'application/csv'});
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
function setTypeSelected(){
  demandesService.modifierTypeFileDemande(demande.value.id, typeFileSelected.value)
}

function changeEtape() {
  if (((currentStep.value + 1) === 1) || ((currentStep.value + 1) === 2 && !typeFileSelected.value)) {
    demandesService.choixEtape(demande.value.id, 1, 'SUPP')
      .then(response => {
        demande.value = response.data;
      });
    typeFileSelected.value = null;
  }
  if ((currentStep.value + 1) === 2 && typeFileSelected.value) { //Changement d'etat pour le chargement du fichier car le back est perdu sinon
    demandesService.choixEtape(demande.value.id, 2, 'SUPP')
        .then(response => {
          demande.value = response.data;
        });
  }
}

function uploadFileFinal() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  demandesService.uploadDemande(demande.value.id, fileFinalSelected.value, 'SUPP')
    .then(() => {
      alertMessage.value = "Fichier envoyé";
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

function prevSelectTypeFile(){
  typeFileSelected.value = null;
  changeEtape()
  raz();
}
function prevSelectFile(){
  changeEtape()
  raz();
}
function next() {
  currentStep.value++;
  raz();
}

function prev() {
  currentStep.value--;
  changeEtape()
  raz();
}

function raz(){
  isLoading.value = false;
  alertMessage.value = '';
  alertType.value = 'success';
  isLoaded.value = false;
  isDownloaded.value = false;
}
</script>
