import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/AppLogin.vue'
import ExempTable from '@/components/exemplarisation/ExempTable.vue'
import ModifTable from '@/components/modification/ModifTable.vue'
import RecouvTable from '@/components/recouvrement/RecouvTable.vue'
import ModifSteps from '@/components/modification/ModifSteps.vue'
import AppMain from '@/views/AppMain.vue'
import DemandesService from '@/service/DemandesService'

const routes = [
  { path: '/', component: AppMain, meta:{requiresAuth: true}},
  { path: '/login', component: Main, meta:{requiresAuth:false}},
  { path: '/accueil', component: AppMain, meta:{requiresAuth: true}},
  { path: '/exemplarisationTableau', component: ExempTable, meta:{requiresAuth:true}},
  { path: '/modificationTableau', component: ModifTable, meta:{requiresAuth:true}},
  { path: '/recouvrementTableau', component: RecouvTable, meta:{requiresAuth:true}},
  { path: '/modificationNouvelleDemande', component: ModifSteps, meta:{requiresAuth:true}},
// Ajoutez d'autres routes selon vos besoins
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    // Vérifiez si l'utilisateur est authentifié
    const isAuthenticated = await DemandesService.isAuthenticated();
    if (isAuthenticated) {
      // L'utilisateur est authentifié, autorisez l'accès à la page
      next();
    } else {
      // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
      next('/login');
    }
  } else {
    // La page ne nécessite pas d'authentification, autorisez l'accès
    next();
  }
});

export default router
