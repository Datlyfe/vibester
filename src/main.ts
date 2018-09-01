import Vue from "vue";
import App from "@/App.vue";
import router from "./router";
import store from "./store";
import Resource from "./plugins/resource";
import * as resources from "./resources";
import AsyncComputed from "vue-async-computed";
import { ipcRenderer } from "electron";
import db from '@/db';

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
    db.table('songs').toArray().then(songs=>{
      store.state.localSongs=songs;
    })

    ipcRenderer.on("setFolder", async (_, folder) => {
      if (store.state.folder == folder) {
        return;
      }
      store.state.folder = folder;
      localStorage.setItem("folder", folder);
      store.dispatch('READ_MUSIC_FOLDER');
    });
  },
  render: h => h(App)
}).$mount("#app");
