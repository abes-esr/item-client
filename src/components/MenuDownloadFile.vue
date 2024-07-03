<template>
  <v-menu bottom left v-if="haveAFile()"><template v-slot:activator="{ on }"><v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info" small v-on="on" title="Télécharger"><v-icon>cloud_download</v-icon></v-btn></template>
    <!-- FICHIERS MODIF -->
    <v-list>
      <v-list-item @click="downloadFile('initial')" v-if="demande.type === 'MODIF'"><v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title></v-list-item>
      <v-list-item @click="downloadFile('prepare')" v-if="demande.type === 'MODIF'"><v-list-item-title>Télécharger le fichier de correspondance PPN/EPN</v-list-item-title></v-list-item>
      <v-list-item @click="downloadFile( 'enrichi')" v-if="demande.type === 'MODIF' && demande..codeStatut >= 4"><v-list-item-title>Télécharger le fichier enrichi</v-list-item-title></v-list-item>

      <v-list-item @click="downloadFile('initial')"><v-list-item-title>Télécharger le fichier déposé</v-list-item-title></v-list-item>

      <v-list-item @click="downloadFile('initial')"><v-list-item-title>Télécharger le fichier déposé</v-list-item-title></v-list-item>

      <v-list-item @click="downloadFile('resultat')" v-if="haveResultFile()"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import demandesService from '@/service/DemandesService';
import { onMounted } from 'vue';

const props = defineProps({
  demande: {
    required: true,
    type: Object
  }
})

onMounted(() => {
  demandesService.getEtatDemande()
    .then(response => {
      //todo recuperer les etats de demande pour faire un tableau afin de les comparers avec des supperieurs & inferieur
    })

})

function haveAFile(){
  // return  props.demande.etatDemande === 'Préparée' || props.demande.etatDemande === 'A compléter' || props.demande.etatDemande === 'En simulation' || props.demande.etatDemande === 'En attente' || props.demande.etatDemande === 'En cours' || props.demande.etatDemande === 'Terminé'
  return (props.demande.etatDemande !== 'En préparation' && props.demande.etatDemande !== 'Supprimé');
}

function haveResultFile(){
  return (props.demande.etatDemande === 'Terminé' || props.demande.etatDemande === 'Archivé')
}

function havePrepareFile(){
  return (props.demande.etatDemande === 'Terminé' || props.demande.etatDemande === 'Archivé')
}

function haveResultFile(){
  return (props.demande.etatDemande === 'Terminé' || props.demande.etatDemande === 'Archivé')
}
function downloadFile(filePrefix) {
  demandesService.getFile(props.demande.id, props.demande.type, filePrefix)
    .then(response => {
      console.log(response.data);
    })
}
</script>
