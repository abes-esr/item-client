<template>
  <v-container fluid>
    <v-chip :variant="isArchiveDemandesDisplayed ? 'plain' : 'tonal'" style="margin-right: 10px"
            @click="switchArchiveActiveDisplay(!isArchiveDemandesDisplayed)">Demandes de recouvrement
    </v-chip>
    <v-chip :variant="!isArchiveDemandesDisplayed ? 'plain' : 'tonal'"
            @click="switchArchiveActiveDisplay(!isArchiveDemandesDisplayed)">Demandes de recouvrement archivées
    </v-chip>
    <v-chip variant="text">
      <v-tooltip v-if="isAdmin" activator="parent" location="bottom">
        <template v-slot:activator="{ props }">
          <label>
            <input type="checkbox" v-model="extendedAllILN" style="margin-right: 5px"
                   @change="loadItems('RECOUV')">
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
          <v-text-field v-model="dateCreationSearchField" hide-details @input="filterItems"
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="dateModificationSearchField" hide-details @input="filterItems"
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td v-if="isAdmin">
          <v-text-field v-model="ilnSearchField" hide-details @input="filterItems" variant="underlined"
                        append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="rcrSearchField" hide-details @input="filterItems" variant="underlined"
                        append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="indexRechercheSearchField" @input="filterItems" hide-details
                        variant="underlined" append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-select :items="listStatut" variant="underlined" hide-details @update:menu="filterItems"
                    @click:clear="filterItems" aria-label="Recherche par statut" clearable clear-icon="mdi-close"
                    no-data-text="Aucun statut trouvé." v-model="statutSearchField"></v-select>
        </td>
      </tr>
    </template>

    <!-- Colonne de progression-->
    <template v-slot:item.pourcentageProgressionTraitement="{ item }">
      <v-progress-linear v-model="item.pourcentageProgressionTraitement" :height="18" :striped="false"
                         :color="colorProgressBar(item)" style="border: 1px solid grey; font-weight: bolder">
        {{ item.pourcentageProgressionTraitement }} %
      </v-progress-linear>
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
        <td @click="onRowClick(item)" class="text-center">{{ item.dateCreation }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.dateModification }}</td>
        <td v-if="isAdmin" @click="onRowClick(item)" class="text-center">{{ item.iln }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.rcr }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.indexRecherche }}</td>
        <td @click="onRowClick(item)" class="text-center">
          <v-chip color="saisised" variant="flat" v-if="item.etatDemande === 'En préparation'">En saisie</v-chip>
          <v-chip color="waited" variant="flat" v-else-if="item.etatDemande === 'En attente'">En attente</v-chip>
          <v-chip color="saisised" variant="flat" v-else-if="item.etatDemande === 'En cours de traitement'">En cours de
            traitement
          </v-chip>
          <v-chip color="success" variant="flat" v-else-if="item.etatDemande === 'Terminé'">Terminé</v-chip>
          <v-chip color="archived" variant="flat" v-else-if="item.etatDemande === 'Archivé'">Archivé</v-chip>
          <v-chip color="error" variant="flat" v-else-if="item.etatDemande === 'En erreur'">En erreur</v-chip>
        </td>
        <td @click="onRowClick(item)" class="text-center">
          <v-progress-linear v-model="item.pourcentageProgressionTraitement" :height="18" :striped="false"
                             :color="colorProgressBar(item)" style="border: 1px solid grey; font-weight: bolder">
            {{ item.pourcentageProgressionTraitement }} %
          </v-progress-linear>
        </td>
        <td class="text-center">
          <menu-download-file :demande="item" @on-error="throwError"></menu-download-file>
        </td>
        <td class="text-center">
          <!-- Colonne Action -->
          <v-btn-group>
            <btn-archive v-bind="$attrs" :demande="item" @clicked="loadItems(item.type)"
                         @on-error="throwError" aria-label="Archiver"></btn-archive>
            <btn-suppression v-bind="$attrs" :demande="item" @clicked="loadItems(item.type)"
                             @on-error="throwError" aria-label="Supprimer"></btn-suppression>
            <btn-restore v-bind="$attrs" :demande="item" @clicked="loadItems(item.type)"
                         @on-error="throwError" aria-label="Restaurer"></btn-restore>
          </v-btn-group>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import itemService from '@/service/ItemService';
