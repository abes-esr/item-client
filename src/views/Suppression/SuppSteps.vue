<template>
  <v-container :class="(currentStep === 4) ? '' : 'fill-height'" fluid>
    <v-row align="center" justify="center">
      <v-col :md="(currentStep === 4) ? '' : '7'">
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

            </v-stepper-window-item>
            <v-stepper-window-item>
              <
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
import { ref } from 'vue';




const currentStep = ref(0);
const demande = ref();

const emits = defineEmits(['backendError']);
const props = defineProps({id: {type: String}});



function next() {
  currentStep.value++;
}

function prev() {
  currentStep.value--;
}
</script>
