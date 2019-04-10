import axios from 'axios';

// MIXIN : permet d'importer ces deux fonctions dans n'importe quel composant
export default {
  methods: {
    // Suppression d'une demande
    supprimerDemande(numDemande) {
      // Nécessite d'avoir le composant vue-full-loading dans le composant appelant
      this.loading = true;
      // Récupération des infos utilisateur et appel du WS
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios({
        headers: { Authorization: user.jwt },
        method: 'DELETE',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${numDemande}`,
      }).then(
        () => {
          this.loading = false;
          this.$router.replace('/');
        },
        () => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = "Impossible d'annuler la demande. Veuillez réessayer ultérieurement. Merci de nous contacter si le problème persiste.";
          this.loading = false;
        },
      );
    },
    // Retour arrière
    precedentDemande(numDemande) {
      // Nécessite d'avoir le composant vue-full-loading dans le composant appelant
      this.loading = true;
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios({
        headers: { Authorization: user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}etapePrecedente/${numDemande}`,
      }).then(
        () => {
          this.loading = false;
          // Redirection après précédent
          if (this.$router.currentRoute.name === 'uploadFinal') {
            this.$router.replace('/traitement');
          } else {
            this.$router.replace('/fichier');
          }
        },
        () => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = 'Impossible de revenir en arrière. Veuillez réessayer ultérieurement. Merci de nous contacter si le problème persiste.';
          this.loading = false;
        },
      );
    },
  },
};
