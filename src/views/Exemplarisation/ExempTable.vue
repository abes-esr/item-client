<template>
  <v-container fluid>
    <v-chip v-if="!archiveFalseActiveTrue" style="margin-right: 10px"
            @click="switchArchiveActiveDisplay(!archiveFalseActiveTrue)">Créations d'exemplaires
    </v-chip>
    <v-chip v-if="archiveFalseActiveTrue" variant="plain" style="margin-right: 10px"
            @click="switchArchiveActiveDisplay(!archiveFalseActiveTrue)">Créations d'exemplaires
    </v-chip>
    <v-chip v-if="archiveFalseActiveTrue" @click="switchArchiveActiveDisplay(!archiveFalseActiveTrue)">Créations
      d'exemplaires archivées
    </v-chip>
    <v-chip v-if="!archiveFalseActiveTrue" variant="plain" @click="switchArchiveActiveDisplay(!archiveFalseActiveTrue)">
      Créations d'exemplaires archivées
    </v-chip>
    <v-chip variant="text">
      <v-tooltip activator="parent" location="bottom">
        <template v-slot:activator="{ props }">
          <label>
            <input type="checkbox" v-model="extendedAllILN" style="margin-right: 5px"
                   @change="loadItems('EXEMP', archiveFalseActiveTrue)">
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
                :loading="!isDataLoaded" show-expand :sort-by="[{ key: 'dateModification', order: 'desc' }]"
                item-key="id"
  >
    <template v-slot:body.prepend>
      <tr>
        <td></td>
        <td>
          <v-text-field v-model="numDemandeSearchField" hide-details @input="filterItems"
                        variant="underlined"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="dateCreationSearchField" hide-details @input="filterItems"
                        variant="underlined"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="dateModificationSearchField" hide-details @input="filterItems"
                        variant="underlined"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="ilnSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="rcrSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="typeExempSearchField" hide-details @input="filterItems"
                        variant="underlined"></v-text-field>
        </td>
        <td>
          <v-text-field v-model="indexRechercheSearchField" @input="filterItems" hide-details
                        variant="underlined"></v-text-field>
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
          <v-btn icon="mdi-chevron-up" @click="item.expanded = !item.expanded" variant="text">
            <v-icon>{{ item.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </td>
        <td @click="onRowClick(item)" class="text-center">{{ item.id }}</td>
        <td @click="onRowClick(item)" class="text-center-">{{ item.dateCreation }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.dateModification }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.iln }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.rcr }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.typeExemp }}</td>
        <td @click="onRowClick(item)" class="text-center">{{ item.indexRecherche }}</td>
        <td @click="onRowClick(item)" class="text-center">
          <v-chip color="grey" variant="flat"
                  v-if="item.etatDemande === 'En simulation' || item.etatDemande === 'En préparation' || item.etatDemande === 'A compléter'">
            En saisie
          </v-chip>
          <v-chip color="orange" variant="flat" v-else-if="item.etatDemande === 'En attente'">En attente</v-chip>
          <v-chip color="grey" variant="flat" v-else-if="item.etatDemande === 'En cours de traitement'">En cours de
            traitement
          </v-chip>
          <v-chip color="green" variant="flat" v-else-if="item.etatDemande === 'Terminé'">Terminé</v-chip>
          <v-chip color="brown" variant="flat" v-else-if="item.etatDemande === 'Archivé'">Archivé</v-chip>
          <v-chip color="red" variant="flat" v-else-if="item.etatDemande === 'En erreur'">En erreur</v-chip>
        </td>
        <td @click="onRowClick(item)" class="text-center">
          <v-progress-linear v-model="item.pourcentageProgressionTraitement" :height="18" :striped="false"
                             color="grey-lighten-1" style="border: 1px solid grey; font-weight: bolder">
            {{ item.pourcentageProgressionTraitement }} %
          </v-progress-linear>
        </td>
        <td class="text-center">
          <!-- Colonne Téléchargement -->
          <v-tooltip top>
            <template v-slot:activator="{ props }" v-if="item.fichier_enrichi">
              <span v-bind="props"><v-icon
                @click='downloadFile(item.id, "fichier_enrichi")'>mdi-file-upload</v-icon></span></template>
            <span>Fichier enrichi (fichier déposé)</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ props }" v-if="item.fichier_resultat">
              <span v-bind="props"><v-icon @click='downloadFile(item.id, "fichier_resultat")'>mdi-file-download</v-icon></span>
            </template>
            <span>Fichier résultat</span>
          </v-tooltip>
        </td>
        <td class="text-center">
          <!-- Colonne Action -->
          <v-btn v-if="canArchive(item)" variant="plain" icon="mdi-archive" @click="archiverDemande(item)"></v-btn>
          <v-btn v-else-if="canCancel(item)" variant="plain" icon="mdi-delete" @click="supprimerDemande(item)"></v-btn>

        </td>
      </tr>
      <tr v-if="item.expanded">
        <td :colspan="headingsDemandes.length">
          <v-textarea label="Commentaire" v-model="item.commentaire" hide-details variant="underlined" auto-grow
                      rows="1"></v-textarea>
        </td>
      </tr>
    </template>
  </v-data-table>
  <dialog-suppression v-model="suppDialog" :demande="suppDemande" @supp="loadItems('EXEMP', archiveFalseActiveTrue)"></dialog-suppression>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DemandesService from '@/service/DemandesService';
