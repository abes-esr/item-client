<template>
  <v-container :class="(currentStep === 4) ? '' : 'fill-height'" fluid>
    <v-col class="fill-height">
      <v-row align="center" justify="center">
        <recap-demande v-if="currentStep < 4" :demande="demande"></recap-demande>
      </v-row>
      <v-row align="center" justify="center">
        <v-col :md="(currentStep === 4) ? '' : '7'">
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
                title="PPN/RCR/EPN"
                subtitle="fichier à récupérer"
              >
              </v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item
                :color="currentStep >= 2 ? 'primary' : ''"
                :complete="currentStep > 2"
                :editable="currentStep > 2"
                icon="mdi-numeric-3"
                title="Choix traitement"
                :subtitle="typeTraitementSelected ? typeTraitementSelected.libelle : 'à effectuer'"
              >
              </v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item
                :color="currentStep >= 3 ? 'primary' : ''"
                :complete="currentStep > 3"
                :editable="currentStep > 3"
                icon="mdi-numeric-4"
                title="Envoi"
                subtitle="du fichier"
              >
              </v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item
                :color="currentStep >= 4 ? 'primary' : ''"
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
                <select-file v-if="!isLoaded" v-model="fileInitSelected" :is-loading="isLoading"
                             @deleted="deleteDemande()">Charger le fichier des exemplaires à traiter</select-file>
                <download-file v-else :file-link="fileLink" :file-name="fileName" @clicked="downloaded" @deleted="deleteDemande()">Récupération du
                  fichier de correspondances PPN / EPN
                </download-file>
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
                    :disabled="!fileInitSelected"
                    @click="uploadFileInit()"
                    v-if="!isLoaded"
                  >
                    Envoyer
                  </v-btn>
                  <v-btn
                    v-else
                    :disabled="!isDownloaded"
                    @click="next()"
                  >
                    Suivant
                  </v-btn>
                </v-container>
              </v-stepper-window-item>
              <v-stepper-window-item>
                <type-traitement v-model="typeTraitementSelected" :is-loading="isLoading"
                                 @clicked="modifierTypeTraitementModifDemande()" @deleted="deleteDemande()"></type-traitement>
                <v-container class="d-flex justify-space-between">
                  <v-btn @click="prev">
                    précédent
                  </v-btn>
                </v-container>
              </v-stepper-window-item>
              <v-stepper-window-item>
                <select-file v-model="fileFinalSelected" :is-loading="isLoading" @deleted="deleteDemande()">Charger le
                  fichier des exemplaires à modifier
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
                  >
                    Lancer le traitement en simulation
                  </v-btn>
                </v-container>
              </v-stepper-window-item>
              <v-stepper-window-item>
                <simulation :demande="demande" label-before="Avant traitement" label-after="Après traitement"
                            @deleted="deleteDemande()"></simulation>
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
    </v-col>
  </v-container>
  <dialog-lancer-traitement v-model="dialog" :is-loading="isLoading" rubrique="Gérer mes modifications"
                            route="modification-tableau" @launch="launchDemande()"></dialog-lancer-traitement>
  <dialog-suppression v-model="suppDialog" :demande="demande" return-to-accueil></dialog-suppression>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import itemService from '@/service/ItemService';
import Rcr from '@/components/Rcr.vue';
import SelectFile from '@/components/SelectFile.vue';
import DownloadFile from '@/components/DownloadFile.vue';
import TypeTraitement from '@/components/Modif/TypeTraitement.vue';
import Simulation from '@/components/Simulation.vue';
import DialogLancerTraitement from '@/components/Dialog/DialogLancerTraitement.vue';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';
import RecapDemande from '@/components/RecapDemande.vue';

const currentStep = ref(0);
const demande = ref();
const rcrSelected = ref();
const fileInitSelected = ref();
const fileFinalSelected = ref();
const alertMessage = ref();
const alertType = ref();
const isLoaded = ref(false);
const isLoading = ref(false);
const isDownloaded = ref(false);
const dialog = ref(false);
const suppDialog = ref(false);
const fileLink = ref('');
const fileName = ref('');
const typeTraitementSelected = ref();

