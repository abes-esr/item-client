<template>
  <v-container class="fill-height" fluid>
    <v-col :class="(currentStep === 3) ? '' : 'fill-height'">
      <v-row>
        <recap-demande v-if="currentStep !== 3" :demande="demande"></recap-demande>
      </v-row>
      <v-row align="center" justify="center">
        <v-col md="7">
          <v-stepper v-model="currentStep" @update:model-value="changeEtape()" alt-labels>
            <v-stepper-header>
              <v-stepper-item
                :color="currentStep >= 0 ? 'primary' : ''"
                :complete="currentStep > 0"
                :editable="currentStep > 0"
                icon="mdi-numeric-1"
                title="Sélection du RCR"
                :subtitle="demande ? rcrSelected : 'Demande'"
              >
              </v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item
                :color="currentStep >= 1 ? 'primary' : ''"
                :complete="currentStep > 1"
                :editable="currentStep > 1"
                icon="mdi-numeric-2"
                title="Chargement"
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
                    @click="createDemande"
                  >
                    Valider
                  </v-btn>
                </v-container>
              </v-stepper-window-item>
              <v-stepper-window-item>
                <select-file v-model="fileSelected" :is-loading="isLoading" @deleted="deleteDemande()">
                  Charger le fichier du taux de recouvrement
                </select-file>
                <v-alert
                  v-if="alertMessage"
                  :type="alertType"
                  :icon="alertType === 'error' ? 'mdi-alert' : null"
                >
                  <span v-html="alertMessage"></span>
                </v-alert>
                <v-container class="d-flex justify-space-between">
                  <v-btn @click="prev">
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
                            route="recouvrement-tableau"
                            body="Voulez-vous démarrer le traitement de votre demande de recouvrement ?"
                            bodyComplement="<p class='mb-4'>Votre demande est en cours de traitement.<br/>Un mail vous informera du résultat.<br/>L'ensemble de vos demandes est à retrouver dans votre tableau de bord. Rubrique <b>Gérer mes recouvrements</b>.</p><p><b>Pour une requête de type Date / Auteur / Titre, les demandes sont traitées chaque soir à 20h00</b></p>"
                            @launch="launchDemande()">
  </dialog-lancer-traitement>
  <dialog-suppression v-model="suppDialog" :demande="demande" return-to-accueil></dialog-suppression>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import itemService from '@/service/ItemService';
import Rcr from '@/components/Rcr.vue';
import SelectFile from '@/components/SelectFile.vue';
import DialogLancerTraitement from '@/components/Dialog/DialogLancerTraitement.vue';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';
import RecapDemande from '@/components/RecapDemande.vue';

const props = defineProps({ id: { type: String } });
const emits = defineEmits(['backendError', 'backendSuccess']);

const currentStep = ref(0);
const demande = ref({
  id: null,
  rcr: '',
  etatDemande: '',
  type: 'RECOUV'
});
const rcrSelected = ref();
const fileSelected = ref();
const alertMessage = ref();
const alertType = ref();
const isLoading = ref(false);
const dialog = ref(false);
const suppDialog = ref(false);

watch(router.currentRoute, (newValue) => {
  if (newValue.fullPath.includes('empty')) {
    cleanPath();
    raz();
    currentStep.value = 1;
    prev();
  }
});

onMounted(() => {
  if ((props.id !== 'empty') && (props.id != null)) {
    itemService.getDemande(props.id, 'RECOUV')
      .then(response => {
        demande.value = response.data;
        switch (demande.value.etatDemande) {
          case 'En préparation':
            currentStep.value = 1;
            rcrSelected.value = demande.value.rcr;
            break;
          case 'A compléter':
            currentStep.value = 1;
            rcrSelected.value = demande.value.rcr;
            break;
        }
      })
      .catch(() => {
        router.replace('/recouvrement');
      });
  } else {
    cleanPath();
  }
});

function cleanPath() {
  if (router.currentRoute.value.fullPath.includes('empty')) {
    router.replace('/recouvrement');
    router.currentRoute.value.fullPath = '/recouvrement';
  }
}

function createDemande() {
  // Si la demande existe déjà et le RCR est le même
  if (demande.value?.id && rcrSelected.value === demande.value.rcr) {
    next();
  }
  // Si la demande existe et le RCR est différent
  else if (demande.value?.id) {
    isLoading.value = true;
    itemService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'RECOUV')
      .then(response => {
        demande.value = response.data;
        next();
      })
      .catch(err => {
        emits('backendError', err);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
  // Si c'est une nouvelle demande
  else {
    isLoading.value = true;
    itemService.creerDemande(rcrSelected.value, 'RECOUV')
      .then(response => {
        demande.value = response.data;
        router.replace(`/recouvrement/${demande.value.id}`);
        next();
      })
      .catch(err => {
        emits('backendError', err);
      })
      .finally(() => {
        isLoading.value = false;
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

function launchDemande() {
  isLoading.value = true;
  itemService.lancerDemande(demande.value.id, 'RECOUV')
    .then(response => {
      demande.value = response.data;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function deleteDemande() {
  suppDialog.value = true;
}

function next() {
  currentStep.value++;
  raz();
}

function prev() {
  currentStep.value--;
  raz();
  changeEtape();
}

function changeEtape() {
  if ((currentStep.value + 1) === 1) {
    itemService.choixEtape(demande.value.id, 2, 'RECOUV')
      .then(response => {
        demande.value = response.data;
      });
  }
}

function raz() {
  isLoading.value = false;
  alertMessage.value = '';
  alertType.value = 'success';
}
</script>
