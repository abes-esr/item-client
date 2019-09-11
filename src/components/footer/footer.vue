<template>
    <v-footer height="auto" class="item-secondary-color-background">
      <v-row>
        <!--Pour adaptation responsive du component au besoin se baser sur le component menuCards.vue-->
          <v-btn text color="#fafafa" href="http://abes.fr/">&copy; 2019 — <strong>ABES</strong></v-btn>
           <v-spacer></v-spacer>
        <hide-at :breakpoints="{small: 620, medium: 1400, large: 1600}" breakpoint="mediumAndBelow">
          <v-btn text color="#fafafa" flat round @click="$router.push({ name: 'donnees' })">
            Données Personnelles
          </v-btn>
        </hide-at>
        <hide-at :breakpoints="{small: 620, medium: 1400, large: 1600}" breakpoint="mediumAndBelow">
          <v-btn text color="#fafafa" flat round @click="$router.push({ name: 'cgu' })">
            Conditions Générales d'Utilisation (CGU)
          </v-btn>
        </hide-at>
          <hide-at :breakpoints="{small: 620, medium: 1400, large: 1600}" breakpoint="mediumAndBelow">
          <v-btn text color="#fafafa" flat round @click="$router.push({ name: 'mentions' })">
            Mentions Légales
          </v-btn>
          </hide-at>
      </v-row>
    </v-footer>

</template>

<script>
/** import axios from 'axios';* */
import { hideAt } from 'vue-breakpoints';

export default {
  components: { hideAt },
  name: 'footerComponent',
  data() {
    return {
      user: {},
      /** applicationVersion: '',* */
    };
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    /** this.getApplicationVersion();* */
  },
  /**
  methods: {
    getApplicationVersion() {
      return axios({
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}versionApplication`,
      }).then(
        (result) => {
          this.applicationVersion = result.data;
        },
      );
    },
  },
  * */
};
</script>

<style scoped>
 .v-btn {
     text-transform: none !important;
 }
 </style>
