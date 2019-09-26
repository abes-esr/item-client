<template>
    <v-footer height="auto" color="secondary">
      <v-row>
        <!--Pour adaptation responsive du component au besoin se baser sur le component menuCards.vue-->
          <v-btn text rounded color="#fafafa" href="http://abes.fr/">&copy; 2019 — <strong>ABES</strong></v-btn>
           <v-spacer></v-spacer>
          <v-btn text color="#fafafa" rounded @click="$router.push({ name: 'donnees' })">
            Données Personnelles
          </v-btn>
          <v-btn text color="#fafafa" rounded @click="$router.push({ name: 'cgu' })">
            Conditions Générales d'Utilisation (CGU)
          </v-btn>
          <v-btn text color="#fafafa" rounded @click="$router.push({ name: 'mentions' })">
            Mentions Légales
          </v-btn>
      </v-row>
    </v-footer>

</template>

<script>

export default {
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
