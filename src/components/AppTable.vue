<template>
  <v-container fluid>
  <v-chip style="margin-right: 10px">Créations d'exemplaires</v-chip>
  <v-chip variant="plain" @click="">Créations d'exemplaires archivées</v-chip>
    <v-chip variant="text">
      <v-tooltip activator="parent" location="bottom">
        <template v-slot:activator="{ props }">
          <label>
            <input type="checkbox" v-model="extendedAllILN" style="margin-right: 5px" @change="loadItems('EXEMP')">
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
	<v-data-table :headers="headingsDemandes" :items="contentsDemandesFrontFiltered" :items-length="totalItemsFound" :loading="!isDataLoaded" show-expand :sort-by="[{ key: 'dateModification', order: 'desc' }]">
		<template v-slot:body.prepend>
			<tr>
        <td></td>
				<td><v-text-field v-model="numDemandeSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field></td>
				<td><v-text-field v-model="dateCreationSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field></td>
				<td><v-text-field v-model="dateModificationSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field></td>
				<td><v-text-field v-model="ilnSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field></td>
				<td><v-text-field v-model="rcrSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field></td>
        <td><v-text-field v-model="typeExempSearchField" hide-details @input="filterItems" variant="underlined"></v-text-field></td>
				<td><v-text-field v-model="indexRechercheSearchField" @input="filterItems" hide-details variant="underlined"></v-text-field></td>
				<td><v-text-field v-model="statutSearchField" @input="filterItems" hide-details variant="underlined"></v-text-field></td>
			</tr>
		</template>

    <!-- Pavé de commentaires -->
    <template v-slot:expanded-row="{ columns, item }">
      <tr><td :colspan="columns.length"><v-textarea label="Commentaire" v-model="item.commentaire" hide-details variant="underlined" auto-grow rows="1"></v-textarea></td></tr>
    </template>

    <!-- Colonne Téléchargement -->
    <template v-slot:item.filesToDownload="{ item }">
      <v-tooltip top><template v-slot:activator="{ props }" v-if="fileUploadedAvailability[item.id]">
      <span v-bind="props"><v-icon @click='downloadFile(item.id)'>mdi-file-upload</v-icon></span></template><span>Fichier enrichi (fichier déposé)</span>
      </v-tooltip>

      <v-tooltip top><template v-slot:activator="{ props }" v-if="false">
      <span v-bind="props"><v-icon>mdi-file-download</v-icon></span></template><span>Fichier résultat</span>
      </v-tooltip>
    </template>

    <!-- Colonne Action -->
    <template v-slot:item.archiveOrCancel="{ item }">
      <v-icon>mdi-dots-vertical</v-icon>
    </template>

    <!-- Colonne de progression-->
    <template v-slot:item.pourcentageProgressionTraitement="{ item }">
      <v-progress-linear v-model="item.pourcentageProgressionTraitement" :height="18" :striped="false" color="grey-lighten-1" style="border: 1px solid grey; font-weight: bolder">{{ item.pourcentageProgressionTraitement }} %</v-progress-linear>
    </template>
	</v-data-table>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import DemandesService from '@/service/DemandesService'
const service = DemandesService

//Emit
const emit = defineEmits(['backendError', 'backendSuccess'])

//Data
const extendedAllILN = ref(true)
const headingsDemandes = ref([
  {title: '', key: 'data-table-expand', align: 'end'},
	{title: 'Demande', key: 'id', align: 'end'},
	{title: 'Crée le', key: 'dateCreation', align: 'end'},
	{title: 'Mise à jour', key: 'dateModification', align: 'end'},
	{title: 'ILN', key: 'iln', align: 'end'},
	{title: 'RCR', key: 'rcr', align: 'end'},
  {title: 'Type', key: 'typeExemp', align: 'end'},
	{title: 'Index', key: 'indexRecherche', align: 'end'},
	{title: 'Statut', key: 'etatDemande', align: 'end'},
  {title: 'Progression', key: 'pourcentageProgressionTraitement', value: 'pourcentageProgressionTraitement', align: 'end'},
	{title: 'Fichiers', key: 'filesToDownload', value: 'filesToDownload', align: 'end'},
	{title: 'Action', key: 'archiveOrCancel', value: 'archiveOrCancel', align: 'end'}
])
const contentsDemandesFromServer = ref([])
const contentsDemandesFrontFiltered = ref([])
const totalItemsFound = ref(0)

