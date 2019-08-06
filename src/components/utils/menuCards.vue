<template>
  <!-- Card de menu cliquable réutilisable -->
  <v-card raised hover @click="route()" :height="cardHeight + 'em'">
    <v-card-title class="primary-title">
      <v-container class="grid-list-md">
        <v-row class="row wrap align-center">
          <v-col class="xs2">
            <span class="group pa-3 secondary" :style="{'height': cardHeight-3.6 + 'em'}">
              <v-icon style="margin-top: -7px" x-large dark color="white">{{ iconType }}</v-icon>
            </span>
          </v-col>
          <v-col class="xs9 ml-3">
            <h3 class="headline">{{ titleName }}</h3>
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
