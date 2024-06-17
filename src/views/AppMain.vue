<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <div class="py-5"/>
      <v-row>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-percent" route="tauxRecouv">
            Calculer mon taux de recouvrement
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-chart-bar" route="recouvrementTableau">
            Gérer mes taux de recouvrement
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-plus" route="nouveauxExemplaires">
            Créer des exemplaires
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-chart-bar" route="exemplarisationTableau">
            Gérer mes créations
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-pencil" route="modifExempl">
            Modifier des exemplaires
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-chart-bar" route="modificationTableau">
            Gérer mes modifications
          </bouton-item>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import BoutonItem from '@/components/Home/BoutonItem.vue';
</script>
