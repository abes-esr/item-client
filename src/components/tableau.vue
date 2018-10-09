<template>
    <v-card>
        <v-card-title>
            Mes demandes
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Rechercher" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" rows-per-page-text="Lignes par page" :search="search" class="elevation-1">
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.date }}</td>
                <td class="text-xs-left">{{ props.item.iln }}</td>
                <td class="text-xs-left">{{ props.item.num }}</td>
                <td class="text-xs-left">{{ props.item.statut }}</td>
                <td class="text-xs-left">{{ props.item.resultat }}</td>
            </template>
            <template slot="pageText" slot-scope="props">
                Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Votre recherche sur "{{ search }}" ne donne aucun résultat.
            </v-alert>
        </v-data-table>
    </v-card>
</template>

<script>
    export default {
      name: "tableauComponent",
      data() {
        return {
          search: "",
          headers: [
            { text: "Date Création", value: "date" },
            { text: "ILN", value: "iln" },
            { text: "Numéro", value: "num" },
            { text: "Statut", value: "statut" },
            { text: "Résultat", value: "resultat" }
          ],
          items: [
            {
              date: "19/01/2018",
              iln: "04164616 - IUT Montpellier",
              num: 565595,
              statut: "En Cours",
              resultat: "Résultat"
            }
          ]
        };
      }
    };
</script>
