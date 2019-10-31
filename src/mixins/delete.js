import axios from 'axios';
import constants from '@/components/utils/const';
import TYPEDEMANDE from '../enums/typeDemande';

// MIXIN : permet d'importer ces deux fonctions dans n'importe quel composant
export default {
  methods: {
    // Suppression d'une demande
    supprimerDemande(numDemande, modif) {
      // Nécessite d'avoir le composant vue-full-loading dans le composant appelant
      this.loading = true;
      // Récupération des infos utilisateur et appel du WS
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios({
        headers: { Authorization: user.jwt },
        method: 'DELETE',
        url: `${process.env.VUE_APP_ROOT_API}demandes/${numDemande}?type=${modif}`,
      }).then(
        () => {
          this.loading = false;
          this.$router.replace('/');
        },
        () => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = constants.erreur500;
          this.loading = false;
        },
      );
    },
    // Retour arrière
    precedentDemande(numDemande, modif) {
      // Nécessite d'avoir le composant vue-full-loading dans le composant appelant
      this.loading = true;
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios({
        headers: { Authorization: user.jwt },
        method: 'GET',
        url: `${process.env.VUE_APP_ROOT_API}etapePrecedente/${numDemande}?type=${modif}`,
      }).then(
        () => {
          this.loading = false;
          if (modif === TYPEDEMANDE.DEMANDE_MODIFICATION) {
            switch (this.$router.currentRoute.path) {
              case '/fichierModif':
                this.$router.replace('/rcr'); break;
              case '/traitement':
                this.$router.replace('/fichierModif'); break;
              case '/fichierEnrichi':
                this.$router.replace('/traitement'); break;
              default:
                this.$router.replace('home'); break;
            }
          } else if (modif === TYPEDEMANDE.DEMANDE_EXEMPLARISATION) {
            switch (this.$router.currentRoute.path) {
              case '/typeExemplarisation':
                this.$router.replace('/rcr'); break;
              case '/fichierExemplarisation':
                this.$router.replace('/typeExemplarisation'); break;
              case '/simulationTest':
                this.$router.replace('/fichierExemplarisation'); break;
              default:
                this.$router.replace('home'); break;
            }
          } else if (modif === TYPEDEMANDE.DEMANDE_RECOUVREMENT) {
            switch (this.$router.currentRoute.path) {
              case '/fichierRecouv':
                this.$router.replace('/rcr'); break;
              default:
                this.$router.replace('home'); break;
            }
          }
        },
        () => {
          this.alert = true;
          this.alertType = 'error';
          this.alertMessage = constants.erreur500;
          this.loading = false;
        },
      );
    },
  },
};
