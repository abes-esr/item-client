<template>
  <!-- POPUP DE LANCEMENT DU TRAITEMENT-->
  <v-dialog v-model="dialog" width="500">
    <v-skeleton-loader
      :loading="isLoading"
      class="mx-auto"
      elevation="12"
      width="500"
      type="table-heading, list-item-two-line, table-tfoot"
    >
      <v-sheet class="pa-1" rounded color="primary" elevation="3">
        <v-sheet class="pa-10" rounded>
          <v-card class="ma-0 pa-6" elevation="0">
            <v-card-title primary-title>{{title}}</v-card-title>
            <v-card-text v-if="!isFinished">
              <span style="font-size: small">
                <p v-html="props.body"></p>
              </span>
            </v-card-text>
            <v-card-text v-else>
              <span style="font-size: small">
                <p>
                  Votre demande est en cours de traitement.<br/>
                  Un mail vous informera du résultat.<br/>
                  L'ensemble de vos demandes est à retrouver dans votre tableau de bord.<br/>
                  <span v-if="rubrique">
                    Rubrique : <b>{{ rubrique }}</b>
                  </span>.
                </p>
                <p v-if="isDat" class="mt-4">
                  <b>Pour une requête de type Date / Auteur / Titre, les demandes sont traitées chaque soir à 20h00</b>
                </p>
              </span>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-space-between">
              <v-btn v-if="!isFinished" color="primary" @click="dialog = false" aria-label="Annuler">Annuler</v-btn>
              <v-spacer v-else></v-spacer>
              <v-btn v-if="!isFinished" color="primary" @click="confirm()" aria-label="Valider">Valider</v-btn>
              <v-btn v-else color="primary" @click="router.push({name: route})" aria-label="OK">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-sheet>
    </v-skeleton-loader>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';

const dialog = defineModel();
const emits = defineEmits(['launch'])
const props = defineProps({
  isLoading: {
    required: false,
    type: Boolean,
    default: false
  },
  route: {
    required: true,
    type: String,
  },
  title: {
    required: false,
    type: String,
    default: 'Lancement du traitement en production'
  },
  body: {
    required: false,
    type: String,
    default: 'Êtes-vous sûr de vouloir lancer le traitement en production ?<br/> Aucune annulation n\'est possible.'
  },
  rubrique: {
    required: false,
    type: String
  },
  isDat: {
    required: false,
    type: Boolean
  }
})
const title = ref(props.title);
const isFinished = ref(false);

function confirm() {
  emits('launch');
  title.value = "Traitement validé";
  isFinished.value = true;
}
</script>
