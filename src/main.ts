import Vue from "vue";
import router from "./router";
import store from "./store";
import Home from "@/views/Home.vue";
import Resource from "./plugins/resource";
import db from "@/db";
import VueSVGIcon from "vue-svgicon";
import * as media from "@/services/media";
import * as resources from "./resources";
import { IPlaylist } from "@/models/playlist";
import { ISong } from "@/models/song";
import { ipcRenderer } from "electron";
import { READ_MUSIC_FOLDER } from '@/types/actionTypes';

Vue.use(VueSVGIcon);
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
      store.dispatch(READ_MUSIC_FOLDER);
    });
  },
  render: h => h(Home)
}).$mount("#app");
