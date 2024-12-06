<template>
  <v-container fluid>
    <v-chip :variant="isArchiveDemandesDisplayed ? 'plain' : 'tonal'" style="margin-right: 10px"
            @click="switchArchiveActiveDisplay(!isArchiveDemandesDisplayed)">
      Demandes de suppression
    </v-chip>
    <v-chip :variant="!isArchiveDemandesDisplayed ? 'plain' : 'tonal'"
            @click="switchArchiveActiveDisplay(!isArchiveDemandesDisplayed)">
      Demandes de suppression archivées
    </v-chip>
    <v-chip variant="text">
      <v-tooltip v-if="isAdmin" activator="parent" location="bottom">
        <template v-slot:activator="{ props }">
          <label>
            <input type="checkbox" v-model="extendedAllILN" style="margin-right: 5px"
                   @change="loadItems('SUPP', isArchiveDemandesDisplayed)">
            <span v-bind="props">Affichage étendu sur tous les ILN</span>
          </label>
        </template>
        <span>
          Permet en tant qu'administrateur de voir les demandes
          <br>
          En saisie | En attente | En cours de traitement | Terminé | En erreur
          <br>
          Sur tous les ILN
        </span>
      </v-tooltip>
    </v-chip>
  </v-container>
  <v-data-table :headers="filteredHeadingsDemandes" :items="contentsDemandesFrontFiltered"
                :items-length="totalItemsFound"
                :loading="!isDataLoaded" show-expand :sort-by="sortBy"
                item-key="id">
    <template v-slot:body.prepend>
      <tr>
        <td></td>
        <td>
          <v-text-field v-model="numDemandeSearchField" hide-details @input="filterItems"
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="nbExemplairesSearchField" hide-details @input="filterItems"
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="dateCreationSearchField" hide-details @input="filterItems"
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="dateModificationSearchField" hide-details @input="filterItems"
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="ilnSearchField" hide-details @input="filterItems" variant="underlined"
                        append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="rcrSearchField" hide-details @input="filterItems" variant="underlined"
                        append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-select :items="listStatut" variant="underlined" hide-details @update:menu="filterItems"
                    @click:clear="filterItems" aria-label="Recherche par statut" clearable clear-icon="mdi-close"
                    no-data-text="Aucun statut trouvé." v-model="statutSearchField"></v-select>
        </td>
      </tr>
    </template>

    <template v-slot:item="{ item, expand }">
      <tr :class="{ 'highlighted-row': item.highlighted }" style="cursor: pointer;">
        <td>
          <v-btn flat @click="item.expanded = !item.expanded" variant="text">
            <v-icon size="x-large" :color="item.commentaire ? 'red' : ''">mdi-comment-text-outline</v-icon>
            <dialog-commentaire :demande="item" @save="saveComment()"></dialog-commentaire>
          </v-btn>
        </td>
        <td @click="onRowClick(item)" class="text-center">{{ item.id }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.nbExemplaires }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.dateCreation }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.dateModification }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.iln }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.rcr }}</td>
        <td @click="onRowClick(item)" class="text-center">
          <v-chip color="saisised" variant="flat"
                  v-if="item.etatDemande === 'En simulation' || item.etatDemande === 'En préparation' || item.etatDemande === 'Préparée' || item.etatDemande === 'A compléter'">
            En saisie
          </v-chip>
          <v-chip color="waited" variant="flat" v-else-if="item.etatDemande === 'En attente'">En attente</v-chip>
          <v-chip color="saisised" variant="flat" v-else-if="item.etatDemande === 'En cours de traitement'">En cours de
            traitement
          </v-chip>
          <v-chip color="success" variant="flat" v-else-if="item.etatDemande === 'Terminé'">Terminé</v-chip>
          <v-chip color="archived" variant="flat" v-else-if="item.etatDemande === 'Archivé'">Archivé</v-chip>
          <v-chip color="error" variant="flat" v-else-if="item.etatDemande === 'En erreur'">En erreur</v-chip>
          <v-chip color="stopped" variant="flat" v-else-if="item.etatDemande === 'Annulé'">Annulé</v-chip>
          <v-chip color="info" variant="flat" v-else>{{ item.etatDemande }}</v-chip>
          <!-- Cas : ne correspont à aucun cas -->
        </td>
        <td @click="onRowClick(item)" class="text-center">
          <v-progress-linear v-model="item.pourcentageProgressionTraitement" height="18"
                             :color="colorProgressBar(item)"
                             style="border: 1px solid grey; font-weight: bolder">
            {{ item.pourcentageProgressionTraitement }} %
          </v-progress-linear>
        </td>
        <td class="text-center">
          <menu-download-file :demande="item" @on-error="throwError"></menu-download-file>
        </td>
        <td class="text-center">
          <!-- Colonne Action -->
          <btn-stop v-if="canStop(item)" :id="item.id" @stop="loadItems('SUPP', isArchiveDemandesDisplayed)"
                    @on-error="throwError"></btn-stop>
          <v-btn v-if="canArchive(item)" variant="plain" icon="mdi-archive" @click="archiverDemande(item)"></v-btn>
          <v-btn v-else-if="canCancel(item)" variant="plain" icon="mdi-delete" @click="supprimerDemande(item)"></v-btn>
          <v-btn v-if="item.etatDemande === 'Archivé'" variant="plain"  icon="mdi-package-up" @click="restaurerDemande(item)"></v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
  <dialog-suppression v-model="suppDialog" :demande="suppDemande"
                      @supp="loadItems('SUPP', isArchiveDemandesDisplayed)"></dialog-suppression>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import router from '@/router';
