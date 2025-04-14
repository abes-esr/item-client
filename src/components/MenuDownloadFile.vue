<template>
  <v-btn :disabled="!isDownloadable" aria-label="Télécharger les fichiers" color="info" flat size="small"
         title="Télécharger">
    <v-icon size="x-large">mdi-cloud-download</v-icon>
    <v-menu bottom left activator="parent">
      <v-list v-if="demande.type === 'RECOUV'">
        <v-list-item @click="downloadFile('fichier_enrichi', '.csv')">
          <!--          FICHIER ENRICHI RECOUV         -->
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <!--          FICHIER RESULTAT RECOUV         -->
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="demande.type === 'EXEMP'">
        <v-list-item @click="downloadFile('fichier_enrichi', '.csv')">
          <!--          FICHIER ENRICHI EXEMP         -->
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <!--          FICHIER RESULTAT EXEMP         -->
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="demande.type === 'MODIF'">
        <v-list-item @click="downloadFile('fichier_initial', '.txt')">
          <!--          FICHIER INITIAL MODIF         -->
          <v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title>
        </v-list-item>
        <v-list-item @click="downloadFile('fichier_prepare', '.csv')">
          <!--          FICHIER PREPARE MODIF         -->
          <v-list-item-title>Télécharger le fichier PPN:RCR:EPN</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isEnrichiAvailable" @click="downloadFile('fichier_enrichi', '.csv')">
          <!--          FICHIER ENRICHI MODIF         -->
          <v-list-item-title>Télécharger le fichier enrichi</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <!--          FICHIER RESULTAT MODIF         -->
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="demande.type === 'SUPP'">
        <v-list-item @click="downloadFile('fichier_initial_' + demande.typeSuppression.toLowerCase(), '.txt')">
          <!--          FICHIER INITIAL SUPP         -->
          <v-list-item-title>Télécharger le fichier initial des {{ demande.typeSuppression }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="downloadFile('fichier_correspondance', '.csv')">
          <!--          FICHIER PREPARE SUPP         -->
          <v-list-item-title>
            Télécharger le fichier PPN:RCR:EPN
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="demande.typeSuppression === 'PPN' && isEnrichiAvailable" @click="downloadFile('fichier_valide', '.csv')">
          <!--          FICHIER ENRICHI SUPP         -->
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <!--          FICHIER RESULTAT SUPP         -->
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isSauvegardeAvailable" @click="downloadFile('fichier_sauvegarde', '.txt')">
          <v-list-item-title>Télécharger le fichier de sauvegarde .txt</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isSauvegardeAvailable" @click="downloadFile('fichier_sauvegarde', '.csv')">
          <v-list-item-title>Télécharger le fichier de sauvegarde .csv</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup>
import itemService from '@/service/ItemService';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  demande: {
    required: true,
    type: Object
  }
})
const emits = defineEmits(['onError']);

const etatsDemande = ref([]);

const idEtatCurrentDemande = computed(() => {
  if (etatsDemande.value.length > 0)
    return etatsDemande.value.find(etat => etat.libelle === props.demande.etatDemande)?.id ?? -1;
  else {
    return -1;
  }
})

const isDownloadable = computed(() => idEtatCurrentDemande.value >= 3)
const isEnrichiAvailable = computed(() =>
  (idEtatCurrentDemande.value >= 4 && props.demande.type === 'MODIF') ||
  (idEtatCurrentDemande.value >= 5 && props.demande.type === 'SUPP')
)
const isResultatAvailable = computed(() => idEtatCurrentDemande.value >= 7 && idEtatCurrentDemande.value !== 8 && props.demande.pourcentageProgressionTraitement > 0)
const isSauvegardeAvailable = computed(() => idEtatCurrentDemande.value >= 7  && props.demande.pourcentageProgressionTraitement > 0)

onMounted(() => {
  itemService.getEtatsDemande()
    .then(response => {
      etatsDemande.value = response.data;
    })
    .catch( err => {
      emits('onError', err);
  })
})

function downloadFile(filePrefix, extension) {
  itemService.getFile(props.demande.id, props.demande.type, filePrefix, extension)
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filePrefix}_${props.demande.id}${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch( err => {
      emits('onError', err);
  })
}
</script>
