import Vue from "vue";
import Vuex from "vuex";
import db from "@/db";
import * as media from "@/services/media";
import bus from "@/services/bus";

import { Song } from "@/models/song";
import { Playlist } from "@/models/playlist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    folder: localStorage.getItem("folder") || null,
    localSongs: <Array<Song>>[],
    playlists: <Array<Playlist>>[],
    loading: <boolean>false,
    localSongsQueue: <Array<Song>>[], // TODO
    songsFilter:""
  },
  mutations: {
    songsFilter(state,term){
      state.songsFilter=term;
    }
  },
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
      state.localSongs=media.simpleSort(state.localSongs,'asc');
      state.loading = false;
    },
    async ADD_TO_QUEUE({ state }, payload) {
      const { songs, immediate } = payload;
      for (let songId of songs) {
        let song = await db.table("songs").get({ id: songId });
        song.cover = await media.fetchCover(song.path);
        state.localSongsQueue.push(song);
      }
    },
    PLAY_SONG({state},song){
      bus.$emit('newCue',song,true);
    },
    PLAY_NEXT_SONG({ state,dispatch }, { id }) {
      let index = state.localSongs.findIndex(song => song.id == id);
      let size = state.localSongs.length;
      if (size > 0 && index == size - 1) {
        dispatch('PLAY_SONG',state.localSongs[0])
      } else {
        dispatch('PLAY_SONG',state.localSongs[index+1])
      }
    },
    PLAY_PREV_SONG({ state,dispatch }, { id }) {
      let index = state.localSongs.findIndex(song => song.id == id);
      let size = state.localSongs.length;

      if (size > 0 && index == 0) {
        dispatch('PLAY_SONG',state.localSongs[size-1])
      } else {
        dispatch('PLAY_SONG',state.localSongs[index-1])
      }
    }
  }
});
