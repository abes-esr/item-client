/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

const LoginComponent = () => import('@/components/login.vue');
const RcrComponent = () => import('@/components/rcr.vue');
const uploadComponent = () => import('@/components/uploadInit.vue');
const traitementComponent = () => import('@/components/selectTraitement.vue');
const GererComponent = () => import('@/components/gerer.vue');
const ArchiveComponent = () => import('@/components/archive.vue');
const ProfilComponent = () => import('@/components/profil.vue');
const AboutComponent = () => import('@/components/footer/about.vue');
const CGUComponent = () => import('@/components/footer/cgu.vue');
const DonneesComponent = () => import('@/components/footer/donnees.vue');
const MentionsComponent = () => import('@/components/footer/mentions.vue');
const NotFoundComponent = () => import('@/components/errors/notFound.vue');
const uploadFinalComponent = () => import('@/components/uploadFinal.vue');
const simulationComponent = () => import('@/components/simulation.vue');
const homeComponent = () => import('@/components/home.vue');

Vue.use(Router);

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
      path: '/fichier',
      name: 'upload',
      component: uploadComponent,
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
      path: '/traitement',
      name: 'traitement',
      component: traitementComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
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
      path: '/tableau',
      name: 'tab',
      component: GererComponent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveComponent,
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
      path: '/apropos',
      name: 'about',
      component: AboutComponent,
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
    {
      path: '*', component: NotFoundComponent,
    },
  ],
  mode: 'history',
});

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
