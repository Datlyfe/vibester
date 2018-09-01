import Vue from "vue";
import Vuex from "vuex";
import db from "@/db";
import * as media from "@/services/media";
import { Song } from "@/models/song";
import { Playlist } from "@/models/playlist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    folder: localStorage.getItem("folder") || null,
    localSongs: <Array<Song>>[],
    playlists: <Array<Playlist>>[],

    loading: <boolean>false,
    localSongsQueue: <Array<Song>>[] // TODO
  },
  mutations: {},
  actions: {
    async READ_MUSIC_FOLDER({ state }) {
      if (!state.folder) return;
      state.loading = true;
      state.localSongs = [];
      await db.table("songs").clear();
      const files = await media.loadMediaFiles(state.folder);
      if (!files) return;
      for (let file of files) {
        const song = await media.getMetadata(file);
        state.localSongs.push(song);
        await db.table("songs").add(song);
      }
      state.loading = false;
    },
    async ADD_TO_QUEUE({ state }, payload) {
      const { songs, immediate } = payload;
      for (let songId of songs) {
        let song = await db.table("songs").get({ id: songId });
        song.cover = await media.fetchCover(song.path);
        state.localSongsQueue.push(song);
      }
    }
  }
});
