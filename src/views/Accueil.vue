<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height">
      <v-row class="pa-5">
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-recouvrement" icon="mdi-percent" route="recouvrement">
            Calculer mon taux de recouvrement
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-recouvrement-tableau" icon="mdi-chart-bar" route="recouvrement-tableau">
            Gérer mes taux de recouvrement
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-exemplarisation" icon="mdi-plus-circle-outline" route="exemplarisation">
            Créer des exemplaires
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-exemplarisation-tableau" icon="mdi-chart-bar" route="exemplarisation-tableau">
            Gérer mes créations
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-modification" icon="mdi-pencil" route="modification">
            Modifier des exemplaires
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-modification-tableau" icon="mdi-chart-bar" route="modification-tableau">
            Gérer mes modifications
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-suppression" icon="mdi-close-circle-outline" route="suppression">
            Supprimer des exemplaires
          </btn-accueil>
        </v-col>
        <v-col class="text-center" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
          <btn-accueil id="btn-suppression-tableau" icon="mdi-chart-bar" route="suppression-tableau">
            Gérer mes suppressions
          </btn-accueil>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import BtnAccueil from '@/components/Home/BtnAccueil.vue';
</script>
