<template>
  <v-data-table-server
                v-model:item-per-page="itemsPerPage"
                :headers="headingsDemandes"
                :items="contentsDemandesFromServer"
                :items-length="totalItemsFound"
                :loading="loading"
                item-value="name"
                @update:options="loadItems"><!--@update pour les tris asc/desc-->
    <template v-slot:body.prepend>
      <tr>
        <td><v-text-field v-model="numDemandeSearchField" hide-details @input="handleNM" variant="underlined" ></v-text-field></td>
        <td><v-text-field v-model="dateCreationSearchField" hide-details @input="handleDC" variant="underlined" ></v-text-field></td>
        <td><v-text-field v-model="dateModificationSearchField" hide-details @input="handleDM" variant="underlined" ></v-text-field></td>
        <td><v-text-field v-model="ilnSearchField" hide-details @input="handleILN" variant="underlined" ></v-text-field></td>
        <td><v-text-field v-model="rcrSearchField" hide-details @input="handleRCR" variant="underlined" ></v-text-field></td>
        <td><v-text-field v-model="indexRechercheSearchField" @input="handleIR" hide-details  variant="underlined" ></v-text-field></td>
        <td><v-text-field v-model="statutSearchField" @input="handleST" hide-details variant="underlined" ></v-text-field></td>
      </tr>
    </template>
  </v-data-table-server>
  <v-btn @click="display"></v-btn>
</template>

<script setup>
import { ref, computed } from 'vue'
  const columnHeaderSortingArrowClicked = ref('dateModification')
  const columnHeaderSortingArrowDirectionDescending = ref(true)
  const headingsDemandes = ref([
    { title: 'Demande', key: 'id', align: 'end' },
    { title: 'Date de création', key: 'dateCreation', align: 'end' },
    { title: 'Date de dernière modification', key: 'dateModification', align: 'end' },
    { title: 'ILN', key: 'iln', align: 'end' },
    { title: 'RCR', key: 'rcr', align: 'end' },
    { title: 'Index', key: 'indexRecherche', align: 'end' },
    { title: 'Statut', key: 'etatDemande', align: 'end' },
    { title: 'Téléchargement', key: '', align: 'end' },
    { title: 'Action', key: '', align: 'end' }
  ])
  const contentsDemandesFromServer = ref([
    //TODO enrichir en statique avec les demandes initiales
    {
      "type": "EXEMP",
      "id": 7,
      "rcr": "341725201",
      "iln": 1,
      "etatDemande": "A compléter",
      "commentaire": "",
      "pourcentageProgressionTraitement": 0,
      "dateCreation": "22/04/2024 07:46",
      "dateModification": "22/04/2024 09:58",
      "typeExemp": "Monographies électroniques",
      "indexRecherche": null
    }
  ])
  const itemsPerPage = ref(5)
  const totalItemsFound = ref(0)
  const loading = ref(true)
  const searched = ref('')

  const numDemandeSearchField = ref('')
  const dateCreationSearchField = ref('')
  const dateModificationSearchField = ref('')
  const ilnSearchField = ref('')
  const rcrSearchField = ref('')
  const indexRechercheSearchField = ref('')
  const statutSearchField = ref('')

  const handleNM = (event) => {
    numDemandeSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }
  const handleDC = (event) => {
    dateCreationSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }
  const handleDM = (event) => {
    dateModificationSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }
  const handleILN = (event) => {
    ilnSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }
  const handleRCR = (event) => {
    rcrSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }
  const handleIR = (event) => {
    indexRechercheSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }
  const handleST = (event) => {
    indexRechercheSearchField.value = event.target.value
    loadItems({page: 1, itemsPerPage: itemsPerPage, sortBy: 'asc'})
  }

  const loadItems = ({ page, itemsPerPage, sortBy }) => {
    loading.value = true
    FakeAPI.fetch({
      page,
      itemsPerPage,
      sortBy,
      search: {
        paramNM: numDemandeSearchField.value,
        paramDC: dateCreationSearchField.value,
        paramDM: dateModificationSearchField.value,
        paramILN: ilnSearchField.value,
        paramRCR: rcrSearchField.value,
        paramIR: indexRechercheSearchField.value,
        paramST: statutSearchField.value
      }
    }).then(({ items, total }) => {
      contentsDemandesFromServer.value = items
      totalItemsFound.value = total
      loading.value = false
    })
  }

  //TODO
  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy, search }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = contentsDemandesFromServer.value.slice().filter(item => {})

          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items.sort((a, b) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }

          const paginated = items.slice(start, end)

          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }
</script>
