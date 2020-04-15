import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: () => import('@/components/Post.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/Blog.vue')
  },
  {
    path: '/calls/:id',
    name: 'Opencall',
    component: () => import('@/components/Opencall.vue')
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
