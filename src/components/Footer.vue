<template>
  <div class="footer">
    <Player v-if="song.id" :key="song.id" :song="song" :isLocal="isLocal"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@/components/Player.vue";
import { ISong } from "@/models/song";
import bus from "@/services/bus";
import * as media from "@/services/media";
import {parseSong} from "@/services/utils";


export default Vue.extend({
  data() {
    return {
      song: {} as ISong,
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
        this.song=parseSong(song);
      }
    });
  }
});
</script>


<style lang="scss">
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
