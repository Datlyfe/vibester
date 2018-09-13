<template>
  <Message v-if="songs.length==0" msg="Search Came Up Empty" />
  <ul v-else class="songs_list">
    <li @click="cue(song)" class="song" v-for="song in songs" :key="song.id">
      <div class="placeholder js-loading">
      <!-- <div class="placeholder js-loading"> -->
        <img @load="handleImageLoad"  class="preloader" :src="song.album.cover_medium">
        <div @click="cue(song)" class="image animated fadeIn" :style="getBgImg(song.album.cover_medium)"></div>
      </div>
      <div class="song_info">
        <span class="title">{{shorten(song.title,17)}}</span>
        <span class="artist">{{shorten(song.artist.name,17)}}</span>          
      </div>
    </li>
  </ul>
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import { shorten } from "@/services/helpers";
import Message from "@/components/Message.vue";


import { ISong } from "@/models/song";
export default Vue.extend({
  props: ["songs"],
  components:{
    Message
  },
  methods: {
    shorten,
    getBgImg(src: string) {
      return { backgroundImage: `url(${src})` };
    },
    cue(song: ISong) {
      this.$store.dispatch("PLAY_SONG", { song, isLocal: false });
    },
    handleImageLoad(e) {
      e.target.parentNode.classList.remove("js-loading");
      e.target.remove();
    }
  }
});
</script>
