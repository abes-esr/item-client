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
import {useAuthStore} from '@/store/authStore'

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
    path: '/modification-etape-1-selection-rcr',
    name: 'modification-etape-1-selection-rcr',
    component: ModifSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-etape-2-chargement-liste-ppn',
    name: 'modification-etape-2-chargement-liste-ppn',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-etape-3-choix-de-traitement',
    name: 'modification-etape-3-choix-de-traitement',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-etape-4-chargement-fichier-complete',
    name: 'modification-etape-4-chargement-fichier-complete',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-etape-5-simulation-avant-envoi',
    name: 'modification-etape-5-simulation-avant-envoi',
    component: Accueil,
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const authStore = useAuthStore();

  if (requiresAuth) {
    if (authStore.isAuthenticated) {
      try {
        const valid = await DemandesService.checkToken();
        if (valid.data) {
          next();
        } else {
          console.error('Token invalide auprès du serveur');
          DemandesService.logout();
          next('/identification');
        }
      } catch (error) {
        console.error(error);
        DemandesService.logout();
        next('/identification');
      }
    } else {
      next('/identification');
    }
  } else {
    next();
  }
});

export default router
