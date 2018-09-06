import Vue from "vue";
import Router from "vue-router";

const loadView = (view: string) => {
  return () => import(`@/views/${view}.vue`);
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: loadView("Discover")
    },
    {
      path: "/files",
      name: "files",
      component: loadView("Files")
    },
    {
      path: "/playlists",
      name: "playlists",
      component: loadView("Playlists")
    },
    {
      path: "/most-played",
      name: "most-played",
      component: null
    },
    {
      path: "/settings",
      name: "settings",
      component: null
    }
  ]
});
