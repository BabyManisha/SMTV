import Vue from "vue";
import Router from "vue-router";
import Countries from "./views/Countries.vue";
import Channels from "./views/Channels.vue";
import Live from "./views/Live.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Countries
    },
    {
      path: "/countries",
      name: "countries",
      component: Countries
    },
    {
      path: "/channels/:countryCode",
      name: "channels",
      component: Channels,
      props: true
    },
    {
      path: "/live",
      name: "live",
      component: Live
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
