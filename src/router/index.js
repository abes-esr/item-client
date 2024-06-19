import {createRouter, createWebHistory} from 'vue-router'
import Main from '@/views/AppLogin.vue'
import ExempTable from '@/views/ExempTable.vue'
import ModifTable from '@/views/ModifTable.vue'
import RecouvTable from '@/views/RecouvTable.vue'
import AppMain from '@/views/AppMain.vue'
import DemandesService from '@/service/DemandesService'

//TODO au fur a mesure de la construction des composants les placer dans la rubrique component des routes
const routes = [
  { path: '/', component: AppMain, meta:{requiresAuth: true}},
  { path: '/identification', component: Main, meta:{requiresAuth:false}},
  { path: '/deconnexion', component: Main, meta:{requiresAuth:true}},
  { path: '/accueil', component: AppMain, meta:{requiresAuth: true}},
  { path: '/modification-adresse-mail', component: AppMain, meta:{requiresAuth: true}},
  { path: '/exemplarisation-tableau', component: ExempTable, meta:{requiresAuth:true}},
  { path: '/modification-tableau', component: ModifTable, meta:{requiresAuth:true}},
  { path: '/recouvrement-tableau', component: RecouvTable, meta:{requiresAuth:true}},
  { path: '/modification-etape-1-selection-rcr', component: AppMain, meta:{requiresAuth:true}},
  { path: '/modification-etape-2-chargement-liste-ppn', component: AppMain, meta:{requiresAuth:true}},
  { path: '/modification-etape-3-choix-de-traitement', component: AppMain, meta:{requiresAuth:true}},
  { path: '/modification-etape-4-chargement-fichier-complete', component: AppMain, meta:{requiresAuth:true}},
  { path: '/modification-etape-5-simulation-avant-envoi', component: AppMain, meta:{requiresAuth:true}},
  { path: '/exemplarisation-etape-1-selection-rcr', component: AppMain, meta:{requiresAuth:true}},
  { path: '/exemplarisation-etape-2-choix-type-exemplarisation', component: AppMain, meta:{requiresAuth:true}},
  { path: '/exemplarisation-etape-3-chargement-fichier-exemplaires', component: AppMain, meta:{requiresAuth:true}},
  { path: '/recouvrement-etape-1-selection-rcr', component: AppMain, meta:{requiresAuth:true}},
  { path: '/recouvrement-etape-2-chargement-fichier', component: AppMain, meta:{requiresAuth:true}},
  { path: '/donnees-personnelles', component: AppMain, meta:{requiresAuth:false}},
  { path: '/sortie-application-vers-assistance', component: AppMain, meta:{requiresAuth:false}},
  { path: '/sortie-application-vers-documentation', component: AppMain, meta:{requiresAuth:false}},
  { path: '/sortie-application-vers-accessibilite', component: AppMain, meta:{requiresAuth:false}},
  { path: '/sortie-application-vers-mentions-legales', component: AppMain, meta:{requiresAuth:false}},
  { path: '/sortie-application-vers-cgu', component: AppMain, meta:{requiresAuth:false}}
// Ajoutez d'autres routes selon vos besoins
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

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
});

export default router
