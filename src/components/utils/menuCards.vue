<template>
  <!-- Card de menu cliquable réutilisable -->
  <v-card hover @click="route()" :height="cardHeight + 'em'" class="item-flexbox-vertical-align-for-parent">
    <v-card-title class="primary-title">
      <v-container class="grid-list-md">
        <v-row class="row align-center" style="margin-left: 1em">
          <show-at :breakpoints="{small: 1300, medium: 1400, large: 1600}" breakpoint="mediumAndAbove">
          <v-col cols="12" sm="12" md="12" lg="3">
            <span class="group">
              <v-icon x-large class="item-primary-color">{{ iconType }}</v-icon>
            </span>
          </v-col>
          </show-at>
          <v-col cols="12" sm="12" md="12" lg="9">
            <h3 v-html="titleName"></h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
  </v-card>
</template>

<script>
import { showAt } from 'vue-breakpoints';

export default {
  name: 'menuCards',

  components: { showAt },

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

<style>
  .group {
    border-radius: 5%;
    display: flex;
    flex: 1;
    justify-content: space-around;
  }
</style>
