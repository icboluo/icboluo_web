import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HelloWorld from '@/components/HelloWorld.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }
    // {
    //   path: '/',
    //   name: 'Login',
    //   component: Login
    // },
    // {
    //   path: '/fundData',
    //   name: 'FundData',
    //   component: FundData
    // },
    // {
    //   path: '/frontPage',
    //   name: 'FrontPage',
    //   component: FrontPage,
    //   children: [
    //     {
    //       // 这个/在这里代表子目录，如果不加，会到全局去找目录路由（而不是子目录中找） .../note（上面是没有的
    //       path: '/note',
    //       component: Note
    //     },
    //     {
    //       path: '/fund',
    //       component: Fund
    //     },
    //     {
    //       path: '/game',
    //       component: Game
    //     }
    //   ]
    // }
  ]
})

export default router
