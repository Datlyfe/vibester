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
    songsFilter: "" as string,
    songPlaying: null as ISong,
    volumeLevel: localStorage.getItem('volumeLevel') || 0.5
  },
  mutations: {
    songsFilter(state, term: string) {
      state.songsFilter = term;
    },
    setPlaying(state, song) {
      state.songPlaying = song;
    },
    setVolumeLevel(state, level) {
      state.volumeLevel = level;
      localStorage.setItem('volumeLevel',level);
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
    PLAY_SONG(_, { song, isLocal, inPlaylist }) {
      bus.$emit("newCue", { song, isLocal, inPlaylist });
    },
    PLAY_NEXT_SONG({ state, dispatch }, { id, inPlaylist }) {
      const source = inPlaylist
        ? state.playlists.filter(p => p.id == inPlaylist)[0].songs
        : state.localSongs;
      const index = source.findIndex(song => song.id == id);
      const size = source.length;
      if (size > 0 && index == size - 1) {
        dispatch("PLAY_SONG", { song: source[0], isLocal: true, inPlaylist });
      } else {
        dispatch("PLAY_SONG", {
          song: source[index + 1],
          isLocal: true,
          inPlaylist
        });
      }
    },
    PLAY_PREV_SONG({ state, dispatch }, { id, inPlaylist }) {
      const source = inPlaylist
        ? state.playlists.filter(p => p.id == inPlaylist)[0].songs
        : state.localSongs;

      const index = source.findIndex(song => song.id == id);
      const size = source.length;

      if (size > 0 && index == 0) {
        dispatch("PLAY_SONG", {
          song: source[size - 1],
          isLocal: true,
          inPlaylist
        });
      } else {
        dispatch("PLAY_SONG", {
          song: source[index - 1],
          isLocal: true,
          inPlaylist
        });
      }
    },
    async NEW_PLAYLIST({ state }) {
      let p: IPlaylist = { name: "New Playlist", songs: [] };
      p.id = await db.table("playlists").add(p);
      state.playlists.push(p);
      return p;
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
    async ADD_TO_PLAYLIST({ state }, { songsIds, playlistId }) {
      let index = state.playlists.findIndex(song => song.id == playlistId);
      let p: IPlaylist = await db.table("playlists").get(playlistId);
      for (const songId of songsIds) {
        let song: ISong = await db.table("songs").get(songId);
        // song.cover=await media.fetchCover(song.path); // BIG PERFORMANCE HIT
        state.playlists[index].songs.push(song);
        p.songs.push(song);
      }
      db.table("playlists").update(p.id, { songs: p.songs });
    }
  }
});
