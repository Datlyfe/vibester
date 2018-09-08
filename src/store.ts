import Vue from "vue";
import Vuex from "vuex";
import db from "@/db";
import * as media from "@/services/media";
import bus from "@/services/bus";

import { ISong } from "@/models/song";
import { IPlaylist } from "@/models/playlist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    folder: localStorage.getItem("folder") || null,
    localSongs: [] as ISong[],
    playlists: [] as IPlaylist[],
    loading: false as boolean,
    localSongsQueue: [] as ISong[],
    songsFilter: "" as string
  },
  mutations: {
    songsFilter(state, term: string) {
      state.songsFilter = term;
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
      state.localSongs = media.simpleSort(state.localSongs, "asc");
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
    PLAY_SONG(_, song) {
      bus.$emit("newCue", song, true);
    },
    PLAY_NEXT_SONG({ state, dispatch }, { id }) {
      let index = state.localSongs.findIndex(song => song.id == id);
      let size = state.localSongs.length;
      if (size > 0 && index == size - 1) {
        dispatch("PLAY_SONG", state.localSongs[0]);
      } else {
        dispatch("PLAY_SONG", state.localSongs[index + 1]);
      }
    },
    PLAY_PREV_SONG({ state, dispatch }, { id }) {
      let index = state.localSongs.findIndex(song => song.id == id);
      let size = state.localSongs.length;

      if (size > 0 && index == 0) {
        dispatch("PLAY_SONG", state.localSongs[size - 1]);
      } else {
        dispatch("PLAY_SONG", state.localSongs[index - 1]);
      }
    },
    async NEW_PLAYLIST({ state }) {
      let p: IPlaylist = { name: "New Playlist", songs: [] };
      p.id = await db.table("playlists").add(p);
      state.playlists.push(p);
    },
    RENAME_PLAYLIST({ state }, { id, name }) {
      let index = state.playlists.findIndex(song => song.id == id);
      state.playlists[index].name = name;
      db.table("playlists").update(id, { name });
    },
    DELETE_PLAYLIST({ state }, id) {
      let index = state.playlists.findIndex(song => song.id == id);
      state.playlists.splice(index, 1);
      db.table("playlists").delete(id);
    },
    async ADD_TO_PLAYLIST({ state }, { songId }) {
      let p: IPlaylist = await db.table("playlists").get(55);
      let song: ISong = await db.table("songs").get(songId);
      p.name = `Test${p.id}`;
      p.songs.push(song);
      await db.table("playlists").put(p);
    }
  }
});
