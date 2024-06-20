import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/views/AppLogin.vue'
import ExempTable from '@/views/ExempTable.vue'
import ModifTable from '@/views/ModifTable.vue'
import RecouvTable from '@/views/RecouvTable.vue'
import ModifSteps from '@/views/ModifSteps.vue';
import Accueil from '@/views/Accueil.vue';

import DemandesService from '@/service/DemandesService'

const routes = [
  {
    path: '/',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/identification',
    name: 'identification',
    component: Main,
    meta: {requiresAuth: false}
  },
  {
    path: '/deconnexion',
    name: 'deconnexion',
    component: Main,
    meta: {requiresAuth: true}
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-adresse-mail',
    name: 'modification-adresse-mail',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/exemplarisation-tableau',
    name: 'exemplarisation-tableau',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-tableau',
    name: 'modification-tableau',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/recouvrement-tableau',
    name: 'recouvrement-tableau',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/modification-etape-1-selection-rcr',
    name: 'modification-etape-1-selection-rcr',
    component: Accueil,
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
    path: '/exemplarisation-etape-1-selection-rcr',
    name: 'exemplarisation-etape-1-selection-rcr',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/exemplarisation-etape-2-choix-type-exemplarisation',
    name: 'exemplarisation-etape-2-choix-type-exemplarisation',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/exemplarisation-etape-3-chargement-fichier-exemplaires',
    name: 'exemplarisation-etape-3-chargement-fichier-exemplaires',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/recouvrement-etape-1-selection-rcr',
    name: 'recouvrement-etape-1-selection-rcr',
    component: Accueil,
    meta: {requiresAuth: true}
  },
  {
    path: '/recouvrement-etape-2-chargement-fichier',
    name: 'recouvrement-etape-2-chargement-fichier',
    component: Accueil,
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
    // Vérifiez si il y a la présence d'un utilisateur et d'un jeton dans le session storage
    const isAuthenticated = user && user.token

    if (isAuthenticated) {
      try {
        // Vérifiez la validité du jeton auprès du serveur
        await DemandesService.checkToken();
        // L'utilisateur est authentifié, autorisez l'accès à la page
        next();
      } catch (error) {
        // Le jeton n'est pas valide, redirigez l'utilisateur vers la page de connexion
        next('/identification');
      }
    } else {
      // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
      next('/identification');
    }
  } else {
    // La page ne nécessite pas d'authentification, autorisez l'accès
    next();
  }
})

export default router
