import axios from 'axios';

export default {
  methods: {
    supprimerDemande(numDemande) {
      this.loading = true;
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios({
        headers: { Authorization: user.jwt },
        method: 'DELETE',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${numDemande}`,
      }).then(
        () => {
          this.loading = false;
          this.$router.push('/');
        },
        () => {
          this.alert = true;
          this.alertMessage = "Impossible d'annuler la demande. Veuillez réessayer ultérieurement. Merci de nous contacter si le problème persiste.";
          this.loading = false;
        },
      );
    },
  },
};
