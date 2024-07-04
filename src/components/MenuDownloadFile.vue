<template>
  <v-btn v-if="idEtatCurrentDemande >= 3" aria-label="Télécharger les fichiers" color="info" flat size="small"
         title="Télécharger">
    <v-icon size="x-large">mdi-cloud-download</v-icon>
    <v-menu bottom left activator="parent">
      <!-- FICHIERS MODIF -->
      <v-list>
        <v-list-item @click="downloadFile('fichier_initial', '.txt')" v-if="demande.type === 'MODIF' && idEtatCurrentDemande >= 3">
          <v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title>
        </v-list-item>
        <v-list-item @click="downloadFile('fichier_prepare', '.csv')" v-if="demande.type === 'MODIF' && idEtatCurrentDemande >= 3">
          <v-list-item-title>Télécharger le fichier de correspondance PPN/EPN</v-list-item-title>
        </v-list-item>
        <v-list-item @click="downloadFile('fichier_enrichi', '.csv')" v-if="demande.type === 'MODIF' && idEtatCurrentDemande >= 4">
          <v-list-item-title>Télécharger le fichier enrichi</v-list-item-title>
        </v-list-item>

        <v-list-item @click="downloadFile('fichier_enrichi', '.csv')"
                     v-if="(demande.type === 'RECOUV' && idEtatCurrentDemande >= 3) || (demande.type === 'EXEMP' && idEtatCurrentDemande >= 3)">
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>

        <v-list-item @click="downloadFile('fichier_resultat', '.csv')" v-if="idEtatCurrentDemande >= 7 && idEtatCurrentDemande !== 8">
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup>
import demandesService from '@/service/DemandesService';
import {computed, onMounted, ref} from 'vue';

const props = defineProps({
  demande: {
    required: true,
    type: Object
  }
})
const etatsDemande = ref([]);
const idEtatCurrentDemande = computed(() => {
  if (etatsDemande.value.length > 0)
    return etatsDemande.value.filter(etat => etat.libelle === props.demande.etatDemande).map(etat => etat.id)[0];
  else {
    return -1;
  }
})


onMounted(() => {
  demandesService.getEtatsDemande()
    .then(response => {
      etatsDemande.value = response.data;
    })
})

function downloadFile(filePrefix, extention) {
  demandesService.getFile(props.demande.id, props.demande.type, filePrefix, extention)
    .then(response => {
        console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filePrefix}_${props.demande.id}${extention}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
}
</script>
