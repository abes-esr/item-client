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
              :color="currentStep >= 3 ? '#295494' : ''"
              :complete="currentStep > 3"
              editable
              icon="mdi-numeric-4"
              title="Envoi"
              subtitle="du fichier"
            >
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :color="currentStep >= 4 ? '#295494' : ''"
              icon="mdi-numeric-5"
              title="Simulation"
            >
            </v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item>
<!--              <rcr v-model="rcrSelected" :is-loading="isLoading"></rcr>-->
<!--              <v-container class="d-flex justify-space-between">-->
<!--                <v-spacer></v-spacer>-->
<!--                <v-btn-->
<!--                  :disabled="!rcrSelected"-->
<!--                  @click="createDemande"-->
<!--                >-->
<!--                  Valider-->
<!--                </v-btn>-->
<!--              </v-container>-->
            </v-stepper-window-item>
            <v-stepper-window-item>
              <type-file v-if="!typeFileSelected" v-model="typeFileSelected"></type-file>
              <select-file v-else v-model="fileSelected">Selection du fichier {{typeFileSelected}}</select-file>
              <v-alert
                v-if="alertMessage"
                :type="alertType"
              >
                <span v-html="alertMessage"></span>
              </v-alert>
              <v-container class="d-flex justify-space-between">
                <v-btn v-if="typeFileSelected" @click="prevSelectTypeFile">
                  précédent
                </v-btn>
                <v-btn v-else @click="prev">
                  précédent
                </v-btn>
                <v-btn
                  v-if="typeFileSelected"
                  :disabled="!fileSelected"
                  @click="uploadFile()"
                >
                  Envoyer
                </v-btn>
              </v-container>
            </v-stepper-window-item>
            <v-stepper-window-item>
            </v-stepper-window-item>
            <v-stepper-window-item>

            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TypeFile from '@/components/Supp/TypeFile.vue';
import SelectFile from '@/components/SelectFile.vue';
import demandesService from '@/service/DemandesService';




const currentStep = ref(0);
const demande = ref();

const emits = defineEmits(['backendError']);
const props = defineProps({id: {type: String}});

const typeFileSelected = ref();
const fileSelected = ref();
const isLoading = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

onMounted(() => {
  demandesService.creerDemande('341725201', 'SUPP')
    .then(response => {
      demande.value = response.data;
      next();
    })
})
function uploadFile() {
  alertMessage.value = '';
  alertType.value = 'success';
  isLoading.value = true;
  demandesService.uploadDemande(1, fileSelected.value, 'SUPP')
    .then(() => {
      alertMessage.value = "Fichier envoyé";
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
  raz();
}
function next() {
  currentStep.value++;
  raz();
}

function prev() {
  currentStep.value--;
  raz();
}

function raz(){
  isLoading.value = false;
  alertMessage.value = '';
  alertType.value = 'success';
}
</script>
