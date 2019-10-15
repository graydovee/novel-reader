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
      name: 'list',
      component: () => import('./views/List.vue')
    },
    {
      path: '/read/:bookId',
      name: 'read',
      component: () => import('./views/Read.vue')
    },
    {
      path: '/net',
      name: 'homeNet',
      component: () => import('./views/HomeNet.vue')
    },
    {
      path: '/net/list',
      name: 'netList',
      component: () => import('./views/ListNet.vue')
    },
    {
      path: '/net/read',
      name: 'netRead',
      component: () => import('./views/ReadNet.vue')
    }
  ]
})