const emits = defineEmits(['backendError']);
const props = defineProps({ id: { type: String } });

watch(router.currentRoute, (newValue) => {
  if (newValue.fullPath.includes("empty")) {
    cleanPath()
    currentStep.value = 1;
    prev();
  }
})

onMounted(() => {
  if (props.id) {
    itemService.getDemande(props.id, 'MODIF')
      .then(response => {
        demande.value = response.data;
        switch (demande.value.etatDemande) {
          case 'En préparation':
            currentStep.value = 1;
            rcrSelected.value = demande.value.rcr;
            break;
          case 'Préparée':
            currentStep.value = 1;
            rcrSelected.value = demande.value.rcr;
            break;
          case 'A compléter':
            rcrSelected.value = demande.value.rcr;
            if (demande.value.traitement) {
              typeTraitementSelected.value = {
                id: -1,
                libelle: demande.value.traitement
              };
              currentStep.value = 3;
            } else {
              currentStep.value = 2;
            }
            break;
          case 'En simulation':
            currentStep.value = 4;
            rcrSelected.value = demande.value.rcr;
            typeTraitementSelected.value = {
              id: -1,
              libelle: demande.value.traitement
            };
            break;
        }
      })
      .catch(() => {
        router.replace('/modification');
      });
  } else {
    cleanPath();
  }
});

function cleanPath() {
  if (router.currentRoute.value.fullPath.includes("empty")) {
    router.replace('/modification');
    router.currentRoute.value.fullPath = "/modification";
  }
}

function createDemande() {
  if (demande.value && (rcrSelected.value === demande.value.rcr)) {
    next();
  } else if (demande.value) {
    isLoading.value = true;
    itemService.modifierRcrDemande(demande.value.id, rcrSelected.value, 'MODIF')
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
  } else {
    isLoading.value = true;
    itemService.creerDemande(rcrSelected.value, 'MODIF')
      .then(response => {
        demande.value = response.data;
        router.replace(`/modification/${demande.value.id}`);
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

function uploadFileInit() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  itemService.uploadDemande(demande.value.id, fileInitSelected.value, demande.value.type)
    .then(() => {
      alertMessage.value = 'Fichier envoyé';
      itemService.getFile(demande.value.id, 'MODIF', 'fichier_prepare', '.csv')
        .then(response => {
          let blob = new Blob([response.data], { type: 'application/csv' });
          fileLink.value = window.URL.createObjectURL(blob);
          fileName.value = `fichier_demande_${demande.value.id}.csv`;
          isLoaded.value = true;
        });
    })
    .catch(err => {
      alertMessage.value = err.response.data.message;
      alertType.value = 'error';
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function uploadFileFinal() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  itemService.uploadDemande(demande.value.id, fileFinalSelected.value, 'MODIF')
    .then(() => {
      itemService.getDemande(demande.value.id, demande.value.type)
        .then(response => {
          demande.value = response.data;
        });
      alertMessage.value = 'Fichier envoyé';
      isLoaded.value = true;
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

function modifierTypeTraitementModifDemande() {
  isLoading.value = true;
  itemService.modifierTypeTraitementModifDemande(demande.value.id, typeTraitementSelected.value.id)
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

function launchDemande() {
  isLoading.value = true;
  itemService.lancerDemande(demande.value.id, 'MODIF')
    .then(response => {
      demande.value = response.data;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function downloaded() {
  isDownloaded.value = true;
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
  if ((currentStep.value + 1) <= 2) { //Changement d'etat pour le chargement du fichier car le back est perdu sinon
    itemService.choixEtape(demande.value.id, 2, 'MODIF')
      .then(response => {
        demande.value = response.data;
      });
  }
  if ((currentStep.value + 1) === 4) {
    itemService.choixEtape(demande.value.id, 4, 'MODIF')
      .then(response => {
        demande.value = response.data;
      });
  }
}

function raz() {
  isLoaded.value = false;
  isLoading.value = false;
  isDownloaded.value = false;
  alertMessage.value = '';
  alertType.value = 'success';
}

</script>
