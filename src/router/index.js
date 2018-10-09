import Vue from 'vue'
import Router from 'vue-router'
import LoginComponent from '@/components/login.vue'
import RcrComponent from '@/components/rcr.vue'
import uploadComponent from '@/components/fileUpload.vue'
import TableauComponent from '@/components/tableau.vue'
import ProfilComponent from '@/components/profil.vue'


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
        requiresAuth: true
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: uploadComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
      beforeEnter: (to, from, next) => {
        if (sessionStorage.getItem('jwt') !== null) {
          next({
            path: '/'
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
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (sessionStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})