<template>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Déconnexion
        </v-card-title>
        <v-card-text>
          Vous avez été déconnecté car votre session a expiré. <br />Vous pouvez dès maintenant vous reconnecter et reprendre votre activité.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      default: false,
    },
  },
};
</script>
