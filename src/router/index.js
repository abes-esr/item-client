/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

// import comme une fonction afin de permettre le lazy loading
const LoginComponent = () => import('@/components/login.vue');
const RcrComponent = () => import('@/components/rcr.vue');
const uploadComponent = () => import('@/components/modifmasse/uploadInit.vue');
const traitementComponent = () => import('@/components/modifmasse/selectTraitement.vue');
const ArchiveModifComponent = () => import('@/components/modifmasse/archiveModif.vue');
const GererTableauModifComponent = () => import('@/components/utils/gererTableauModif.vue');
const GererTableauExempComponent = () => import('@/components/utils/gererTableauExemp.vue');
const ArchiveExComponent = () => import('@/components/exemplarisation/archiveEx.vue');
const ProfilComponent = () => import('@/components/profil.vue');
const CGUComponent = () => import('@/components/footer/cgu.vue');
const DonneesComponent = () => import('@/components/footer/donnees.vue');
const MentionsComponent = () => import('@/components/footer/mentions.vue');
const uploadFinalComponent = () => import('@/components/uploadFinal.vue');
const simulationComponent = () => import('@/components/simulationModif.vue');
const simulationTest = () => import('@/components/simulationExemp.vue');
const homeComponent = () => import('@/components/home.vue');
const typeComponent = () => import('@/components/exemplarisation/selectType.vue');


Vue.use(Router);

// Routes de l'appli
// meta requiresAuth oblige l'utilisateur a être loggé pour y accéder
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'home',
      },
    },
    {
      path: '/accueil',
      name: 'home',
      component: homeComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/rcr',
      name: 'rcr',
      component: RcrComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/rcrEx',
      name: 'rcrEx',
      component: RcrComponent,
      props: { modif: false },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/fichierModif',
      name: 'uploadModif',
      component: uploadComponent,
      props: { modif: true },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/fichierExemp',
      name: 'uploadExemp',
      component: uploadComponent,
      props: { modif: false },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/fichierEnrichi',
      name: 'uploadFinal',
      component: uploadFinalComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/fichierExemplarisation',
      name: 'fichierExemp',
      component: uploadFinalComponent,
      props: { modif: false },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/traitement',
      name: 'traitement',
      component: traitementComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/type',
      name: 'type',
      component: typeComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
      // Si déjà authentifié, alors on redirige vers l'accueil
      beforeEnter: (to, from, next) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user !== null && user.jwt !== null) {
          next({
            path: from.fullPath,
          });
        } else {
          next();
        }
      },
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveModifComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/tableauExemplarisation',
      name: 'tabExemp',
      component: GererTableauExempComponent,
      props: { modif: false },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/tableauModification',
      name: 'tabModif',
      component: GererTableauModifComponent,
      props: { modif: true },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/archiveEx',
      name: 'archiveEx',
      component: ArchiveExComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/simulation',
      name: 'simulation',
      component: simulationComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/simulationTest',
      name: 'simulationTest',
      component: simulationTest,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/cgu',
      name: 'cgu',
      component: CGUComponent,
    },
    {
      path: '/donnees',
      name: 'donnees',
      component: DonneesComponent,
    },
    {
      path: '/mentions',
      name: 'mentions',
      component: MentionsComponent,
    },
    // Gestion de la 404, redirection vers la page d'accueil
    {
      path: '*',
      /* component: NotFoundComponent, */
      redirect: '/',
    },
  ],
  // Autorise le retour arrière via le navigateur + url propres
  mode: 'history',
});

// Si pas authentifié, on redirige vers la page de login, et si pas d'email, on redirige vers la page profil
// eslint-disable-next-line consistent-return
router.beforeResolve((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (user == null || user.jwt == null) {
      next({
        replace: true,
        path: '/login',
      });
    } else if ((user.email === null || user.email === '') && to.path !== '/profil') {
      return next('/profil');
    } else {
      next();
    }
  } else {
    next();
  }

  // ROUTEGUARD SELON ETAT DEMANDE
  // Filtre sur l'id de l'état de la demande et redirige vers la page correspondante à cet état
  const numDem = sessionStorage.getItem('dem');
  if (['/fichier', '/fichierEnrichi', '/traitement', '/simulation'].includes(to.path)) {
    if (numDem === undefined) {
      next({ path: '/' });
    } else if (user !== undefined && user !== null) {
      axios({
        headers: { Authorization: user.jwt },
        method: 'GET',
        url:
            `${process.env.VUE_APP_ROOT_API}demandes/${numDem}`,
      }).then(
        (result) => {
          switch (result.data.etatDemande.numEtat) {
            case 1:
              next({ path: '/fichier' });
              break;
            case 3:
              if (result.data.traitement != null) {
                next({ path: '/fichierEnrichi' });
              } else {
                next({ path: '/traitement' });
              }
              break;
            case 4:
              next({ path: '/simulation' });
              break;
            default:
              next({ path: '/tableau' });
              break;
          }
        },
        (error) => {
          if (error.response.status === 401) {
            this.$emit('logout');
          } else {
            next({ path: '/' });
          }
        },
      );
    } else {
      this.$emit('logout');
    }
  } else {
    next();
  }
});

export default router;
