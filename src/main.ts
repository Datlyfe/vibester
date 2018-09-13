import Vue from "vue";
import router from "./router";
import store from "./store";
import Home from "@/views/Home.vue";
import Resource from "./plugins/resource";
import AsyncComputed from "vue-async-computed";
import { ipcRenderer } from "electron";
import db from "@/db";
import { ISong } from "@/models/song";
import { IPlaylist } from "@/models/playlist";
import * as media from "@/services/media";
import VueSVGIcon from "vue-svgicon";
import * as resources from "./resources";
import VueIziToast from "vue-izitoast";
import "izitoast/dist/css/iziToast.min.css";

Vue.use(VueIziToast);
console.log(VueIziToast)
Vue.use(VueSVGIcon);
Vue.use(AsyncComputed);
Vue.config.productionTip = false;
Vue.use(Resource, {
  endpoint: "https://api.deezer.com/",
  resources
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created() {
    // window.addEventListener('resize',(e)=>{
    //   console.log(e);
    // })
    // db.table('songs').clear();
    // db.table('playlists').clear();

    db.table("songs")
      .toArray()
      .then((songs: ISong[]) => {
        store.state.localSongs = media.simpleSort(songs, "asc");
      });

    db.table("playlists")
      .toArray()
      .then((playlists: IPlaylist[]) => {
        store.state.playlists = playlists;
      });

    ipcRenderer.on("setFolder", (_, folder) => {
      if (store.state.folder == folder) {
        return;
      }
      store.state.folder = folder;
      localStorage.setItem("folder", folder);
      store.dispatch("READ_MUSIC_FOLDER");
    });
  },
  render: h => h(Home)
}).$mount("#app");
