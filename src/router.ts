import Vue from "vue";
import Router from "vue-router";

const loadView = (view: string) => {
  return () => import(`@/views/${view}.vue`);
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/discover",
      name: "discover",
      component: loadView("Discover")
    },
    {
      path: "/",
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
      component: loadView("Settings")
    }
  ]
});
