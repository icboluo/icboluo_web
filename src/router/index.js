import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import Login from '../view/Login'
import Note from '../view/Note'
import FundData from '../view/FundData'
import Fund from '../view/Fund'
import Game from '../view/Game'

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
      path: '/note',
      name: 'Note',
      component: Note
    },
    {
      path: '/fundData',
      name: 'FundData',
      component: FundData
    },
    {
      path: '/fund',
      name: 'Fund',
      component: Fund
    },
    {
      path: '/game',
      name: 'Game',
      component: Game
    }
  ]
})
