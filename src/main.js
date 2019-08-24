import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueResource from "vue-resource";

require("./assets/Scss/styles.scss");

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.prototype.$eventHub = new Vue();

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
