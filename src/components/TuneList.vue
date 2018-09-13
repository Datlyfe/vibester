<template>
  <Message v-if=" allSongs.length==0" msg="Your Library is Empty 😔" />
  <Message v-else-if="songs.length==0 && allSongs.length>0" msg="Your Search Has No Results 😔"/>
  <!-- TABLE -->
  <div v-else ref="table" class="table">
    <!-- TABLE HEADER -->
    <div  class="row header">
      <div class="cell title">Title</div>
      <div class="cell artist">Artist</div>
      <div class="cell album">Album</div>
      <div class="cell duration">Duration</div>
    </div>
    <!-- TABLE BODY -->
    <virtual-list class="vv-list" wclass="v-list" :size="35" :remain="16" :bench="0">
      <div  :class="{'selected':selected.includes(song.id),'songPlaying': songPlaying && songPlaying.id==song.id}" tabindex="-1" @contextmenu="showContextMenu" @mousedown="selectSong($event,song.id,index)"  @dblclick="cue(song)" v-for="(song,index) in songs" class="row" :key="song.id">
        <div class="cell title">{{song.title}}</div>
        <div class="cell artist">{{song.artist}}</div>
        <div class="cell album">{{song.album}}</div>
        <div class="cell duration">{{song.duration}}</div>
        <div style="width:15%" class="cell indicator">
         <!-- SOME ANIMATED INDICATOR SHOULD BE HERE -->
        </div>
      </div>
    </virtual-list>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import { ISong } from "@/models/song";
import { remote } from "electron";
import {
  isCtrlKey,
  getSelected,
  isLeftClick,
  isRightClick
} from "@/services/utils";
import VirtualList from "vue-virtual-scroll-list";
import Message from "@/components/Message.vue";
import { IPlaylist } from "@/models/playlist";
import { createTuneListContext } from "@/services/context";
const { Menu } = remote;
export default Vue.extend({
  props: ["songs"],
  data() {
    return {
      selected: []
    };
  },
  components: {
    VirtualList,
    Message
  },
  computed: {
    songPlaying() {
      return this.$store.state.songPlaying;
    },
    allSongs() {
      return this.$store.state.localSongs;
    }
  },
  methods: {
    cue(song: ISong) {
      this.$store.dispatch("PLAY_SONG", { song, isLocal: true });
    },
    selectSong(e, id, index) {
      if (isLeftClick(e) || (isRightClick(e) && this.isSelectableTrack(id))) {
        if (isCtrlKey(e)) {
          this.toggleSelectionById(id);
        } else if (e.shiftKey) {
          if (this.selected.length === 0) {
            const selected = [id];
            this.selected = selected;
          } else this.multiSelect(index);
        } else {
          const selected = [id];
          this.selected = selected;
        }
      }
    },
    showContextMenu() {
      const context = Menu.buildFromTemplate(
        createTuneListContext(this.selected)
      );
      context.popup({});
    },
    toggleSelectionById(id: number) {
      let selected = [...this.selected];
      if (selected.includes(id)) {
        selected.splice(selected.indexOf(id), 1);
      } else {
        selected.push(id);
      }
      this.selected = selected;
    },
    multiSelect(index: number) {
      this.selected = getSelected([...this.selected], [...this.songs], index);
    },
    isSelectableTrack(id: number) {
      return !this.selected.includes(id);
    },
    handleOutsideClick(e) {
      if (this.$refs.table && !this.$refs.table.contains(e.target)) {
        this.selected = [];
      }
    }
  },
  mounted() {},
  created() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  },
  destroyed() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
  }
});
</script>
