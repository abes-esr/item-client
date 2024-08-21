<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col md="7">
        <v-stepper v-model="currentStep" alt-labels>
          <v-stepper-header>
            <v-stepper-item
              :color="currentStep >= 0 ? '#295494' : ''"
              :complete="currentStep > 0"
              :editable="demande"
              icon="mdi-numeric-1"
              title="Séléction du RCR"
              :subtitle="demande ? 'Demande n°'+demande.id : 'Demande'"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 1 ? '#295494' : ''"
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
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-card-title class="headline" primary-title>Traitement validé</v-card-title>
            <v-card-text>Votre demande est en cours de traitement.<br/>Un mail vous sera envoyé quand celui-ci sera
              terminé.
              <br>Vous pouvez retrouver l'ensemble de vos demandes sur votre tableau de bord ITEM. Rubrique "Gérer mes
              taux de recouvrement".
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="router.push('recouvrement-tableau')" aria-label="OK">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
  <dialog-suppression v-model="suppDialog" :demande="demande" return-to-accueil></dialog-suppression>
</template>

<script setup>
import Rcr from '@/components/Rcr.vue';
import SelectFile from '@/components/SelectFile.vue';
import { onMounted, ref } from 'vue';
import DemandesService from '@/service/DemandesService';
import router from '@/router';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';

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



onMounted(() => {
  if(props.id){
    DemandesService.getDemande(props.id, "RECOUV")
      .then(response => {
        demande.value = response.data;
        if(demande.value.etatDemande === 'En préparation'){
          currentStep.value = 1;
          rcrSelected.value = demande.value.rcr;
        }
      }).catch(() => {
        router.replace("/recouvrement");
    })
  }
})

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    DemandesService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'RECOUV')
      .then(response => {
        demande.value = response.data;
        next();
      }).catch(err => {
        emits('backendError',err);
    });
  } else {
    DemandesService.creerDemande(rcrSelected.value, 'RECOUV')
      .then(response => {
        demande.value = response.data;
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
  DemandesService.uploadDemande(demande.value.id, fileSelected.value, 'RECOUV')
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
</script>