//Progress bar displayed while fetching data
const isDataLoaded = ref(false)

//Search fields columns
const numDemandeSearchField = ref('')
const dateCreationSearchField = ref('')
const dateModificationSearchField = ref('')
const ilnSearchField = ref('')
const rcrSearchField = ref('')
const typeExempSearchField = ref('')
const indexRechercheSearchField = ref('')
const statutSearchField = ref('')

//Files per demand to download
const fileUploadedAvailability = ref({})
const fileDownloadAvailability = ref({})


//Data initialisation
onMounted(() => {
  loadItems('EXEMP')
  contentsDemandesFromServer.value = [...contentsDemandesFromServer.value]
})

async function loadItems(type) {
  try {
    const response = await service.axiosFetchDemandes(type, extendedAllILN.value);
    contentsDemandesFromServer.value = response.data;
    contentsDemandesFrontFiltered.value = [...response.data];

    fileUploadedAvailability.value = await updateFileAvailability(response.data);

    isDataLoaded.value = true;
    emit('backendSuccess');
  } catch (error) {
    console.error(error);
    emit('backendError', error);
  }
}

function filterItems() {
  contentsDemandesFrontFiltered.value = contentsDemandesFromServer.value.filter(demande => {
    const matchesNumDemande = numDemandeSearchField.value === '' || demande.id.toString().includes(numDemandeSearchField.value)
    const matchesDateCreation = dateCreationSearchField.value === '' || demande.dateCreation.toString().includes(dateCreationSearchField.value)
    const matchesDateModification = dateModificationSearchField.value === '' || demande.dateModification.toString().includes(dateModificationSearchField.value)
    const matchesRCR = rcrSearchField.value === '' || demande.rcr.toString().includes(rcrSearchField.value)
    const matchesILN = ilnSearchField.value === '' || demande.iln.toString().includes(ilnSearchField.value)
    const matchesTypeExemp = typeExempSearchField.value === '' || demande.typeExemp && demande.typeExemp.includes(typeExempSearchField.value)
    const matchesIndexSearch = indexRechercheSearchField.value === '' || demande.indexRecherche && demande.indexRecherche.includes(indexRechercheSearchField.value)
    const matchesEtatDemande = statutSearchField.value === '' || demande.etatDemande.toString().includes(statutSearchField.value)
    return matchesNumDemande && matchesDateCreation && matchesDateModification && matchesRCR && matchesILN && matchesTypeExemp && matchesIndexSearch && matchesEtatDemande
  })
}

function downloadFile(demandeNumber){
  return service.axiosGetFile('fichier_enrichi', demandeNumber, 'csv')
    .catch((error) => {
      console.error(error)
    })
}

//Fonctions to checking every availability files on each demand
async function updateFileAvailability(responseData) {
  // Créer un tableau de promesses pour chaque élément
  const availabilityPromises = responseData.map(item => isAvailableFile(item.id));
  // Attendre que toutes les promesses soient résolues
  const availabilityResults = await Promise.all(availabilityPromises);
  // Créer un objet de disponibilité à partir des résultats
  const availability = {};
  responseData.forEach((item, index) => {
    availability[item.id] = availabilityResults[index];
  });

  return availability;
}
function isAvailableFile(demandeNumber) {
  return service.axiosHeadFile('fichier_enrichi', demandeNumber, 'csv')
    .then((response) => response.status !== 500)
    .catch((error) => {
      console.error(error);
      return false;
    });
}

</script>
