import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import FundData from '@/views/FundData.vue'
import FrontPage from '@/views/FrontPage.vue'
import Note from '@/views/Note.vue'
import Fund from '@/views/Fund.vue'
import Game from '@/views/Game.vue'
import TableList from '@/views/TableList.vue'
import PictureGraph from '@/views/PictureGraph.vue'
import FundMetric from '@/views/FundMetric.vue'
import StockSeason from '@/views/stock/StockSeason.vue'
import StockTrade from '@/views/stock/StockTrade.vue'
import StockAccount from '@/views/stock/StockAccount.vue'
import StockRank from '@/views/stock/StockRank.vue'
import StockProfit from '@/views/stock/StockProfit.vue'
import StockPlayerDetail from '@/views/stock/StockPlayerDetail.vue'
import StockBot from '@/views/stock/StockBot.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
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
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/frontPage',
      name: 'FrontPage',
      component: FrontPage,
      children: [
        {
          // 这个/在这里代表子目录，如果不加，会到全局去找目录路由（而不是子目录中找） .../note（上面是没有的
          path: '/note',
          component: Note
        },
        {
          path: '/tableList',
          name: 'TableList',
          component: TableList
        },
        {
          path: '/pictureGraph',
          name: 'PictureGraph',
          component: PictureGraph
        },
        {
          path: '/fund',
          component: Fund
        },
        {
          path: '/fundData',
          name: 'FundData',
          component: FundData
        },
        {
          path: '/fundMetric',
          name: 'FundMetric',
          component: FundMetric
        },
        {
          path: '/game',
          component: Game
        },
        { path: '/stockSeason', name: 'StockSeason', component: StockSeason },
        { path: '/stockTrade', name: 'StockTrade', component: StockTrade },
        { path: '/stockAccount', name: 'StockAccount', component: StockAccount },
        { path: '/stockRank', name: 'StockRank', component: StockRank },
        { path: '/stockProfit', name: 'StockProfit', component: StockProfit },
        { path: '/stockPlayerDetail', name: 'StockPlayerDetail', component: StockPlayerDetail },
        { path: '/stockBot', name: 'StockBot', component: StockBot }
      ]
    }
  ]
})

export default router
