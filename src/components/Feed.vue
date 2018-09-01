<template>
  <ul class="songs_list">
    <li @click="cue(song)" class="song" v-for="song in songs" :key="song.id">
      <div class="placeholder js-loading">
        <img class="preloader" @load="handleImageLoad" :src="song.album.cover_medium">
        <div @click="cue(song)" class="image animated fadeIn" :style="getBgImg(song.album.cover_medium)"></div>
      </div>
      <div class="song_info">
        <span class="title">{{shorten(song.title,12)}}</span>
        <span class="artist">{{shorten(song.artist.name,12)}}</span>          
      </div>
    </li>
  </ul>
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import { shorten } from "@/services/helpers";
export default Vue.extend({
  name: "feed",
  props: ["songs"],
  data() {
    return {};
  },
  computed: {},
  methods: {
    shorten,
    getBgImg(src: string) {
      return { backgroundImage: `url(${src})` };
    },
    cue(song: any) {
      bus.$emit("newCue", song, false);
    },
    handleImageLoad(e: any) {
      e.target.parentNode.classList.remove("js-loading");
      e.target.remove();
    },
    handleImageError() {
      // TODO
    }
  }
});
</script>


<style lang="scss" scoped>
@import "../sass/tools/Mixins";

.songs_list {
  width: 100%;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}

.song_info {
  font-size: 1.6rem;
  margin: 0 2rem;
  .title {
    display: block;
  }
  .artist {
    color: silver;
    display: block;
  }
  .remove {
    display: block;
    color: #db1d40;
    cursor: pointer;
    font-weight: 700;
  }
}

.song {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 1rem;
  width: calc(100% / 5 - 2rem);

  @include respond-above(xl) {
    width: calc(100% / 6 - 2rem);
  }
  @include respond-above(xxl) {
    width: calc(100% / 7 - 2rem);
  }
}

.song_image {
  animation-duration: 0.8s;
  position: relative;
  backface-visibility: hidden;
  width: 100%;
  margin-bottom: 1rem;
  object-fit: cover;
  background: #dfdfdf;
  padding: 0.3rem;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: red;
  }
}
</style>


