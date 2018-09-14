<template>
  <Message v-if="noPlaylist" msg="You Have 0 Playlists" />
  <Message v-else-if="p.id==-1" msg="Select A Playlist" />  
  <div v-else>
    <Header :cap="false" :title="p.name">
      <div class="search" slot="search"></div>
    </Header>
    <div v-if="!isEmpty" class="p-feed animated fadeIn">
      <div ref="table" class="table">
        <virtual-list class="vv-list" wclass="v-list" :size="35" :remain="17" :bench="0">
          <div @contextmenu="openContextMenu(song.id)" @click="cue(song)" :class="{'songPlaying':songPlaying && songPlaying.id==song.id}" v-for="(song,index) in p.songs" class="row" :key="song.id">
            <div style="width:5%" class="cell">{{index+1}}</div>
            <div style="width:30%" class="cell">{{song.title}}</div>
            <div style="width:30%" class="cell">{{song.artist}}</div>
            <div style="width:10%" class="cell">{{song.duration}}</div>
            <div style="width:25%" class="cell indicator">
              <!-- SOME ANIMATED INDICATOR SHOULD BE HERE -->
            </div>
          </div>
        </virtual-list>
      </div>
    </div>
    <Message v-else msg="Playlist is Empty" />
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
import Message from "@/components/Message.vue";
import VirtualList from "vue-virtual-scroll-list";
import { remote } from "electron";
import { createPlaylistSongMenu } from "@/services/context";
import { PLAY_SONG } from "@/types/actionTypes";

const { Menu } = remote;

export default Vue.extend({
  props: ["p", "noPlaylist"],
  components: {
    Header,
    VirtualList,
    Message
  },
  data() {
    return {};
  },
  computed: {
    isEmpty() {
      return this.p.songs && this.p.songs.length == 0;
    },
    songPlaying() {
      return this.$store.state.songPlaying;
    }
  },
  methods: {
    openContextMenu(songId) {
      const context = Menu.buildFromTemplate(
        createPlaylistSongMenu(songId, this.p.id)
      );
      context.popup({});
    },
    cue(song) {
      this.$store.dispatch(PLAY_SONG, {
        song,
        isLocal: true,
        inPlaylist: this.p.id
      });
    },
    getBgImg(src) {
      return { backgroundImage: `url(${src})` };
    },
    getName(name) {
      return `Reading From PLaylist : ${name}`;
    }
  },
  mounted() {}
});
</script>