import router from '@/router';
import DialogSuppression from '@/components/DialogSuppression.vue';

const service = DemandesService;

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
    align: 'center'
  },
  {
    title: 'Mise à jour',
    key: 'dateModification',
    align: 'center'
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
const contentsDemandesFromServer = ref([]);
const contentsDemandesFrontFiltered = ref([]);
const totalItemsFound = ref(0);
const suppDialog = ref(false);
const suppDemande = ref({});

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

//Actives or archives demands displayed
const archiveFalseActiveTrue = ref(false);

//Data initialisation
onMounted(() => {
  loadItems('EXEMP', archiveFalseActiveTrue.value);
  contentsDemandesFromServer.value = [...contentsDemandesFromServer.value];
});

function switchArchiveActiveDisplay(value) {
  archiveFalseActiveTrue.value = value;
  loadItems('EXEMP', archiveFalseActiveTrue.value);
}

async function loadItems(type, archive) {
  try {
    const response = await service.fetchDemandes(type, archive, extendedAllILN.value);
    contentsDemandesFromServer.value = response.data;
    contentsDemandesFrontFiltered.value = response.data.map((item) => ({
      ...item,
      expanded: false,
      fichier_enrichi: false,
      fichier_resultat: false,
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
      .includes(statutSearchField.value) || ((statutSearchField.value === 'En saisie') && (demande.etatDemande === 'En simulation' || demande.etatDemande === 'En préparation' || demande.etatDemande === 'A compléter'));
    return matchesNumDemande && matchesDateCreation && matchesDateModification && matchesRCR && matchesILN && matchesTypeExemp && matchesIndexSearch && matchesEtatDemande;
  });
}

function downloadFile(demandeNumber, filePrefix) {
  return service.getFile(filePrefix, demandeNumber, 'csv', 'EXEMP')
    .catch((error) => {
      console.error(error);
      emit('backendError', error);
    });
}

function isAvailableFile(demandeNumber, filename) {
  return service.headFile(filename, demandeNumber, 'csv', 'EXEMP')
    .then((response) => response.status !== 500)
    .catch((error) => {
      console.error(error);
      emit('backendError', error);
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
    await service.archiverDemande('EXEMP', item.id);
    // Mettre à jour les données après l'archivage réussi
    await loadItems('EXEMP');
    emit('backendSuccess');
  } catch (error) {
    console.error(error);
    emit('backendError', error);
  }
}

async function onMouseOverRow(item) {
  //console.log('Souris sur la ligne :', item);
  item.highlighted = true;
  // Faites quelque chose avec l'élément 'item' lorsque la souris passe dessus
  //TODO mettre en place une fonction qui maj une valeur item.progress toutes les x secondes pour savoir si le serveur est en train de traiter la demande
  // Vérifier la disponibilité des fichiers pour chaque type de fichier
  item.fichier_enrichi = await isAvailableFile(item.id, 'fichier_enrichi');
  item.fichier_resultat = await isAvailableFile(item.id, 'fichier_resultat');
}

function onMouseLeaveRow(item) {
  item.highlighted = false;
  setTimeout(() => {
    item.fichier_enrichi = false;
    item.fichier_resultat = false;
  }, 1000);
}

function onRowClick(item) {
  console.log('Ligne cliquée avec la demande :', item.id);
  // Faites quelque chose lorsque la ligne est cliquée, par exemple naviguer vers une page de détails de la demande

  if (item.etatDemande === 'En préparation' || item.etatDemande === 'A compléter' || item.etatDemande === 'En simulation') {
    router.push('/exemplarisation/' + item.id);
  }
}

</script>

<style scoped>
.highlighted-row {
  background-color: #f5f5f5;
}
</style>
