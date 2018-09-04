<template>
  <ul class="songs_list">
    <li @click="cue(song)" class="song" v-for="song in songs" :key="song.id">
      <div class="placeholder js-loading">
        <img @load="handleImageLoad"  class="preloader" :src="song.album.cover_medium">
        <div @click="cue(song)" class="image animated fadeIn" :style="getBgImg(song.album.cover_medium)"></div>
      </div>
      <div class="song_info">
        <span class="title">{{song.title,12}}</span>
        <span class="artist">{{song.artist.name}}</span>          
      </div>
    </li>
  </ul>
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import { ISong } from "@/models/song";
export default Vue.extend({
  props: ["songs"],
  methods: {
    getBgImg(src: string) {
      return { backgroundImage: `url(${src})` };
    },
    cue(song: ISong) {
      bus.$emit("newCue", song, false);
    },
    handleImageLoad(e) {
      e.target.parentNode.classList.remove("js-loading");
      e.target.remove();
    }
  }
});
</script>
