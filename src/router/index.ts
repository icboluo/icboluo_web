import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import FundData from "@/views/FundData.vue";
import FrontPage from "../views/FrontPage.vue";
import Note from "@/views/Note.vue";
import Fund from "@/views/Fund.vue";
import Game from "@/views/Game.vue";
import TableList from "@/views/TableList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      component: HomeView
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/frontPage",
      name: "FrontPage",
      component: FrontPage,
      children: [
        {
          // 这个/在这里代表子目录，如果不加，会到全局去找目录路由（而不是子目录中找） .../note（上面是没有的
          path: "/note",
          component: Note
        },
        {
          path: "/tableList",
          name: "TableList",
          component: TableList
        },
        {
          path: "/fund",
          component: Fund
        },
        {
          path: "/fundData",
          name: "FundData",
          component: FundData
        },
        {
          path: "/game",
          component: Game
        }
      ]
    }
  ]
});

export default router;
