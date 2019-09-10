<template>
  <!-- Card de menu cliquable réutilisable -->
  <v-card hover @click="route()" :height="cardHeight + 'em'">
    <v-card-title class="primary-title">
      <v-container class="grid-list-md">
        <v-row class="row wrap align-center">
          <v-col v-for="n in 1" :key="n" cols="12" sm="3">
            <span class="group">
              <v-icon x-large >{{ iconType }}</v-icon>
            </span>
          </v-col>
          <v-col v-for="n in 1" :key="n" cols="12" sm="9">
            <h3 v-html="titleName"></h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'menuCards',

  props: {
    titleName: String,
    routerLink: String,
    iconType: String,
    cardHeight: {
      default: 0,
    },
  },

  methods: {
    route() {
      this.$router.push({ name: this.routerLink });
    },
  },
};
</script>

<style scoped>
  .group {
    border-radius: 5%;
    display: flex;
    flex: 1;
    justify-content: space-around;
  }
</style>
