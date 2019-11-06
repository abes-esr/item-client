<template>
    <!-- POPUP AFIN DE PREVENIR L'UTILISATEUR QUAND IL EST DECONNECTE AUTOMATIQUEMENT SI LA SESSION EXPIRE -->
    <v-dialog v-model="popupDeconnect" width="500">
      <v-card>
        <v-card-title class="headline red white--text" primary-title>
          Déconnexion
        </v-card-title>
        <v-card-text>
          Vous avez été déconnecté car votre session a expiré. <br />Vous pouvez dès maintenant vous reconnecter et reprendre votre activité.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('closePopup')">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    popupDeconnect: {
      default: false,
    },
  },
};
</script>
