import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Utilisateur/Login.vue'
import ExempTable from '@/views/Exemplarisation/ExempTable.vue'
import ModifTable from '@/views/Modification/ModifTable.vue'
import RecouvTable from '@/views/Recouvrement/RecouvTable.vue'
import ModifSteps from '@/views/Modification/ModifSteps.vue'
import RecouvSteps from '@/views/Recouvrement/RecouvSteps.vue'
import ExempSteps from '@/views/Exemplarisation/ExempSteps.vue'
import SuppSteps from '@/views/Suppression/SuppSteps.vue'
import Accueil from '@/views/Accueil.vue'
import ModificationEmail from '@/views/Utilisateur/ModificationEmail.vue'
import itemService from '@/service/ItemService'
import {useAuthStore} from '@/store/authStore'
import SuppTable from "@/views/Suppression/SuppTable.vue"
import Donnees from "@/views/Utilisateur/Informations/DonneesPersonnelles.vue"
import Mentions from "@/views/Utilisateur/Informations/MentionsLegales.vue"

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
    path: '/donnees',
    name: 'donnees',
    component: Donnees,
    meta: { requiresAuth: false }
  },
  {
    path: '/mentions',
    name: 'mentions',
    component: Mentions,
    meta: { requiresAuth: false }
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
    path: '/suppression-tableau',
    name: 'suppression-tableau',
    component: SuppTable,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification',
    name: 'modification',
    component: ModifSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification/:id',
    name: 'modificationWithId',
    component: ModifSteps,
    props: true,
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
    path: '/suppression',
    name: 'suppression',
    component: SuppSteps,
    meta: {requiresAuth: true}
  },
  {
    path: '/suppression/:id',
    name: 'suppressionWithId',
    component: SuppSteps,
    props: true,
    meta: {requiresAuth: true}
  },

  // Gestion de la 404, redirection vers la page d'accueil
  {
    path: '/:pathMatch(.*)*',
    redirect: "/accueil",
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
        const valid = await itemService.checkToken();
        if (valid.data) {
          next();
        } else {
          console.error('Token invalide auprès du serveur');
          itemService.logout();
          next('/identification');
        }
      } catch (error) {
        console.error(error);
        itemService.logout();
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
