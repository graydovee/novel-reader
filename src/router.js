import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/list/:bookId',
      name: 'home',
      component: () => import('./views/List.vue')
    },
    {
      path: '/read/:bookId',
      name: 'home',
      component: () => import('./views/Read.vue')
    }
  ]
})
