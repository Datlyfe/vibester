<template>
  <div class="footer">
    <Player v-if="song.id" :key="song.id" :song="song" :isLocal="isLocal"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@/components/Player.vue";
import { Song } from "@/models/song";
import bus from "@/services/bus";
import * as media from "@/services/media";

export default Vue.extend({
  data() {
    return {
      song: {} as Song,
      isLocal: false
    };
  },
  components: {
    Player
  },
  mounted() {
    bus.$on("newCue", async (song: any, isLocal: boolean) => {
      this.isLocal = isLocal;
      if (isLocal) {
        let cover = await media.fetchCover(song.path);
        this.song = { ...song, cover, src: media.parseUri(song.path) };
      } else {
        let { preview, title, id } = song;
        let { cover_medium: cover } = song.album;
        let { name: artist } = song.artist;
        this.song = { artist, src: preview, title, cover, id };
      }
    });
  }
});
</script>


<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100px;
  z-index: 1000;
  background: rgba(36, 4, 4, 0.85);
  display: flex;
  align-self: center;
  box-shadow: 0 -5px 5px -5px #1a1a1a;
}
</style>