import demandesService from '@/service/ItemService';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';
import DialogCommentaire from '@/components/Dialog/DialogCommentaire.vue';
import MenuDownloadFile from '@/components/MenuDownloadFile.vue';
import moment from 'moment/moment';
import { useAuthStore } from '@/store/authStore';
import BtnStop from '@/components/Supp/BtnStop.vue';
import itemService from "@/service/ItemService";

//Emit
const emit = defineEmits(['backendError', 'backendSuccess']);

//Data
const isAdmin = useAuthStore()
  .isAdmin();
const extendedAllILN = ref(false);
const headingsDemandes = [
  {
    title: '',
    key: 'data-table-expand',
    align: 'center',
    display: true,
  },
  {
    title: 'N° de Demande',
    key: 'id',
    align: 'center',
    display: true,
  },
  {
    title: 'Nb d\'exemplaires',
    key: 'nbExemplaires',
    align: 'center',
    display: true,
  },
  {
    title: 'Crée le',
    key: 'dateCreation',
    align: 'center',
    display: true,
    sort: (d1, d2) => {
      const date1 = moment(d1, 'DD/MM/yyyy HH:mm')
        .valueOf();
      const date2 = moment(d2, 'DD/MM/yyyy HH:mm')
        .valueOf();
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    }
  },
  {
    title: 'Mise à jour',
    key: 'dateModification',
    align: 'center',
    display: true,
    sort: (d1, d2) => {
      const date1 = moment(d1, 'DD/MM/yyyy HH:mm')
        .valueOf();
      const date2 = moment(d2, 'DD/MM/yyyy HH:mm')
        .valueOf();
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    }
  },
  {
    title: 'ILN',
    key: 'iln',
    align: 'center',
    display: isAdmin,
  },
  {
    title: 'RCR',
    key: 'rcr',
    align: 'center',
    display: true,
  },
  {
    title: 'Statut',
    key: 'etatDemande',
    align: 'center',
    display: true,
  },
  {
    title: 'Progression',
    key: 'pourcentageProgressionTraitement',
    value: 'pourcentageProgressionTraitement',
    align: 'center',
    display: true,
  },
  {
    title: 'Fichiers',
    key: 'filesToDownload',
    value: 'filesToDownload',
    align: 'center',
    display: true,
  },
  {
    title: 'Action',
    key: 'archiveOrCancel',
    value: 'archiveOrCancel',
    align: 'center',
    display: true,
  }
];
const filteredHeadingsDemandes = computed(() =>
  headingsDemandes.filter(heading => heading.display !== false)
);

const listStatut = [
  'En saisie',
  'En attente',
  'En cours de traitement',
  'Terminé',
  'En erreur',
  'Annulé'
];
const listTypeTraitement = ref([]);
const contentsDemandesFromServer = ref([]);
const contentsDemandesFrontFiltered = ref([]);
const totalItemsFound = ref(0);
const suppDialog = ref(false);
const suppDemande = ref({});
const sortBy = ref([{
  key: 'dateModification',
  order: 'desc'
}]);

//Progress bar displayed while fetching data
const isDataLoaded = ref(false);

//Search fields columns
const numDemandeSearchField = ref('');
const nbExemplairesSearchField = ref('');
const dateCreationSearchField = ref('');
const dateModificationSearchField = ref('');
const ilnSearchField = ref('');
const rcrSearchField = ref('');
const zoneSearchField = ref('');
const traitementSearchField = ref();
const statutSearchField = ref();
let polling;
const isDialogOpen = computed(() => {
  return !!contentsDemandesFrontFiltered.value.find(item => item.expanded === true);
});

//Actives or archives demands displayed
const isArchiveDemandesDisplayed = ref(false);

//Data initialisation
onMounted(() => {
  loadItems('SUPP');
  contentsDemandesFromServer.value = [...contentsDemandesFromServer.value];
  demandesService.getTypeTraitement()
    .then(response => {
      response.data.forEach(type => {
        listTypeTraitement.value.push(type.libelle);
      });
      listTypeTraitement.value.sort();
      listTypeTraitement.value.push('Non défini');
    });
  polling = setInterval(() => {
    if (!isDialogOpen.value) {
      loadItems('SUPP')
        .then(() => {
          filterItems();
        });
    }
  }, 10000);
});

