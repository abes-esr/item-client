<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <div class="py-5"/>
      <v-row>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-percent" route="recouvrement-etape-1-selection-rcr">
            Calculer mon taux de recouvrement
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-chart-bar" route="recouvrement-tableau">
            Gérer mes taux de recouvrement
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-plus" route="exemplarisation-etape-1-selection-rcr">
            Créer des exemplaires
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-chart-bar" route="exemplarisation-tableau">
            Gérer mes créations
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-pencil" route="modification-etape-1-selection-rcr">
            Modifier des exemplaires
          </bouton-item>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <bouton-item icon="mdi-chart-bar" route="modification-tableau">
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
