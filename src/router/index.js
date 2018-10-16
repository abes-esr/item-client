import Vue from 'vue'
import Router from 'vue-router'
import LoginComponent from '@/components/login.vue'
import RcrComponent from '@/components/rcr.vue'
import uploadComponent from '@/components/fileUpload.vue'
import traitementComponent from '@/components/selectTraitement.vue'
import TableauComponent from '@/components/tableau.vue'
import ProfilComponent from '@/components/profil.vue'
import AboutComponent from '@/components/footer/about.vue'
import CGUComponent from '@/components/footer/cgu.vue'
import DonneesComponent from '@/components/footer/donnees.vue'
import MentionsComponent from '@/components/footer/mentions.vue'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'tab'
      }
    },
    {
      path: '/rcr',
      name: 'rcr',
      component: RcrComponent,
      meta: {
        requiresAuth: true,
        userOnly: true
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: uploadComponent,
      meta: {
        requiresAuth: true,
        userOnly: true
      }
    },
    {
      path: '/traitement',
      name: 'traitement',
      component: traitementComponent,
      meta: {
        requiresAuth: true,
        userOnly: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
      beforeEnter: (to, from, next) => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (user !== null && user.jwt !== null) {
          next({
            path: from.fullPath
          })
        } else {
          next()
        }
      }
    },
    {
      path: '/tab',
      name: 'tab',
      component: TableauComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
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
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (user == null || user.jwt == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      if (to.matched.some(record => record.meta.userOnly) && user.role != "USER" && to.path != "/tab") {
        next({
          path: '/tab',
        })
      } else {
        if (user.email == null && to.path != "/profil") {
          next({
              path: '/profil'
            })
        } else {
          next()
        }
      }
    }
  } else {
    next()
  }
})

export default router