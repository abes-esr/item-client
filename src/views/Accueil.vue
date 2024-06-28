<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <div class="py-5"/>
      <v-row>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil id="btn-recouvrement" icon="mdi-percent" route="recouvrement">
            Calculer mon taux de recouvrement
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil id="btn-recouvrement-tableau" icon="mdi-chart-bar" route="recouvrement-tableau">
            Gérer mes taux de recouvrement
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil id="btn-exemplarisation" icon="mdi-plus" route="exemplarisation">
            Créer des exemplaires
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil id="btn-exemplarisation-tableau" icon="mdi-chart-bar" route="exemplarisation-tableau">
            Gérer mes créations
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil id="btn-modification" icon="mdi-pencil" route="modification-etape-1-selection-rcr">
            Modifier des exemplaires
          </BtnAccueil>
        </v-col>
        <v-col class="text-center" cols="12" md="6">
          <BtnAccueil id="btn-modification-tableau" icon="mdi-chart-bar" route="modification-tableau">
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
