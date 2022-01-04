import { createRouter, createWebHashHistory } from "vue-router";
import Settings from "../views/Settings.vue";
import CryptosView from "../views/CryptosView.vue";

const routes = [
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/",
    name: "Cryptos",
    component: CryptosView
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
