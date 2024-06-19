<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <div class="py-5"/>
      <v-row>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil icon="mdi-percent" route="tauxRecouv">
            Calculer mon taux de recouvrement
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil icon="mdi-chart-bar" route="recouvrementTableau">
            Gérer mes taux de recouvrement
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil icon="mdi-plus" route="nouveauxExemplaires">
            Créer des exemplaires
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil icon="mdi-chart-bar" route="exemplarisationTableau">
            Gérer mes créations
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil icon="mdi-pencil" route="modifExempl">
            Modifier des exemplaires
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil icon="mdi-chart-bar" route="modificationTableau">
            Gérer mes modifications
          </BtnAccueil>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import BtnAccueil from '@/components/Home/BtnAccueil.vue';
</script>
