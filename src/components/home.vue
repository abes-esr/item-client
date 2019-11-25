<template>
  <!-- PAGE D'ACCUEIL -->
  <v-row class="container">
  <v-row>
    <v-col cols="12" sm="12" md="12" lg="6">
      <menu-cards :cardHeight=9 iconType="pie_chart" routerLink="rcrRecouv" titleName='Calculer mon taux de <span style="white-space: nowrap;">recouvrement</span>' class="item-horizontal-align"></menu-cards>
      <menu-cards :cardHeight=9 iconType="add_circle_outline" routerLink="rcrEx" titleName='Créer des exemplaires' class="item-horizontal-align"></menu-cards>
      <menu-cards :cardHeight=9 iconType="edit" routerLink="rcr" titleName='Modifier des <span style="white-space: nowrap;">exemplaires</span>' class="item-horizontal-align"></menu-cards>

    </v-col>
    <v-col cols="12" sm="12" md="12" lg="6">
      <menu-cards :cardHeight=9 iconType="sort" routerLink="tabRecouv" titleName='Gérer mes <span style="white-space: nowrap;"> taux de recouvrement</span>' class="item-horizontal-align"></menu-cards>
      <menu-cards :cardHeight=9 iconType="sort" routerLink="tabExemp" titleName='Gérer mes <span style="white-space: nowrap;">créations</span>' class="item-horizontal-align"></menu-cards>
      <menu-cards :cardHeight=9 iconType="sort" routerLink="tabModif" titleName='Gérer mes <span style="white-space: nowrap;">modifications</span>' class="item-horizontal-align"></menu-cards>
    </v-col>
  </v-row>
</v-row>
</template>

<script>
import menuCards from '@/components/utils/menuCards.vue';

export default {
  components: {
    menuCards,
  },
};
</script>

<style scoped>
  .v-card {
    margin-top: 10px;
  }
  .group {
    border-radius: 5%;
    display: flex;
    flex: 1;
    justify-content: space-around;
  }
  .container {
    margin-top: 3em;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>
