<template>
  <v-btn :disabled="!isDownloadable" aria-label="Télécharger les fichiers" color="info" flat size="small"
         title="Télécharger">
    <v-icon size="x-large">mdi-cloud-download</v-icon>
    <v-menu bottom left activator="parent">
      <v-list v-if="demande.type === 'EXEMP'">
        <v-list-item @click="downloadFile('fichier_valide', '.csv')">
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="demande.type === 'MODIF'">
        <v-list-item @click="downloadFile('fichier_initial_ppn', '.txt')">
          <v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title>
        </v-list-item>
        <v-list-item @click="downloadFile('fichier_correspondance', '.csv')">
          <v-list-item-title>Télécharger le fichier de correspondance EPN/PPN</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isEnrichiAvailable" @click="downloadFile('fichier_enrichi', '.csv')">
          <v-list-item-title>Télécharger le fichier enrichi</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="demande.type === 'RECOUV'">
        <v-list-item @click="downloadFile('fichier_valide', '.csv')">
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else-if="demande.type === 'SUPP'">
        <v-list-item v-if="demande.typeSuppression === 'EPN'" @click="downloadFile('fichier_initial_epn', '.txt')">
          <v-list-item-title>Télécharger le fichier initial des EPN</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="demande.typeSuppression === 'PPN'" @click="downloadFile('fichier_initial_ppn', '.txt')">
          <v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title>
        </v-list-item>
        <v-list-item @click="downloadFile('fichier_correspondance', '.csv')">
          <v-list-item-title v-if="demande.typeSuppression === 'EPN'">
            Télécharger le fichier de correspondance EPN/PPN
          </v-list-item-title>
          <v-list-item-title v-if="demande.typeSuppression === 'PPN'">
            Télécharger le fichier de correspondance PPN/EPN
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isValideAvailable" @click="downloadFile('fichier_valide', '.csv')">
          <v-list-item-title>Télécharger le fichier déposé</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isResultatAvailable" @click="downloadFile('fichier_resultat', '.csv')">
          <v-list-item-title>Télécharger le fichier résultat</v-list-item-title>
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

const etatsDemande = ref([]);

const idEtatCurrentDemande = computed(() => {
  if (etatsDemande.value.length > 0)
    return etatsDemande.value.find(etat => etat.libelle === props.demande.etatDemande)?.id ?? -1;
  else {
    return -1;
  }
})

const isDownloadable = computed(() => idEtatCurrentDemande.value >= 3)
const isEnrichiAvailable = computed(() => idEtatCurrentDemande.value >= 4)
const isValideAvailable = computed(() =>
  (props.demande.type === 'SUPP' && idEtatCurrentDemande.value >= 5) ||
  ['RECOUV', 'EXEMP'].includes(props.demande.type)
)
const isResultatAvailable = computed(() => idEtatCurrentDemande.value >= 7 && idEtatCurrentDemande.value !== 8)

onMounted(() => {
  itemService.getEtatsDemande()
    .then(response => {
      etatsDemande.value = response.data;
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
}
</script>
