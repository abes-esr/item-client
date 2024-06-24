A<template>
  <v-card class="elevation-12">
    <v-card-title style="background-color: #295494; color: white">
      <span>Sélection du RCR</span>
    </v-card-title>
    <v-card-text class="pt-5">
      <v-autocomplete
        color="info"
        hide-selected
        v-model="rcr"
        :items="listRcr"
        label="Sélectionnez votre RCR dans la liste"
        no-data-text="Aucun RCR correspondant."
        hint="Saisissez le début du RCR de l'établissement ou une partie de son intitulé."
        persistent-hint
      ></v-autocomplete>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="info" :disabled="!rcr" @click="selectRCR">Valider</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import idrefService from '@/service/IdrefService';
import { onMounted, ref } from 'vue';

const listRcr = ref([]);
const rcr = defineModel()
const user = JSON.parse(sessionStorage.getItem('user'));

const emits = defineEmits(['validate'])

onMounted(() => {
  idrefService.getRcrByIln(user.iln)
    .then(response => {
      let result = response.data.sudoc.query.result;
      let item;
      if (Array.isArray(result)) {
        for (const key in result) {
          item = {
            value: result[key].library.rcr,
            title:
              `${result[key].library.rcr
              } - ${
                result[key].library.shortname}`,
            // shortname: result[key].library.shortname,
          };
          listRcr.value.push(item);
        }
      } else {
        // Cette partie du code permet de contourner un bug du WS iln2rcr
        // S'il n'y a qu'un seul résultat il ne revoi pas un tableau d'une seule cas, mais le résultat brut
        // Lorsque ce sera ocrrigé, il suffira de supprimer ce if/else
        item = {
          value: result.library.rcr,
          title:
            `${result.library.rcr
            } - ${
              result.library.shortname}`,
          // shortname: result.library.shortname,
        };
        listRcr.value.push(item);
      }
    });
});

function selectRCR(){
  emits('validate',rcrSelected.value);
}
</script>
