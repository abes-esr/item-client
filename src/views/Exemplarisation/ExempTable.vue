<template>

  <v-container fluid>
    <v-chip :variant="isActiveDemandesDisplayed ? 'plain' : 'tonal'" style="margin-right: 10px"
            @click="switchArchiveActiveDisplay(!isActiveDemandesDisplayed)">Créations d'exemplaires
    </v-chip>
    <v-chip :variant="!isActiveDemandesDisplayed ? 'plain' : 'tonal'" @click="switchArchiveActiveDisplay(!isActiveDemandesDisplayed)">Créations
      d'exemplaires archivées
    </v-chip>
    <v-chip variant="text">
      <v-tooltip activator="parent" location="bottom">
        <template v-slot:activator="{ props }">
          <label>
            <input type="checkbox" v-model="extendedAllILN" style="margin-right: 5px"
                   @change="loadItems('EXEMP', isActiveDemandesDisplayed)">
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
  <v-data-table :headers="headingsDemandes" :items="contentsDemandesFrontFiltered" :items-length="totalItemsFound"
                :loading="!isDataLoaded" show-expand :sort-by="sortBy"
                item-key="id"
  >
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
        <td>
          <v-text-field v-model="ilnSearchField" hide-details @input="filterItems" variant="underlined"
                        append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="rcrSearchField" hide-details @input="filterItems" variant="underlined"
                        append-inner-icon="mdi-magnify"></v-text-field>
        </td>
        <td>
          <v-select
            v-model="typeExempSearchField" hide-details variant="underlined" :items="listTypeExemp"
            @update:menu="filterItems"
            @click:clear="filterItems" clearable clear-icon="mdi-close" no-data-text="Aucun type d'exemplaire trouvé."
            aria-label="Recherche par type d'exemplaire"
          ></v-select>
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
        <td @click="onRowClick(item)" class="text-center">{{ item.iln }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.rcr }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.typeExemp ? item.typeExemp : 'Non défini' }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.indexRecherche }}</td>
        <td @click="onRowClick(item)" class="text-center">
          <v-chip color="saisised" variant="flat"
                  v-if="item.etatDemande === 'En simulation' || item.etatDemande === 'En préparation' || item.etatDemande === 'A compléter'">
            En saisie
          </v-chip>
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
                             color="grey-lighten-1" style="border: 1px solid grey; font-weight: bolder">
            {{ item.pourcentageProgressionTraitement }} %
          </v-progress-linear>
        </td>
        <td class="text-center">
          <!-- Colonne Téléchargement -->
          <menu-download-file :demande="item" @on-error="throwError"></menu-download-file>
        </td>
        <td class="text-center">
          <!-- Colonne Action -->
          <v-btn v-if="canArchive(item)" variant="plain" icon="mdi-archive" @click="archiverDemande(item)"></v-btn>
          <v-btn v-else-if="canCancel(item)" variant="plain" icon="mdi-delete" @click="supprimerDemande(item)"></v-btn>

        </td>
      </tr>
    </template>
  </v-data-table>
  <dialog-suppression v-model="suppDialog" :demande="suppDemande"
                      @supp="loadItems('EXEMP', isActiveDemandesDisplayed)"></dialog-suppression>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import router from '@/router';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';
import DialogCommentaire from "@/components/Dialog/DialogCommentaire.vue";
import itemService from '@/service/ItemService';
import MenuDownloadFile from "@/components/MenuDownloadFile.vue";
import moment from "moment";
//Emit
const emit = defineEmits(['backendError', 'backendSuccess']);

//Data
const extendedAllILN = ref(false);
const headingsDemandes = [
  {
    title: '',
    key: 'data-table-expand',
    align: 'center'
  },
  {
    title: 'Demande',
    key: 'id',
    align: 'center'
  },
  {
    title: 'Crée le',
    key: 'dateCreation',
    align: 'center',
    sort:(d1,d2) => {
      const date1 = moment(d1, "DD/MM/yyyy HH:mm").valueOf();
      const date2 = moment(d2, "DD/MM/yyyy HH:mm").valueOf();
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    }
  },
  {
    title: 'Mise à jour',
    key: 'dateModification',
    align: 'center',
    sort:(d1,d2) => {
      const date1 = moment(d1, "DD/MM/yyyy HH:mm").valueOf();
      const date2 = moment(d2, "DD/MM/yyyy HH:mm").valueOf();
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    }
  },
  {
    title: 'ILN',
    key: 'iln',
    align: 'center'
  },
  {
    title: 'RCR',
    key: 'rcr',
    align: 'center'
  },
  {
    title: 'Type',
    key: 'typeExemp',
    align: 'center'
  },
  {
    title: 'Index',
    key: 'indexRecherche',
    align: 'center'
  },
  {
    title: 'Statut',
    key: 'etatDemande',
    align: 'center'
  },
  {
    title: 'Progression',
    key: 'pourcentageProgressionTraitement',
    value: 'pourcentageProgressionTraitement',
    align: 'center'
  },
  {
    title: 'Fichiers',
    key: 'filesToDownload',
    value: 'filesToDownload',
    align: 'center'
  },
  {
    title: 'Action',
    key: 'archiveOrCancel',
    value: 'archiveOrCancel',
    align: 'center'
  }
];
const listStatut = [
  'En saisie',
  'En attente',
  'En cours de traitement',
  'Terminé',
  'En erreur'
];
const listTypeExemp = ref([]);
const contentsDemandesFromServer = ref([]);
const contentsDemandesFrontFiltered = ref([]);
const totalItemsFound = ref(0);
const suppDialog = ref(false);
const suppDemande = ref({});
const sortBy = ref([{ key: 'dateModification', order: 'desc' }]);

