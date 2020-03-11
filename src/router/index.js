import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Exercises from '../components/Exercises.vue'
import store from '../store/index'
import AllModules from '../components/AllModules.vue'
import Module from '../views/Module.vue'
import Session from '../views/Session.vue'

Vue.use(VueRouter)

async function beforeEnter (_to, _FormData, next) {
  if (!store.getters['user/isAuthenticated']) {
    await store.dispatch('user/fetchUser')
  }
  if (store.getters['user/isAuthenticated']) {
    next()
    return
  }
  next('/login')
}

const routes = [
  {
    path: '/session/:id/do',
    name: 'Session',
    component: Session,
    beforeEnter
  },
  {
    path: '/module/:id',
    name: 'Module',
    component: Module,
    beforeEnter
  },
  {
    path: '/allModules',
    name: 'AllModules',
    component: AllModules,
    beforeEnter
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: Exercises,
    beforeEnter
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
