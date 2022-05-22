import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import Login from '../view/Login'
import Note from '../view/Note'
import FundData from '../view/FundData'
import Fund from '../view/Fund'
import Game from '../view/Game'
import FrontPage from '../view/FrontPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/fundData',
      name: 'FundData',
      component: FundData
    },
    {
      path: '/frontPage',
      name: 'FrontPage',
      component: FrontPage,
      children: [{
        // 这个/在这里代表子目录，如果不加，会到全局去找目录路由（而不是子目录中找） .../note（上面是没有的
        path: '/note',
        component: Note
      },
      {
        path: '/fund',
        component: Fund
      },
      {
        path: '/game',
        component: Game
      }]
    }
  ]
})
