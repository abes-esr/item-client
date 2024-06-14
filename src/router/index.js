import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/views/AppLogin.vue';
import ExempTable from '@/views/ExempTable.vue';
import ModifTable from '@/views/ModifTable.vue';
import RecouvTable from '@/views/RecouvTable.vue';
import ModifSteps from '@/views/ModifSteps.vue';
import AppMain from '@/views/AppMain.vue';

const routes = [
  {
    path: '/',
    component: AppMain,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Main,
    meta: { requiresAuth: false }
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: AppMain,
    meta: { requiresAuth: true }
  },
  {
    path: '/exemplarisationTableau',
    name: 'exemplarisationTableau',
    component: ExempTable,
    meta: { requiresAuth: true }
  },
  {
    path: '/modificationTableau',
    name: 'modificationTableau',
    component: ModifTable,
    meta: { requiresAuth: true }
  },
  {
    path: '/recouvrementTableau',
    name: 'recouvrementTableau',
    component: RecouvTable,
    meta: { requiresAuth: true }
  },
  {
    path: '/modificationNouvelleDemande',
    name: 'modificationNouvelleDemande',
    component: ModifSteps,
    meta: { requiresAuth: true }
  },
// Ajoutez d'autres routes selon vos besoins
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    // Vérifiez si l'utilisateur est authentifié
    const isAuthenticated = user && user.token;
    if (!isAuthenticated) {
      // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
      next('/login');
    }
  }
  // La page ne nécessite pas d'authentification, autorisez l'accès
  next();
});

export default router;
