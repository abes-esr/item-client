<template>
  <v-dialog v-model="demande.expanded" @after-leave="commentaire=demande.commentaire" width="500">
    <v-card>
      <v-card-title>
        Note de la demande {{demande.id}}
      </v-card-title>
      <v-card-text>
        <v-textarea label="Commentaire" v-model="commentaire">
        </v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="save()">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref} from "vue";
import itemService from "@/service/DemandesService";

const emits = defineEmits(['save'])
const props = defineProps({
  demande: {
    required: true,
    type: Object
  }
})
const commentaire = ref(props.demande.commentaire);

function save(){
  if(!commentaire.value)
    commentaire.value = '';
  itemService.modifierCommentaireDemande(props.demande.id, commentaire.value, props.demande.type)
    .then(() => {
      props.demande.expanded = false;
      emits('save');
    })
}
</script>