onBeforeUnmount(() => {
  clearInterval(polling);
});

function switchArchiveActiveDisplay(value) {
  isArchiveDemandesDisplayed.value = value;
  loadItems('SUPP');
}

async function loadItems(type) {
  try {
    const response = await demandesService.fetchDemandes(type, isArchiveDemandesDisplayed.value, extendedAllILN.value);
    contentsDemandesFromServer.value = response.data;
    contentsDemandesFrontFiltered.value = response.data.map((item) => ({
      ...item,
      expanded: false,
    }));

    isDataLoaded.value = true;
    emit('backendSuccess');
  } catch (error) {
    console.error(error);
    emit('backendError', error);
  }
}

function filterItems() {
  contentsDemandesFrontFiltered.value = contentsDemandesFromServer.value.filter(demande => {
    const matchesNumDemande = numDemandeSearchField.value === '' || demande.id.toString()
      .includes(numDemandeSearchField.value);
    const matchesNbExemplaires = nbExemplairesSearchField.value === '' || demande.nbExemplaires.toString()
      .includes(nbExemplairesSearchField.value);
    const matchesDateCreation = dateCreationSearchField.value === '' || demande.dateCreation.toString()
      .includes(dateCreationSearchField.value);
    const matchesDateModification = dateModificationSearchField.value === '' || demande.dateModification.toString()
      .includes(dateModificationSearchField.value);
    const matchesRCR = rcrSearchField.value === '' || demande.rcr.toString()
      .includes(rcrSearchField.value);
    const matchesILN = ilnSearchField.value === '' || demande.iln.toString()
      .includes(ilnSearchField.value);
    const matchesZone = zoneSearchField.value === '' || demande.zone && demande.zone.includes(zoneSearchField.value);
    const matchesTraitement = traitementSearchField.value === undefined || traitementSearchField.value === null || traitementSearchField.value === '' || (demande.traitement && demande.traitement.includes(traitementSearchField.value)) || (!demande.traitement && traitementSearchField.value === 'Non défini');
    const matchesEtatDemande = statutSearchField.value === undefined || statutSearchField.value === null || statutSearchField.value === '' || demande.etatDemande.toString()
      .includes(statutSearchField.value) || ((statutSearchField.value === 'En saisie') && (demande.etatDemande === 'En simulation' || demande.etatDemande === 'En préparation' || demande.etatDemande === 'Préparée' || demande.etatDemande === 'A compléter'));
    return matchesNumDemande && matchesNbExemplaires && matchesDateCreation && matchesDateModification && matchesRCR && matchesILN && matchesZone && matchesTraitement && matchesEtatDemande;
  });
}

function isAvailableFile(demandeNumber, filename) {
  return demandesService.headFile(filename, demandeNumber, 'csv', 'SUPP')
    .then((response) => response.status !== 500)
    .catch((error) => {
      console.error(error);
      return false;
    });
}

//Action d'archivage ou suppression selon état de la demande dans le TDB
function canArchive(item) {
  return item.etatDemande === 'Terminé' || item.etatDemande === 'Annulé';
}

function canCancel(item) {
  return item.etatDemande !== 'Terminé' && item.etatDemande !== 'En cours de traitement' && item.etatDemande !== 'En attente' && item.etatDemande !== 'Annulé';
}

function canStop(item) {
  return item.etatDemande === 'En cours de traitement' || item.etatDemande === 'En attente';
}

//Suppression d'une demande
function supprimerDemande(item) {
  suppDialog.value = true;
  suppDemande.value = item;
}

function restaurerDemande(item) {
  itemService.restaurerDemande(item.id, "SUPP").then(() => {
    loadItems('SUPP');
  }).catch(error => {
    console.error(error);
    emit('backendError', error);
  });
}

//Archivage d'une demande
async function archiverDemande(item) {
  try {
    await demandesService.archiverDemande('SUPP', item.id);
    // Mettre à jour les données après l'archivage réussi
    await loadItems('SUPP');
    emit('backendSuccess');
  } catch (error) {
    console.error(error);
    emit('backendError', error);
  }
}

function onRowClick(item) {
  if (item.etatDemande === 'En préparation' || item.etatDemande === 'Préparée' || item.etatDemande === 'A compléter' || item.etatDemande === 'En simulation') {
    router.push('/suppression/' + item.id);
  }
}

function saveComment() {
  loadItems('SUPP')
    .then(() => {
      filterItems();
    });
}

function throwError(error) {
  emit('backendError', error);
}

function colorProgressBar(item) {
  if (item.etatDemande === 'Terminé') {
    return 'success';
  } else if (item.etatDemande === 'En erreur') {
    return 'error';
  } else if (item.etatDemande === 'Annulé') {
    return 'stopped';
  }
  return 'grey-lighten-1';
}

</script>

<style scoped>

.highlighted-row {
  background-color: #f5f5f5;
}
</style>
