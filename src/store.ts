import Vue from "vue";
import Vuex from "vuex";
import db from "@/db";
import bus from "@/services/bus";
import * as media from "@/services/media";
import { default as toast } from "izitoast";

import { ISong } from "@/models/song";
import { IPlaylist } from "@/models/playlist";
import { PLAY_SONG } from '@/types/actionTypes';

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
    volumeLevel: localStorage.getItem("volumeLevel") || 0.5
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
      localStorage.setItem("volumeLevel", level);
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
        dispatch(PLAY_SONG, { song: source[0], isLocal: true, inPlaylist });
      } else {
        dispatch(PLAY_SONG, {
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
        dispatch(PLAY_SONG, {
          song: source[size - 1],
          isLocal: true,
          inPlaylist
        });
      } else {
        dispatch(PLAY_SONG, {
          song: source[index - 1],
          isLocal: true,
          inPlaylist
        });
      }
    },
    PLAY_RANDOM_SONG({ state, dispatch }, { inPlaylist }) {
      const source = inPlaylist
        ? state.playlists.filter(p => p.id == inPlaylist)[0].songs
        : state.localSongs;
      const size = source.length;
      dispatch(PLAY_SONG, {
        song: source[Math.floor(Math.random() * (size - 1))],
        isLocal: true,
        inPlaylist
      });
    },
    async NEW_PLAYLIST({ state }) {
      let p: IPlaylist = { name: "New Playlist", songs: [] };
      p.id = await db.table("playlists").add(p);
      state.playlists.push(p);
      toast.destroy();
      toast.show({
        message: `${p.name} has been created`,
        position: "topRight",
        icon: "fa fa-check",
        iconColor: "green",
        timeout: 3000,
        progressBarColor: "green",
        transitionIn: "fadeInDown"
      });
      return p;
    },
    RENAME_PLAYLIST({ state }, { id, name }) {
      let index = state.playlists.findIndex(song => song.id == id);
      state.playlists[index].name = name;
      db.table("playlists").update(id, { name });
    },
    async DELETE_PLAYLIST({ state }, id) {
      let index = state.playlists.findIndex(p => p.id == id);
      let name = state.playlists[index].name;
      state.playlists.splice(index, 1);
      await db.table("playlists").delete(id);
      toast.destroy();
      toast.show({
        message: `${name} has been deleted`,
        position: "topRight",
        icon: "fa fa-trash-o",
        iconColor: "#db1d40",
        timeout: 2000,
        progressBarColor: "#db1d40",
        transitionIn: "fadeInDown"
      });
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
      await db.table("playlists").update(p.id, { songs: p.songs });
      let size = songsIds.length;
      let message = `${size} ${
        size <= 1 ? "song" : "songs"
      } has been added to ${p.name}`;
      toast.destroy();
      toast.show({
        message,
        position: "topRight",
        timeout: 2500,
        iconColor: "green",
        icon: "fa fa-check",
        progressBarColor: "green",
        transitionIn: "fadeInDown"
      });
    },
    async REMOVE_SONG_FROM_PLAYLIST({ state }, { songId, playlistId }) {
      let pIndex = state.playlists.findIndex(p => p.id == playlistId);
      let sIndex = state.playlists[pIndex].songs.findIndex(s => s.id == songId);
      state.playlists[pIndex].songs.splice(sIndex, 1);
      await db
        .table("playlists")
        .update(playlistId, { songs: state.playlists[pIndex].songs });
    },
    NEW_SONG_NOTIF(_, { title, artist, cover }) {
      toast.destroy();
      toast.show({
        title,
        message: artist,
        image: cover,
        position: "topRight",
        timeout: 2500,
        transitionIn: "fadeInDown"
      });
    }
  }
});