import router from '@/router';
import DialogCommentaire from '@/components/Dialog/DialogCommentaire.vue';
import MenuDownloadFile from '@/components/MenuDownloadFile.vue';
import moment from 'moment/moment';
import { useAuthStore } from '@/store/authStore';
import BtnSuppression from '@/components/ButtonsActions/BtnSuppression.vue';
import BtnRestore from '@/components/ButtonsActions/BtnRestore.vue';
import BtnArchive from '@/components/ButtonsActions/BtnArchive.vue';

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
    title: 'Créée le',
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
    title: 'Index',
    key: 'indexRecherche',
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
    sortable: false
  },
  {
    title: 'Fichiers',
    key: 'filesToDownload',
    value: 'filesToDownload',
    align: 'center',
    display: true,
    sortable: false
  },
  {
    title: 'Action',
    key: 'archiveOrCancel',
    value: 'archiveOrCancel',
    align: 'center',
    display: true,
    sortable: false
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
  'En erreur'
];
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
const dateCreationSearchField = ref('');
const dateModificationSearchField = ref('');
const ilnSearchField = ref('');
const rcrSearchField = ref('');
const typeExempSearchField = ref('');
const indexRechercheSearchField = ref('');
const statutSearchField = ref();
let polling;
const isDialogOpen = computed(() => {
  return !!contentsDemandesFrontFiltered.value.find(item => item.expanded === true);
});

//Actives or archives demands displayed
const isArchiveDemandesDisplayed = ref(false);

//Data initialisation
onMounted(() => {
  loadItems('RECOUV');
  contentsDemandesFromServer.value = [...contentsDemandesFromServer.value];
  polling = setInterval(() => {
    if (!isDialogOpen.value) {
      loadItems('RECOUV')
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
  loadItems('RECOUV');
}

async function loadItems(type) {
  try {
    const response = await itemService.fetchDemandes(type, isArchiveDemandesDisplayed.value, extendedAllILN.value);
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
    const matchesDateCreation = dateCreationSearchField.value === '' || demande.dateCreation.toString()
      .includes(dateCreationSearchField.value);
    const matchesDateModification = dateModificationSearchField.value === '' || demande.dateModification.toString()
      .includes(dateModificationSearchField.value);
    const matchesRCR = rcrSearchField.value === '' || demande.rcr.toString()
      .includes(rcrSearchField.value);
    const matchesILN = ilnSearchField.value === '' || demande.iln.toString()
      .includes(ilnSearchField.value);
    const matchesTypeExemp = typeExempSearchField.value === '' || demande.typeExemp && demande.typeExemp.includes(typeExempSearchField.value);
    const matchesIndexSearch = indexRechercheSearchField.value === '' || demande.indexRecherche && demande.indexRecherche.includes(indexRechercheSearchField.value);
    const matchesEtatDemande = statutSearchField.value === undefined || statutSearchField.value === null || statutSearchField.value === '' || demande.etatDemande.toString()
      .includes(statutSearchField.value) || ((statutSearchField.value === 'En saisie') && (demande.etatDemande === 'En préparation'));
    return matchesNumDemande && matchesDateCreation && matchesDateModification && matchesRCR && matchesILN && matchesTypeExemp && matchesIndexSearch && matchesEtatDemande;
  });
}

function onRowClick(item) {
  if (item.etatDemande === 'En préparation') {
    router.push('/recouvrement/' + item.id);
  }
}

function saveComment() {
  loadItems('RECOUV')
    .then(() => {
      filterItems();
    });
}

function throwError(error) {
  emit('backendError', error);
}

function colorProgressBar(item) {
  if (item.pourcentageProgressionTraitement === 100) {
    if (item.etatDemande === 'Terminé') {
      return 'success';
    } else if (item.etatDemande === 'En erreur') {
      return 'error';
    }
  }
  return 'grey-lighten-1';
}
</script>

<style scoped>
.highlighted-row {
  background-color: #f5f5f5;
}
</style>
