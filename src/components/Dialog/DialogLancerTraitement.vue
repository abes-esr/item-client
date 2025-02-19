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
      <v-card style="border: 3px solid blue">
        <v-card-title primary-title>{{title}}</v-card-title>
        <v-card-text><span style="font-size: small" v-html="body"></span></v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-space-between">
          <v-btn v-if="!isFinished" color="primary" @click="dialog = false" aria-label="Annuler">Annuler</v-btn>
          <v-spacer v-else></v-spacer>
          <v-btn v-if="!isFinished" color="primary" @click="confirm()" aria-label="Valider">Valider</v-btn>
          <v-btn v-else color="primary" @click="router.push({name: route})" aria-label="OK">OK</v-btn>
        </v-card-actions>
      </v-card>
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
  rubrique: {
    required: true,
    type: String,
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
  }
})
const title = ref(props.title);
const body = ref(props.body);
const isFinished = ref(false);

function confirm() {
  emits('launch');
  title.value = "Traitement validé";
  if(props.rubrique === 'Gérer mes créations'){
    body.value = `Votre demande est en cours de traitement.<br/>Un mail vous informera du résultat.<br/>L'ensemble de vos demandes est à retrouver dans votre tableau de bord. Rubrique ${props.rubrique}.<br/><br/><b>Pour une requête de type Date / Auteur / Titre, les demandes sont traitées chaque soir à 20h00</b>`;
  }else if(props.rubrique === 'Gérer mes modifications'){
    body.value = `Votre demande est en cours de traitement.<br/>Un mail vous informera du résultat.<br/>L'ensemble de vos demandes est à retrouver dans votre tableau de bord. Rubrique ${props.rubrique}.`;
  }else if(props.rubrique === 'Gérer mes recouvrements'){
    body.value = `Votre demande est en cours de traitement.<br/>Un mail vous informera du résultat.<br/>L'ensemble de vos demandes est à retrouver dans votre tableau de bord. Rubrique ${props.rubrique}.<br/><br/><b>Pour une requête de type Date / Auteur / Titre, les demandes sont traitées chaque soir à 20h00</b>`;
  }else if(props.rubrique === 'Gérer mes suppressions'){
    body.value = `Votre demande est en cours de traitement.<br/>Un mail vous informera du résultat.<br/>L'ensemble de vos demandes est à retrouver dans votre tableau de bord. Rubrique ${props.rubrique}.`;
  }else{
    body.value = `Votre demande est en cours de traitement.<br/>Un mail vous informera du résultat.<br/>L'ensemble de vos demandes est à retrouver dans votre tableau de bord.`;
  }
  isFinished.value = true;
}
</script>
