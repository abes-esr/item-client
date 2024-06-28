import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Utilisateur/Login.vue'
import ExempTable from '@/views/Exemplarisation/ExempTable.vue'
import ModifTable from '@/views/Modification/ModifTable.vue'
import RecouvTable from '@/views/Recouvrement/RecouvTable.vue'
import ModifSteps from '@/views/Modification/ModifSteps.vue';
import Accueil from '@/views/Accueil.vue';
import ModificationEmail from '@/views/Utilisateur/ModificationEmail.vue';
import DemandesService from '@/service/DemandesService'
import RecouvSteps from '@/views/Recouvrement/RecouvSteps.vue';
import ExempSteps from '@/views/Exemplarisation/ExempSteps.vue';

const service = DemandesService;

const routes = [
  {
    path: '/',
    component: Accueil,
    meta: { requiresAuth: true }
  },
  {
    path: '/identification',
    name: 'identification',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/deconnexion',
    name: 'deconnexion',
    component: Login,
    meta: { requiresAuth: true }
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: Accueil,
    meta: { requiresAuth: true }
  },
  {
    path: '/premiere-connexion',
    name: 'premiere-connexion',
    component: ModificationEmail,
    meta: { requiresAuth: true }
  },
  {
    path: '/modification-adresse-mail',
    name: 'modification-adresse-mail',
    component: ModificationEmail,
    meta: {requiresAuth: true}
  },
  {
    path: '/exemplarisation-tableau',
    name: 'exemplarisation-tableau',
    component: ExempTable,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-tableau',
    name: 'modification-tableau',
    component: ModifTable,
    meta: {requiresAuth: true}
  },
  {
    path: '/recouvrement-tableau',
    name: 'recouvrement-tableau',
    component: RecouvTable,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification',
    name: 'modification',
    component: ModifSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/exemplarisation',
    name: 'exemplarisation',
    component: ExempSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/exemplarisation/:id',
    name: 'exemplarisationWithId',
    props: true,
    component: ExempSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/recouvrement',
    name: 'recouvrement',
    component: RecouvSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/recouvrement/:id',
    name: 'recouvrementWithId',
    component: RecouvSteps,
    props: true,
    meta: {requiresAuth: true}
  },
  {
    path: '/donnees-personnelles',
    name: 'donnees-personnelles',
    component: Accueil,
    meta: {requiresAuth: false}
  },
  {
    path: '/sortie-application-vers-assistance',
    name: 'sortie-application-vers-assistance',
    component: Accueil,
    meta: {requiresAuth: false}
  },
  {
    path: '/sortie-application-vers-documentation',
    name: 'sortie-application-vers-documentation',
    component: Accueil,
    meta: {requiresAuth: false}
  },
  {
    path: '/sortie-application-vers-accessibilite',
    name: 'sortie-application-vers-accessibilite',
    component: Accueil,
    meta: {requiresAuth: false}
  },
  {
    path: '/sortie-application-vers-mentions-legales',
    name: 'sortie-application-vers-mentions-legales',
    component: Accueil,
    meta: {requiresAuth: false}
  },
  {
    path: '/sortie-application-vers-cgu',
    name: 'sortie-application-vers-cgu',
    component: Accueil,
    meta: {requiresAuth: false}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const isAuthenticated = user && user.token

    if (isAuthenticated) {
      try {
        const valid = await service.checkToken();
        if (valid.data) {
          next();
        } else {
          console.error('Token invalide auprès du serveur')
          service.logout()
          next('/identification')
        }
      } catch (error) {
        console.error(error)
        service.logout()
        next('/identification');
      }
    } else {
      next('/identification');
    }
  } else {
    next();
  }
})

export default router