//Progress bar displayed while fetching data
const isDataLoaded = ref(false);

//Search fields columns
const numDemandeSearchField = ref('');
const dateCreationSearchField = ref('');
const dateModificationSearchField = ref('');
const ilnSearchField = ref('');
const rcrSearchField = ref('');
const typeExempSearchField = ref();
const indexRechercheSearchField = ref('');
const statutSearchField = ref();
let polling;
const isDialogOpen = computed(() => {
  return !!contentsDemandesFrontFiltered.value.find(item => item.expanded === true)
});
//Actives or archives demands displayed
const isActiveDemandesDisplayed = ref(false);

//Data initialisation
onMounted(() => {
  loadItems('EXEMP', isActiveDemandesDisplayed.value);
  contentsDemandesFromServer.value = [...contentsDemandesFromServer.value];
  itemService.getTypeExemp()
    .then(response => {
      response.data.forEach(type => {
        listTypeExemp.value.push(type.libelle);
      });
      listTypeExemp.value.sort();
      listTypeExemp.value.push('Non défini');
    });
  polling = setInterval(() => {
    if(!isDialogOpen.value) {
      loadItems('EXEMP', isActiveDemandesDisplayed.value)
        .then(() => {
          filterItems();
        });
    }
  }, 10000);
});

onBeforeUnmount(() => {
  clearInterval(polling);
})
function switchArchiveActiveDisplay(value) {
  isActiveDemandesDisplayed.value = value;
  loadItems('EXEMP', isActiveDemandesDisplayed.value);
}

async function loadItems(type, archive) {
  try {
    const response = await itemService.fetchDemandes(type, archive, extendedAllILN.value);
    contentsDemandesFromServer.value = response.data;
    contentsDemandesFrontFiltered.value = response.data.map((item) => ({
      ...item,
      expanded: false
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
    const matchesTypeExemp = typeExempSearchField.value === undefined || typeExempSearchField.value === null || typeExempSearchField.value === '' || (demande.typeExemp && demande.typeExemp.includes(typeExempSearchField.value)) || (!demande.typeExemp && typeExempSearchField.value === 'Non défini');
    const matchesIndexSearch = indexRechercheSearchField.value === '' || demande.indexRecherche && demande.indexRecherche.includes(indexRechercheSearchField.value);
    const matchesEtatDemande = statutSearchField.value === undefined || statutSearchField.value === null || statutSearchField.value === '' || demande.etatDemande.toString()
      .includes(statutSearchField.value) || ((statutSearchField.value === 'En saisie') && (demande.etatDemande === 'En simulation' || demande.etatDemande === 'En préparation' || demande.etatDemande === 'A compléter'));
    return matchesNumDemande && matchesDateCreation && matchesDateModification && matchesRCR && matchesILN && matchesTypeExemp && matchesIndexSearch && matchesEtatDemande;
  });
}

//Action d'archivage ou suppression selon état de la demande dans le TDB
function canArchive(item) {
  return item.etatDemande === 'Terminé';
}

function canCancel(item) {
  return item.etatDemande !== 'Terminé' && item.etatDemande !== 'En cours de traitement' && item.etatDemande !== 'En attente';
}

//Suppression d'une demande
function supprimerDemande(item) {
  suppDialog.value = true;
  suppDemande.value = item;
}

//Archivage d'une demande
async function archiverDemande(item) {
  try {
    await itemService.archiverDemande('EXEMP', item.id);
    // Mettre à jour les données après l'archivage réussi
    await loadItems('EXEMP');
    emit('backendSuccess');
  } catch (error) {
    console.error(error);
    emit('backendError', error);
  }
}

function onRowClick(item) {
  if (item.etatDemande === 'En préparation' || item.etatDemande === 'A compléter' || item.etatDemande === 'En simulation') {
    router.push('/exemplarisation/' + item.id);
  }
}

function saveComment(){
  loadItems('EXEMP',isActiveDemandesDisplayed.value).then(()=>{
    filterItems();
  })
}

function throwError(error) {
  emit('backendError',error);
}
</script>

<style scoped>
.highlighted-row {
  background-color: #f5f5f5;
}
</style>
