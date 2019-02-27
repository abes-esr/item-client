<template>
  <v-card raised hover @click="route()">
    <v-card-title primary-title>
      <v-container grid-list-md>
        <v-layout row wrap align-center>
          <v-flex xs2>
            <span class="group pa-3 secondary">
              <v-icon x-large dark>{{ iconType }}</v-icon>
            </span>
          </v-flex>
          <v-flex xs6 ml-4>
            <h3 class="headline">{{ titleName }}</h3>
          </v-flex>
        </v-layout>
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
      iconType: String
    },

    data() {
      return {

      };
    },

    methods: {
      route(){
        this.$router.push({ name : this.routerLink})
      }
    }
  };
</script>
