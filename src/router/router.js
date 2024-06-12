import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/AppLogin.vue'
import ExempTable from '@/components/exemplarisation/ExempTable.vue'
import ModifTable from '@/components/modification/ModifTable.vue'
import RecouvTable from '@/components/recouvrement/RecouvTable.vue'
import ModifSteps from '@/components/modification/ModifSteps.vue'
const routes = [
  { path: '/', component: Main },
  { path: '/exemplarisationTableau', component: ExempTable, props: { onBackendError: 'setBackendError', onBackendSuccess: 'liftErrors' } },
  { path: '/modificationTableau', component: ModifTable },
  { path: '/recouvrementTableau', component: RecouvTable },
  { path: '/modificationNouvelleDemande', component: ModifSteps },
// Ajoutez d'autres routes selon vos besoins
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
