import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/Home.vue')
  },
   {
    path: '/posts/:id',
    name: 'Post',
    component: () => import('@/components/Post.vue')
  },
 
  {
    path: '/contributors/:categoryId',
    name: 'Contributors',
    component: () => import('@/components/Contributors.vue')
  },
  {
    path: '/events/:id',
    name: 'Event',
    component: () => import('@/components/Event.vue')
  },
  {
    path: '/contributors/:categoryId/:id',
    name: 'Contributor',
    component: () => import('@/components/Contributor.vue')
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('@/components/Schedule.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/components/PostsIndex.vue')
  },
  {
    path: '/calls/:id',
    name: 'Opencall',
    component: () => import('@/components/Opencall.vue')
  },
  {
    path: '/search/:term',
    name: 'SearchResults',
    component: () => import('@/components/SearchResults.vue')
  },
  {
    path: '/:id',
    name: 'Page',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/components/Page.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
