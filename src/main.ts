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
import * as resources from "./resources";

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
        console.log(playlists);
        store.state.playlists = playlists;
      });

    ipcRenderer.on("setFolder", async (_, folder) => {
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
