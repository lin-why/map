import Vue from 'vue'
import VueRouter from 'vue-router'
const Map = () => import('../view/Map');

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Map
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('../view/Data')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
