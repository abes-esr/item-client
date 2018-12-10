/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import Router from 'vue-router';
import LoginComponent from '@/components/login.vue';
import RcrComponent from '@/components/rcr.vue';
import uploadComponent from '@/components/uploadInit.vue';
import traitementComponent from '@/components/selectTraitement.vue';
import TableauComponent from '@/components/tableau.vue';
import ProfilComponent from '@/components/profil.vue';
import AboutComponent from '@/components/footer/about.vue';
import CGUComponent from '@/components/footer/cgu.vue';
import DonneesComponent from '@/components/footer/donnees.vue';
import MentionsComponent from '@/components/footer/mentions.vue';
import NotFoundComponent from '@/components/errors/notFound.vue';
import uploadFinalComponent from '@/components/uploadFinal.vue';
import simulationComponent from '@/components/simulation.vue';
import homeComponent from '@/components/home.vue';
import axios from 'axios';

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
      component: TableauComponent,
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

router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (user == null || user.jwt == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      });
    } else if (user.email == null && to.path !== '/profil') {
      next({
        path: '/profil',
      });
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
    } else {
      axios({
        headers: { Authorization: user.jwt },
        method: 'GET',
        url:
          `${process.env.ROOT_API}demandes/${numDem}`,
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
    }
  } else {
    next();
  }
});

export default router;
