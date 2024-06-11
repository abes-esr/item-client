import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/AppMain.vue'
import ExempTable from '@/components/exemplarisation/ExempTable.vue'
import ModifTable from '@/components/modification/ModifTable.vue'
import RecouvTable from '@/components/recouvrement/RecouvTable.vue'
const routes = [
  { path: '/', component: Main },
  { path: '/exemplarisationTableau', component: ExempTable },
  { path: '/modificationTableau', component: ModifTable },
  { path: '/recouvrementTableau', component: RecouvTable },
// Ajoutez d'autres routes selon vos besoins
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
